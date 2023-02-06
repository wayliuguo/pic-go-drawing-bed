import { install } from './install'
export default class VueRouter{
    constructor(options={}) {
        const { mode='hash', routes=[] } = options
        // 给我个路径，我就返回给你对应的记录
        // match 匹配方法

        // addRoutes 动态添加路由 
        this.matcher = createMatcher(routes)
    }
    init() {
        console.log('init')
    }
}
VueRouter.install = install