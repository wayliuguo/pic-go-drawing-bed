function createRoute (record, location) { // 创建路由
    const matched = []
    if (record) {
        // 不停地去父级查找
        while(record) {
            matched.unshift(record)
            record = record.parent
        }
    }
    return {
        ...location,
        matched
    }
} 

function runQueue(queue, iterator, cb) {
    function step(index) {
        if (index >= queue.length) return cb()
        let hook = queue[index]
        iterator(hook, () => step(index+1))
    }
    step(0)
}

export default class History {
    constructor (router) {
        this.router = router

        // 有一个数据来保存数据的变化
        // null: 当前没有匹配到记录
        this.current = createRoute(null, {
            path: '/'
        })
    }

    listen(cb) {
        // 保存当前的cb函数
        this.cb = cb
    }

    transitionTo(path, cb) {
        let record = this.router.match(path)
        let route = createRoute(record, {
            path
        })
        // 保证跳转的路径和当前路径一致
        // 匹配的记录个数，应该和当前的匹配个数一致，说明是相同路由
        if (path === this.current.path && route.matched.length && this.current.matched.length) {
            return
        }

        // 在跳转前需要先走对应的钩子
        let queue = this.router.beforeHooks
        // 依次执行逻辑 [beforeEach, beforeEnter, beforeRouteEnter]
        const iterator = (hook, next) => {
            hook(route, this.current, next)
        }
        runQueue(queue, iterator, () => {
            // 修改current._route 实现跳转
            this.updateRoute(route)

            // 默认第一次 cb 是进行 hashChange 监听
            cb && cb()
        })
    }

    updateRoute(route) {
        // 路径变化 需要渲染组件 响应式原理
        // 我们需要将current 属性变成响应式，这样后续更改current 就可以渲染组件了
        // 我们可以在router-view 组件中使用current 属性，如果路径变化就可以更新router-view
        this.current = route
        console.log('current>>>', this.current)
        this.cb && this.cb(route) // 更改了组件中._route的值，才会响应式更改到$route的值，重新渲染
    }
}