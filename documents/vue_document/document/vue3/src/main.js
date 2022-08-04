import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as utils from './libs/utils'
import MyUI from './libs/MyUI'

const app = createApp(App)
// globalProperties
app.config.globalProperties.utils = utils
// use plugin
app.use(MyUI, {
  components: ['MyButton', 'MyInput']
})
app.use(router).mount('#app')
