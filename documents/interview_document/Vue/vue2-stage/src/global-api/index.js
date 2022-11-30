import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
    // 用来存放全局的配置，每个组件初始化的时候都会和options选项进行合并
    // 如 Vue.component Vue.filter Vue.directive
    Vue.options = {}
    
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options)
        console.log('>>>options', this.options)
        return this
    }
}