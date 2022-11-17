// 每个属性都分配一份dep,
// dep 可以用来存放watcher
// watcher 中还要存放这个dep

let id = 0
class Dep {
    constructor () {
        this.id = id
    }
}
