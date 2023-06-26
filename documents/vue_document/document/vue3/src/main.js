import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as utils from './libs/utils'
import MyUI from './libs/MyUI'
// 1. 引入你需要的组件
// import { Loading, Button } from 'vant'
// 2. 引入组件样式
// import 'vant/lib/index.css'

import { Button, Loading } from 'w-view'
import 'w-view/dist/index.css'

const app = createApp(App)

app.use(Loading).use(Button)

// globalProperties
app.config.globalProperties.utils = utils
// use plugin
app.use(MyUI, {
  components: ['MyButton', 'MyInput']
})
app.use(router).mount('#app')
