import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueLazyLoad from '@/plugins/vue-lazyload'
import logo from '@/assets/logo.png'


Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: logo,
  preload: 1.2
})

let vm = new Vue({
  name: 'App',
  store,
  render: h => h(App),
}).$mount('#app')
console.log(vm.$store)