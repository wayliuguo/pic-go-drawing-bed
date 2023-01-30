import ModuleCollection from './module/module-collection'
import { Vue } from './install'
import { forEachValue } from './utils'

function installModule(store, rootState, path, module) {
    // 需要循环当前模块
    // module.state => 放到rootState 对应的儿子里
    if(path.length > 0) {
        // 需要找到对应的夫模块，将状态声明上去
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        }, rootState)
        // 使用set对对象新增属性进行响应式
        Vue.set(parent, path[path.length - 1], module.state)
    }
    module.forEachGetter((getter, key) => {
        store._wrappedGetters[key] = function() {
            return getter(module.state)
        }
    })
    module.forEachMutation((mutation, key) => {
        store._mutations[key] =(store._mutations[key] || [])
        store._mutations[key].push((payload) => {
            mutation.call(store, module.state, payload)
        })
    })
    module.forEachAction((action, key) => {
        store._actions[key] = (store._actions[key] || [])
        store._actions[key].push((payload) => {
            action.call(store, store, payload)
        })
    })
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child)
    })
}

function resetStoreVM(store, state) {
    const computed = {}
    store.getters = {}
    const wrappedGetters = store._wrappedGetters
    forEachValue(wrappedGetters, (fn, key) => {
        computed[key] = () => {
            return fn(store.state)
        }
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        })
    })
    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    })
}

class Store {
    constructor(options) {
        // 对用户的参数进行格式化操作（树）
        this._modules =new ModuleCollection(options)
        
        // 将模块中的所有getter、mutations、actions进行收集
        // 没有namespaced的时候，getters都放到根上， actions、mutations 将被合并到数组
        this._mutations ={}
        this._actions = {}
        this._wrappedGetters = {}
        const { state } = options

        // 安装模块
        installModule(this, state, [], this._modules.root)

        resetStoreVM(this, state)
    }
    get state() {
        return this._vm._data.$$state
    }
    // 发布
    commit = (mutationName, payload) => {
        this._mutations[mutationName] && this._mutations[mutationName].forEach(fn => fn(payload))
    }
    dispatch = (actionName, payload) => {
        this._actions[actionName] && this._actions[actionName].forEach(fn => fn(payload))
    }
}

export default Store