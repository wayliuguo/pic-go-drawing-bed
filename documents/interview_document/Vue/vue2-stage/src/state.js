import { isFunction } from "./utils"
import { observe } from "./observer/index"

export function initState (vm) {
    const opts = vm.$options
    // 初始化data
    if (opts.data) {
        initData(vm)
    }
    // 初始化方法
    if (opts.methods) {
        initMethod(vm)
    }
    // 初始化 props
    if (opts.props) {
        initProps(vm)
    }
    // 初始化 computed
    if (opts.computed) {
        initComputed(vm)
    }
    // 初始化 watch
    if (opts.watch) {
        initWatch(vm)
    }

    function proxy (vm, source, key) {
        Object.defineProperty(vm, key, {
            get() {
                return vm[source][key]
            },
            set(newValue) {
                vm[source][key] = newValue
            }
        })
    }
    
    function initData(vm) {
        let data = vm.$options.data
        // vue2 中会将data 中的所有数值进行数据劫持(Object.defineProperty)
        // 如果传入的data 是一个方法，则取其返回值，否则取其值
        data = vm._data = isFunction(data) ? data.call(vm) : data

        // 数据响应式
        observe(data)

        // 数据代理
        for (let key in data) {
            proxy(vm, '_data', key)
        }
    }

    // 未实现的方法
    function initProps() {}
    function initMethod() {}
    function initComputed() {}
    function initWatch() {}
}