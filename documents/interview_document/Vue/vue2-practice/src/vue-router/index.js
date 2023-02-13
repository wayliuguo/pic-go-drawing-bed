import { install } from './install'
import createMatcher from './create-matcher'
import HTML5History from './history/h5'
import Hash from './history/hash'
export default class VueRouter{
    constructor(options={}) {
        const { mode='hash', routes=[] } = options
        this.mode = mode
        // 给我个路径，我就返回给你对应的记录
        // match 匹配方法

        // addRoutes 动态添加路由 
        this.matcher = createMatcher(routes)

        switch (this.mode) {
            case 'hash': // location.hash
                this.history = new Hash(this)
                break
            case 'history':
                this.history = new HTML5History(this)
                break
        }

        this.beforeHooks = []
    }

    match(location) {
        return this.matcher.match(location)
    }

    // 跳转页面
    push(location) {
        this.history.transitionTo(location, ()=> {
            this.history.pushState(location)
        })
    }


    init(app) {
        const history = this.history
        // hash => hashChange 但是浏览器支持popState时优先采用 popstate
        // history => popstate，性能高于 hashchange 但是有兼容性问题
        // 可以在控制台中输入，然后切换路由测试
        /* window.addEventListener('popstate', () => {
            console.log(window.location)
        }) */

        const setUpListener = () => {
            history.setUpListener()
        }

        // 页面初始化完毕后 需要先进行一次调整
        history.transitionTo(
            history.getCurrentLocation(), // 各自获取路径方法
            setUpListener // 跳转到某个路径
        )

        history.listen((route) => {
            // 监听如果current变化，则重新给_route赋值
            app._route = route
        })
    }

    beforeEach(fn) {
        this.beforeHooks.push(fn)
    }
}
VueRouter.install = install