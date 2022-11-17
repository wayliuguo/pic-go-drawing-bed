import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
}

// 后续每个组件渲染的时候都会有一个watcher
export function mountComponent(vm, el) {
    // 更新函数 数据变化后 会再次调用此函数
    let updateComponent = () => {
        // 1.调用render函数，生成、更新虚拟dom
        // 2.用虚拟dom生成真实dom

        vm._update(vm._render())
    }
    // updateComponent()
    // 观察者模式 属性：“被观察者” 刷新页面：“观察者”
    new Watcher(vm, updateComponent, () => {
        console.log('更新视图了')
    }, true) // true 表示是一个渲染watcher，后续有其他watcher
}