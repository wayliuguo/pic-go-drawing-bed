let id = 0
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.id = id++

        // 默认应该让exprOrFn 执行，exprOrFn => render => 去vm上取值
        this.getter = exprOrFn
        this.get() // 默认初始化，要取值
    }
    get() {
        // 由于取值会触发 defineProperty.get
        // 一个属性可以有多个watcher，一个watcher可以对应多个属性（多对多）
        // 每个属性都可以收集自己的watcher
        this.getter()
    }
}

export default Watcher