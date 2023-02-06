import RouterLink from './components/link'
import RouterView from './components/view'

let _Vue
function install (Vue) {
    _Vue = Vue
    // 给所有组件的声明周期都增加beforeCreate 方法
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) { // 如果有router属性说明是根实例
                this._routerRoot = this // 将根实例挂载在_routerRoot属性上
                this._router = this.$options.router // 将当前router 实例挂载在_router 上

                this._router.init(this) // 初始化路由，这里的 this 指向的是根实例
            } else {
                // 父组件渲染后会渲染子组件
                this._routerRoot = this.$parent  && this.$parent._routerRoot
                // 保证所有子组件都拥有_routerRoot 属性，指向根实例
                // 保证所有组件都可以通过 this._routerRoot._router 拿到用户传递进来的路由实例对象
            }
        }
    })

    // 给所有组件统一添加$router 和 $route 属性
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
        }
    })
    Object.defineProperty(Vue.prototype, '$route', {
        get() {

        }
    })

    // 定义全局组件
    Vue.component('router-link', RouterLink)
    Vue.component('router-view', RouterView)
}

export {
    _Vue,
    install
}