import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.id = id++
        this.deps = [] // 存放 dep
        this.depsId = new Set() // 用于去重 dep
        this.user = !!options.user
        // 如果是计算属性，lazy，dirty默认为true
        this.lazy = options.lazy
        this.dirty = options.lazy

        // 默认应该让exprOrFn 执行，exprOrFn => render => 去vm上取值
        // 如果是渲染watcher
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else {
            this.getter = function () {
                let path = exprOrFn.split('.')
                let obj = vm
                for (let i=0; i<path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }
        // 将初始值记录到value属性上
        // 第一次的value，如果是lazy则是undefined
        this.value = this.lazy ? undefined : this.get() // 默认初始化，要取值
    }
    get() {
        // 由于取值会触发 defineProperty.get
        // 一个属性可以有多个watcher，一个watcher可以对应多个属性（多对多）
        // 每个属性都可以收集自己的watcher
        pushTarget(this) // 往Dep的target属性上挂载Watcher 实例
        const value = this.getter.call(this.vm)
        popTarget()
        return value
    }
    // 存放dep，同时让dep存储watcher实例
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this) // 让dep 存储Watcher 实例
        }
    }
    // 更新视图(vue中更新是异步的)
    update() {
        // this.get()
        if (this.lazy) {
           this.dirty = true 
        } else {
            // 多次调用update，先将watcher缓存下来，收集起来一起更新
            queueWatcher(this)
        }
    }
    run () {
        let value = this.get()
        let oldValue = this.value
        this.value = value
        if (this.user) {
            this.cb.call(this.vm, value, oldValue)
        }
    }
    evaluate() {
        // 已经取过值了
        this.dirty = false
        // 用户的getter执行
        this.value = this.get()
    }
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}

export default Watcher