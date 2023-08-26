import { RangeOptions, VirtualOptions, updateType } from './props'

/**
 * INIT 初始化
 * FIXED 固定
 * DYNAMIC 动态列表
 */
const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC'
}

/**
 *
 * @param param keeps: 列表个数 buffer：缓冲个数 estimateSize：预估高度 uniqueIds：数据源id数组
 * @param update 更新函数
 * @returns handleScroll、saveSize
 */
export const initVirtual = (param: VirtualOptions, update: updateType) => {
  // 初始化范围，默认全是0
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }
  // 初始偏移量
  let offsetValue = 0
  const sizes = new Map<string | number, number>()
  let calcType = CALC_TYPE.INIT
  let fixedSizeVal = 0
  let firstRangeAvg: number

  const isFixed = () => {
    return calcType === CALC_TYPE.FIXED
  }

  // 获取item高度
  const getEstimateSize = () => {
    return isFixed() ? fixedSizeVal : firstRangeAvg || param.estimateSize
  }

  const getIndexOffset = (idx: number) => {
    if (!idx) return 0
    let offset = 0
    for (let i = 0; i < idx; i++) {
      let indexSize = sizes.get(param.uniqueIds[i])
      offset += typeof indexSize === 'number' ? indexSize : getEstimateSize()
    }
    return offset
  }

  // 计算上padding
  const getPadFront = () => {
    // 如果是固定高度的虚拟列表，则返回 开始*item高度
    if (isFixed()) {
      return fixedSizeVal * range.start
    } else {
      // 将滚动后的元素累加一遍 计算上高度
      return getIndexOffset(range.start)
    }
  }
  // 计算下padding
  const getPadBehind = () => {
    // 获取最后一个item的下标
    // 通过他们的差值与item高度相乘得到下padding
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * getEstimateSize()
  }
  const updateRange = (start: number, end: number) => {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }
  // 通过开始与结束检查范围
  const checkRange = (start: number, end: number) => {
    // 获取总的数据长度
    const total = param.uniqueIds.length
    // 获取展示的长度
    const keeps = param.keeps
    // 如果总的长度小于展示的长度，直接返回所有数据接口
    // 如果滚动到最后了，开始需要重新计算
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      start = end - keeps + 1
    }
    // 更新范围
    updateRange(start, end)
  }

  const getScrollOvers = () => {
    // 划过偏移量 / 每项的高度 = 划过的个数
    if (isFixed()) {
      return Math.floor(offsetValue / getEstimateSize())
    } else {
      let low = 0
      let high = param.uniqueIds.length
      let middle = 0
      let middleOffset = 0
      while (low <= high) {
        middle = low + Math.floor((high - low) / 2)
        middleOffset = getIndexOffset(middle)
        if (middleOffset === offsetValue) {
          return middle
        } else if (middleOffset < offsetValue) {
          low = middle + 1
        } else if (middleOffset > offsetValue) {
          high = middle - 1
        }
      }
      return low > 0 ? --low : 0
    }
  }

  const getEndByStart = (start: number) => {
    // 计算最后的下标
    const computedEnd = start + param.keeps - 1
    const end = Math.min(computedEnd, param.uniqueIds.length - 1)
    return end
  }

  // 向上滑动
  const handleFront = () => {
    // 获取滑动的个数
    const overs = getScrollOvers()
    if (overs > range.start) {
      return
    }
    //  与缓存区对比
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }

  // 向下滑动
  const handleBehind = () => {
    // 获取滑动的个数
    const overs = getScrollOvers()
    // 如果还在缓存范围内则不用更新
    if (overs < range.start + param.buffer) {
      return
    }
    checkRange(overs, getEndByStart(overs))
  }

  const handleScroll = (offset: number) => {
    // 判断滚动方向
    const direction = offset < offsetValue ? 'FRONT' : 'BEHIND'
    offsetValue = offset
    if (direction === 'FRONT') {
      handleFront()
    } else if (direction === 'BEHIND') {
      handleBehind()
    }
  }

  const saveSize = (id: string | number, size: number) => {
    sizes.set(id, size)
    if (calcType === CALC_TYPE.INIT) {
      fixedSizeVal = size
      calcType = CALC_TYPE.FIXED
    } else if (calcType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      calcType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0
    }
    if (calcType === CALC_TYPE.DYNAMIC) {
      if (sizes.size < Math.min(param.keeps, param.uniqueIds.length)) {
        firstRangeAvg = Math.round(
          [...sizes.values()].reduce((acc, val) => acc + val, 0) / sizes.size
        )
      }
    }
  }

  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize
  }
}
