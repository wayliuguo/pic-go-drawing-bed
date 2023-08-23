import { RangeOptions, VirtualOptions, updateType } from './props'

export const initVirtual = (param: VirtualOptions, update: updateType) => {
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }

  const getPadFront = () => {
    return param.estimateSize * range.start
  }
  const getPadBehind = () => {
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * param.estimateSize
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
  checkRange(0, param.keeps - 1)
  return {}
}
