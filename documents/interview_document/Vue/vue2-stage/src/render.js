import { createElement, createTextNode } from "./vdom/index"

export function renderMixin (Vue) {
    Vue.prototype._c = function () {
        return createElement(this, ...arguments)
    }
    Vue.prototype._v = function (text) {
        return createTextNode(this, text)
    }
    Vue.prototype._s = function (val) {
        return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
    }
    Vue.prototype._render = function() {
        const vm = this
        // 获取 render 函数
        let render = vm.$options.render
        let vnode = render.call(vm)
        console.log('生成的vnode>>>', vnode)
        return vnode
    }
}