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

    transitionTo(path, cb) {
        let route = this.router.match(path)
        this.current = createRoute(route, {
            path
        })
        console.log('current>>>', this.current)

        // 路径变化 需要渲染组件 响应式原理
        // 我们需要将current 属性变成响应式，这样后续更改current 就可以渲染组件了
        // 我们可以在router-view 组件中使用current 属性，如果路径变化就可以更新router-view

        // 默认第一次 cb 是进行 hashChange 监听
        cb && cb()
    }
}