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

export default new Router({
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