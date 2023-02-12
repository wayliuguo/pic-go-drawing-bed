export default {
    functional: true,
    render(h, {parent, data}) {
        // 获取current 对象 current={matched: []}
        let route = parent.$route
        // 依次将matched的结果赋予给每个 router-view
        // 记录返回matched 的第几项 前一项是后一项的父亲 
        let depth = 0
        // 需要是组件 <router-view></router-view> <App></App>
        while(parent) {
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
            parent = parent.$parent
        }
        // 两个router-view /about /about/a
        let record = route.matched[depth]
        if (!record) {
            return h()
        }
        // 给组件打上标识，代表已经标识过了
        data.routerView = true
        // 渲染匹配到的组件
        return h(record.component, data)
    }
}