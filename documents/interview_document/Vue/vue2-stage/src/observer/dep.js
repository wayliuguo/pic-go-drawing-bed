// 每个属性都分配一份dep,
// dep 可以用来存放watcher
// watcher 中还要存放这个dep

let id = 0
export class Dep {
    constructor () {
        this.id = id++
        this.subs = [] // 存放watcher
    }
    // 让Watcher实例存放dep
    depend () {
        // Dep.target 就是Watcher
        if (Dep.target) {
            Dep.target.addDep(this) // 让Watcher 去存放dep
        }
    }
    // dep 实例存放 watcher 实例
    addSub(watcher) {
        this.subs.push(watcher)
    }
    // 通知关联的每一个watcher更新
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null

let stack = []

export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
    console.log('>>>stack', stack)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}