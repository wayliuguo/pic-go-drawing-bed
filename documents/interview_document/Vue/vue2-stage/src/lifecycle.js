import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        patch(vm.$el, vnode)
    }
}

export function mountComponent(vm, el) {
    // 更新函数 数据变化后 会再次调用此函数
    let updateComponent = () => {
        // 1.调用render函数，生成、更新虚拟dom
        // 2.用虚拟dom生成真实dom

        vm._update(vm._render())
    }
    updateComponent()
}