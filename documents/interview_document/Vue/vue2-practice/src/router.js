import Vue from 'vue'
// import Router from 'vue-router'
import Router from '@/vue-router'
import Home from '@/views/Home'
import About from '@/views/About'
import Level from '@/views/Level.vue'
import Menu from '@/views/Menu.vue'

import hooks from './utils/hooks'

Vue.use(Router)

/* 
    / => home
    /about => [about]
    /about/a => [about, a]
    /about/b => [about, b]
*/

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            children: [
                {
                    path: 'a',
                    component: {
                        render(h) {
                            return <h1>about A</h1>
                        }
                    }
                },
                {
                    path: 'b',
                    component: {
                        render(h) {
                            return <h1>about B</h1>
                        }
                    }
                }
            ]
        },
        {
            path: '/level',
            name: 'level',
            component: Level
        },
        {
            path: '/menu',
            name: 'menu',
            component: Menu
        }
    ]
})

// 全局路由钩子
/* router.beforeEach((to, from, next) => {
    console.log(to, from, 1)
    setTimeout(() => {
        next()
    },1000)
})
router.beforeEach((to, from, next) => {
    console.log(to, from, 2)
    next()
}) */

Object.values(hooks).forEach(hook => {
    router.beforeEach(hook)
})



export default router