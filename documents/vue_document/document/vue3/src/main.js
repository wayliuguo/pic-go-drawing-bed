import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as utils from './libs/utils'

const app = createApp(App)
app.config.globalProperties.utils = utils
app.use(router).mount('#app')
