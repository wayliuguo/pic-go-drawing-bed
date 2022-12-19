import { nextTick } from "./next-tick"
import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        // 保存当前的虚拟节点
        const preVnode = vm._vnode
        if (!preVnode) {
            // 初次渲染
            vm.$el = patch(vm.$el, vnode)
        } else {
            vm.$el = patch(preVnode, vnode)
        }
        vm._vnode = vnode
    }
    Vue.prototype.$nextTick = nextTick
}

// 后续每个组件渲染的时候都会有一个watcher
export function mountComponent(vm, el) {
    // 更新函数 数据变化后 会再次调用此函数
    let updateComponent = () => {
        // 1.调用render函数，生成、更新虚拟dom
        // 2.用虚拟dom生成真实dom

        vm._update(vm._render())
    }
    
    callHook(vm, 'beforeMount')

    // 观察者模式 属性：“被观察者” 刷新页面：“观察者”
    new Watcher(vm, updateComponent, () => {
        console.log('更新视图了')
    }, true) // true 表示是一个渲染watcher，后续有其他watcher

    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    let handlers = vm.$options[hook]
    if (handlers) {
        for (let i=0; i<handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}