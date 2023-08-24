import { RangeOptions, VirtualOptions, updateType } from './props'

const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC'
}

export const initVirtual = (param: VirtualOptions, update: updateType) => {
  // 初始偏移量
  let offsetValue = 0
  const sizes = new Map<string | number, number>()
  let calcType = CALC_TYPE.INIT
  let fixedSizeVal = 0
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }

  const isFixed = () => {
    return calcType === CALC_TYPE.FIXED
  }

  const getEstimateSize = () => {
    return isFixed() ? fixedSizeVal : param.estimateSize
  }

  const getPadFront = () => {
    return getEstimateSize() * range.start
  }
  const getPadBehind = () => {
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
  const checkRange = (start: number, end: number) => {
    const total = param.uniqueIds.length
    const keeps = param.keeps
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      start = end - keeps + 1
    }
    updateRange(start, end)
  }

  const getScrollOvers = () => {
    // 划过偏移量 / 每项的高度 = 划过的个数
    return Math.floor(offsetValue / getEstimateSize())
  }

  const getEndByStart = (start: number) => {
    const computedEnd = start + param.keeps - 1
    const end = Math.min(computedEnd, param.uniqueIds.length - 1)
    return end
  }

  // 向上滑动
  const handleFront = () => {
    const overs = getScrollOvers()
    if (overs > range.start) {
      return
    }
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }

  const handleBehind = () => {
    const overs = getScrollOvers()
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
  }

  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize
  }
}
