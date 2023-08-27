import { RangeOptions, VirtualOptions, updateType } from './props'

export function initVirtual(param: VirtualOptions, update: updateType) {
  // 初始化范围参数
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }
  let offsetValue: number = 0
  // 获取上paddining
  function getPadFront() {
    // padding-top = 预估高度 * 显示开始下标
    return param.estimateSize * range.start
  }
  // 获取下padding
  function getPadBehind() {
    // 全部数据末尾下标
    const lastIndex = param.uniqueIds.length - 1
    // padding-bottom = (全部数据末尾下标-显示结束下标) * 预估高度
    return (lastIndex - range.end) * param.estimateSize
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
    // 通过 滚动条滚动长度/预估高度 向下取整得到滑动的元素个数
    return Math.floor(offsetValue / param.estimateSize)
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
  // 初始化检查范围
  checkRange(0, param.keeps - 1)
  return {
    handleScroll
  }
}
