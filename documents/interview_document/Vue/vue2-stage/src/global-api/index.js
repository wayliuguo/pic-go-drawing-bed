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

    Vue.options.components = {}
    Vue.options._base = Vue
    let cid = 0
    Vue.component = function(id, definition) {
        definition.name = definition.name || id
        // 保证组件的隔离，每个组件都会产生一个新的类，去继承父类
        definition = this.options._base.extend(definition)
        this.options['components'][id] = definition
    }
    // 创建一个子类，继承于Vue，并返回这个类
    Vue.extend = function (extendOptions) {
        const Super = this
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        Sub.cid = cid++
        // 原型继承
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        return Sub
    }
}