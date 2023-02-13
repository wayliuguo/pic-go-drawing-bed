import Vue from 'vue'
// import Router from 'vue-router'
import Router from '@/vue-router'
import Home from '@/views/Home'
import About from '@/views/About'

Vue.use(Router)

/* 
    / => home
    /about => [about]
    /about/a => [about, a]
    /about/b => [about, b]
*/

const router = new Router({
    mode: 'history',
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
        }
    ]
})

// 全局路由钩子
router.beforeEach((to, from, next) => {
    console.log(to, from, 1)
    setTimeout(() => {
        next()
    },1000)
})
router.beforeEach((to, from, next) => {
    console.log(to, from, 2)
    next()
})

export default router