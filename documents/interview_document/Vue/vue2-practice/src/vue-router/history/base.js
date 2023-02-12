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
        this.current = route
        console.log('current>>>', this.current)

        // 路径变化 需要渲染组件 响应式原理
        // 我们需要将current 属性变成响应式，这样后续更改current 就可以渲染组件了
        // 我们可以在router-view 组件中使用current 属性，如果路径变化就可以更新router-view

        this.cb && this.cb(route) // 更改了组件中._route的值，才会响应式更改到$route的值，重新渲染
        // 默认第一次 cb 是进行 hashChange 监听
        cb && cb()
    }
}