import { initState } from "./state"
import { compileToFunctions } from './compiler/index'
import { mountComponent } from "./lifecycle"

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        // el, data
        const vm = this
        vm.$options = options

        // 对数据进行初始化（watch、computed、props、data...）
        // 这些数据都存在于vm.options
        initState(vm)

        // 页面挂载
        if (vm.$options.el) {
            // 将数据挂载到这个模板上
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        // 把模板转化成对应的渲染函数 =》虚拟dom的概念 Vnode =》
        // diff算法更新虚拟dom =》 产生真实节点，更新
        // 如果没有render方法
        if (!options.render) {
            let template = options.template
            // 如果没有模板但是有el
            if (!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunctions(template)
            options.render = render
            console.log('>>>生成的render函数:', options.render)
        }
        // 组件挂载
        mountComponent(vm, el)
    }
}