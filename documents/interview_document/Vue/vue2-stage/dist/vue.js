(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function isFunction (val) {
        return typeof val === 'function'
    }

    function isObject (val) {
        return typeof val === 'object' && val !== null
    }

    class Observer {
        // 对对象中的所有属性进行劫持
        constructor (data) {
            this.walk(data);
        }
        walk(data) {
            Object.keys(data).forEach(key => {
                defineReactive(data, key, data[key]);
            });
        }
    }

    // vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
    function defineReactive(data, key, value) {
        // 如果value是一个对象，则继续递归进行劫持
        observe(value); 
        Object.defineProperty(data, key, {
            get() {
                return value
            },
            set(newV) {
                // 如果用户赋值一个新对象，需要将这个对象进行劫持
                observe(newV);
                value = newV;
            }
        });
    }

    function observe(data) {
        // 如果是对象才观察（省略对数组进行处理）
        if (!isObject(data)) {
            return
        }
        
        // 默认最外层 data 必须是一个对象
        return new Observer(data)
    }

    function initState (vm) {
        const opts = vm.$options;
        // 初始化data
        if (opts.data) {
            initData(vm);
        }
        // 初始化方法
        if (opts.methods) ;
        // 初始化 props
        if (opts.props) ;
        // 初始化 computed
        if (opts.computed) ;
        // 初始化 watch
        if (opts.watch) ;
        
        function initData(vm) {
            let data = vm.$options.data;
            // vue2 中会将data 中的所有数值进行数据劫持(Object.defineProperty)
            // 如果传入的data 是一个方法，则取其返回值，否则取其值
            data = vm._data = isFunction(data) ? data.call(vm) : data;

            // 数据响应式
            observe(data);
        }
    }

    function initMixin (Vue) {
        Vue.prototype._init = function (options) {
            // el, data
            const vm = this;
            vm.$options = options;

            // 对数据进行初始化（watch、computed、props、data...）
            // 这些数据都存在于vm.options
            initState(vm);
        };
    }

    function Vue(options) {
        // options 为用户传入的选项
        this._init(options); // 初始化操作、组件
    }

    // 给原型上新增_init 方法
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
