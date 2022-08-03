import { createRouter, createWebHashHistory } from 'vue-router'
import LifeView from '../views/LifeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LifeView
  },
  {
    path: '/setupLearn',
    name: 'setupLearn',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/setupLearn.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
