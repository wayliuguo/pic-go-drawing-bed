import { isObject, isReservedTag } from "../utils"

export function createElement(vm, tag, data = {}, ...children) {
    // 在创建虚拟节点的时候我们需要判断这个标签是否是组件，普通标签的虚拟节点和组件标签虚拟节点有所不同
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined)
    } else {
        // 如果tag是组件，应该渲染一个组件的vnode
        let Ctor = vm.$options.components[tag]
        return createComponent(vm, tag, data, data.key, children, Ctor)
    }
}

function createComponent(vm, tag, data, key, children, Ctor) {
    // 获取父类构造函数
    const baseCtor = vm.$options._base
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor)
    }
    // 组件的生命周期钩子(渲染组件时需要调用此初始化方法)
    data.hook = {
        init(vnode){
            // new 的时候等于 new Vue(), 走init()
            let child = vnode.componentInstance = new Ctor({_isComponent: true})
            // 挂载组件
            child.$mount()
        }
    }
    return vnode(vm, `vue-component-${tag}`, data, key, undefined, {Ctor, children})
}

export function createTextNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text,
        componentOptions
    }
}