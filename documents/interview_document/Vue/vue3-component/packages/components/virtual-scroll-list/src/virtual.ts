import { RangeOptions, VirtualOptions, updateType } from './props'

const enum CALC_TYPE {
  INIT = 'INIT', // 初始
  FIXED = 'FIXED', // 固定
  DYNAMIC = 'DYNAMIC' // 动态
}

export function initVirtual(param: VirtualOptions, update: updateType) {
  // 初始化范围参数
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }
  // 初始化元素方式
  let calcType = CALC_TYPE.INIT
  // 默认元素固定高度
  let fixedSizeVal = 0
  // 初始化滚动条偏移量
  let offsetValue: number = 0
  // 收集id=>高度 映射
  const sizes = new Map<string | number, number>()
  // 元素渲染后的高度平均值
  let firstRangeAvg = 0

  // 判断是否是固定高度
  function isFixed() {
    return calcType === CALC_TYPE.FIXED
  }

  // 获取单个元素高度
  function getEstimateSize() {
    // 如果是固定高度，则使用固定高度
    // 否则使用平均值或者预期值
    return isFixed() ? fixedSizeVal : firstRangeAvg || param.estimateSize
  }

  // 获取上paddining
  function getPadFront() {
    // padding-top = 预估高度 * 显示开始下标
    // 准确计算上偏移量
    if (isFixed()) {
      return getEstimateSize() * range.start
    } else {
      // 将滚动后的元素累加一遍计算上高度
      return getIndexOffSet(range.start)
    }
  }

  // 累计计算上偏移量
  function getIndexOffSet(idx: number) {
    if (!idx) return 0
    let offset = 0
    for (let i = 0; i < idx; i++) {
      let indexSize = sizes.get(param.uniqueIds[i])
      offset += typeof indexSize === 'number' ? indexSize : getEstimateSize()
    }
    return offset
  }

  // 获取下padding
  function getPadBehind() {
    // 全部数据末尾下标
    const lastIndex = param.uniqueIds.length - 1
    // padding-bottom = (全部数据末尾下标-显示结束下标) * 预估高度
    return (lastIndex - range.end) * getEstimateSize()
  }

  function checkRange(start: number, end: number) {
    // 所有的数据长度
    const total = param.uniqueIds.length
    // 页面渲染的个数
    const keeps = param.keeps
    // 如果所有的数据长度还达不到渲染的个数，则结束下标是数据长度结束下标
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      // 如果结尾下标与开始下标的差值达不到渲染个数，重新赋值开始下标
      start = end - keeps + 1
    }
    updateRange(start, end)
  }

  // 根据开始与结束下标更新范围
  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }

  // 获取滑动的个数
  function getScrollOvers() {
    if (isFixed()) {
      // 通过 滚动条滚动长度/预估高度 向下取整得到滑动的元素个数
      return Math.floor(offsetValue / getEstimateSize())
    } else {
      // 获取最接近的滚动的那一项，计算每偏移量得到最接近的
      let low = 0 // 起始下标
      let high = param.uniqueIds.length // 末尾下标
      let middle = 0 // 中间下标
      let middleOffset = 0 // 中间下标对应上偏移量
      while (low <= high) {
        middle = low + Math.floor((high - low) / 2)
        middleOffset = getIndexOffSet(middle)
        if (middleOffset == offsetValue) {
          // 如果元素有一个恰好上偏移量=滚动条偏移量
          return middle
        } else if (middleOffset < offsetValue) {
          // 如果对应下标偏移量<滚动偏移量
          low = middle + 1
        } else if (middleOffset > offsetValue) {
          high = middle - 1
        }
      }
      console.log(offsetValue, low)
      // 如果找不到，则使用low的前一个
      return low > 0 ? --low : 0
    }
  }

  // 向上滚动处理函数
  function handleFront() {
    // 获取划过个数
    const overs = getScrollOvers()
    // 如果上滑时滑动的没有超过开始下标，无需更新，比如start： 0， 上一次overs是5这次滑动到4
    if (overs > range.start) {
      return
    }
    // 如果超出了开始下标，则减去缓冲区数量得到开始下标，不能小于0
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }

  // 向下滚动处理函数
  function handleBehind() {
    // 获取划过个数
    const overs = getScrollOvers()
    if (overs < range.start + param.buffer) {
      // 如果划过的还在缓冲区里则不用处理
      return
    }
    // 一旦超出了缓存区，则把滚动的个数作为开始下标计算即可
    checkRange(overs, getEndByStart(overs))
  }

  // 根据开始下标计算结束下标
  function getEndByStart(start: number) {
    // 计算后的结束下标 = 开始下标 + 渲染个数
    const computedEnd = start + param.keeps - 1
    // 由总数可能小于计算出来的结束下标，所以需要取二者较小值
    const end = Math.min(computedEnd, param.uniqueIds.length - 1)
    return end
  }

  // 滚动处理函数
  function handleScroll(offset: number) {
    // 和上一次滚动的高度对比确定方向，FRONT: 向上滚动 BEHIND: 向下滚动
    const direction = offset < offsetValue ? 'FRONT' : 'BEHIND'
    offsetValue = offset
    if (direction === 'FRONT') {
      handleFront()
    } else if (direction === 'BEHIND') {
      handleBehind()
    }
  }

  function saveSize(id: string | number, size: number) {
    // 保存id=>size 映射
    sizes.set(id, size)
    if (calcType === CALC_TYPE.INIT) {
      // 如果是初始化，则记录 fixedSizeVal
      fixedSizeVal = size
      calcType = CALC_TYPE.FIXED
    } else if (calcType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      // 如果不是初始化且高度变化则是动态高度
      calcType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0
    }
    if (calcType === CALC_TYPE.DYNAMIC) {
      // 如果是动态高度,根据已经加载的数据算一个平均值来撑开滚动条
      // 根据当前展示的数据，来计算一个滚动条的值
      if (sizes.size < Math.min(param.keeps, param.uniqueIds.length)) {
        firstRangeAvg = Math.round(
          [...sizes.values()].reduce((acc, val) => acc + val, 0) / sizes.size
        )
      }
    }
  }
  // 初始化检查范围
  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize
  }
}
