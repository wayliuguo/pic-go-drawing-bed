import { nextTick } from "../next-tick"

let queue = []
let has = {} // 做列表的 列表维护存放了哪些watcher

function flushSchedulerQueue () {
    for (let i=0; i<queue.length; i++) {
        let watcher = queue[i]
        watcher.run()
    }
    queue = []
    has = {}
}

let pending = false
export function queueWatcher (watcher) {
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true
        queue.push(watcher)
        // 开启一次更新操作，批处理
        if (!pending) {
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}