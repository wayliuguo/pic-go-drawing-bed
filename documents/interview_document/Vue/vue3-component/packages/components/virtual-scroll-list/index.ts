import { withInstall } from '@zi-shui/utils/with-install'
import _VirtualList from './src/virtual-list'

const VirtualList = withInstall(_VirtualList)
export type { VirtualPorps } from './src/props'
export default VirtualList

// 组件类型声明，在使用的时候就有了对应的提示
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    ZVirtualScrollList: typeof VirtualList
  }
}
