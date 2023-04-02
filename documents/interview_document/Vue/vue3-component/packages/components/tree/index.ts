import { withInstall } from '@zi-shui/utils/with-install'
import _Tree from './src/tree.vue'

const Tree = withInstall(_Tree)

export default Tree

// 组件类型声明，在使用的时候就有了对应的提示
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    ZTree: typeof Tree
  }
}

export * from './src/tree'