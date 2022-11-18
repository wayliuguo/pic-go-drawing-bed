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

        // 默认应该让exprOrFn 执行，exprOrFn => render => 去vm上取值
        this.getter = exprOrFn
        this.get() // 默认初始化，要取值
    }
    get() {
        // 由于取值会触发 defineProperty.get
        // 一个属性可以有多个watcher，一个watcher可以对应多个属性（多对多）
        // 每个属性都可以收集自己的watcher
        pushTarget(this) // 往Dep的target属性上挂载Watcher 实例
        this.getter()
        popTarget()
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
        // 多次调用update，先将watcher缓存下来，收集起来一起更新
        queueWatcher(this)
    }
    run () {
        this.get()
    }
}

export default Watcher