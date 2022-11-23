import { isFunction, isObject } from "./utils"
import { observe } from "./observer/index"
import Watcher from "./observer/watcher"
import { Dep } from "./observer/dep"

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
        initComputed(vm, opts.computed)
    }
    // 初始化 watch
    if (opts.watch) {
        initWatch(vm, opts.watch)
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
    
    function initComputed(vm, computed) {
        // 存放计算属性的watcher
        const watchers = vm._computedWatchers = {}
        for (let key in computed) {
            const userDef = computed[key]
            // 依赖的属性变化就重新取值
            let getter = typeof userDef === 'function' ? userDef : userDef.get
            
            // 每个计算属性本质上就是watcher
            // lazy:true 默认不执行
            // 将watcher和属性做一个映射
            watchers[key] = new Watcher(vm, getter, () => {}, {lazy: true})
            // 将key定义在vm上
            defineComputed(vm, key, userDef)
        }
    }
    function defineComputed(vm, key, userDef) {
        let sharedProperty = {}
        if (typeof userDef === 'function') {
            sharedProperty.get = createComputedGetter(key)
        } else {
            sharedProperty.get = createComputedGetter(key)
            sharedProperty.set = userDef.set
        }
        Object.defineProperty(vm, key, sharedProperty)
    }
    function createComputedGetter(key) {
        // 取计算属性的值，走的是这个函数
        return function computedGetter() {
            // this._computedWatchers 包含着所有的计算属性
            // 通过key 可以拿到对应的watcher，这个watcher中包含了getter
            let watcher = this._computedWatchers[key]
            if (watcher.dirty) {
                watcher.evaluate()
            }
            // 如果当前取值后 Dep.target 还有值，需要继续向上收集
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }

    function initWatch(vm, watch) {
        for (const key in watch) {
            const handler = watch[key]
            // 如果结果值是数组循环创建watcher
            if (Array.isArray(handler)) {
                for (let i=0; i<handler.length; i++) {
                    createWatcher(vm, key, handler[i])
                }
            } else {
                createWatcher(vm, key, handler)
            }
        }
    }
    function createWatcher(vm, exprOrFn, handler, options) {
        // 如果是对象则提取函数和配置
        if (isObject(handler)) {
            options = handler
            handler = handler.handler
        }
        // 如果是字符串就是实例上的函数
        if (typeof handler === 'string') {
            handler = vm[handler]
        }
        return vm.$watch(exprOrFn, handler, options)
    }
}
export function stateMixin(Vue) {
    Vue.prototype.$watch = function(exprOrFn, cb, options = {})  {
        // 标记为用户watcher
        options.user = true
        // 核销就是创建个watcher
        const watcher = new Watcher(this, exprOrFn, cb, options)
        if (options.immediate) {
            cb.call(vm, watcher.value)
        }
    }
}