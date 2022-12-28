import Vue from 'vue'
import App from './App.vue'
import VueLazyLoad from '@/plugins/vue-lazyload'
import logo from '@/assets/logo.png'


Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: logo,
  preload: 1.2
})

new Vue({
  render: h => h(App),
}).$mount('#app')
