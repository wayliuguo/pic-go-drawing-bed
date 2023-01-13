import { Vue } from './install'
import { forEachValue } from './utils'

class Store {
    constructor(options) {
        let { state, getters, mutations, actions, module, strice } = options

        // 在取getters 的时候,把它代理到计算属性上
        this.getters = {}
        const computed = {}
        forEachValue(getters, (fn, key) => {
            computed[key] = () => {
                return fn(this.state)
            }
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key] // this._vm[key] 触发了data 的代理
            })
        })

        this.mutations = {}
        forEachValue(mutations, (fn, key) => {
            // commit('changeAge', 10)
            // this.mutations = {changeAge: () => {}}
            this.mutations[key] = (payload) => fn.call(this, this.state, payload)
        })

        this.actions = {}
        forEachValue(actions, (fn, key) => {
            this.actions[key] = (payload) => fn.call(this, this, payload)
        })


        // 这个状态在页面渲染时需要收集对应的渲染 watcher， 这样状态更新才会更新视图
        this._vm = new Vue({
            data: { 
                // $符号开头的数据不会被挂载到实例上，但是会挂载到当前的_data 上，减少了一次代理
                $$state: state
            },
            computed // 利用计算属性实现缓存
            // 用户组件中使用的$store = this
        })
    }
    // 类的属性访问器
    get state() {
        return this._vm._data.$$state
    }
    // 用箭头函数的写法，this永远指向Store的实例对象
    commit = (type, payload) => {
        this.mutations[type](payload)
    }
    dispatch = (type, payload) => {
        this.actions[type](payload)
    }
}

export default Store