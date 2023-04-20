import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Icon from '@zi-shui/components/icon'
import Tree from '@zi-shui/components/tree'
import Checkbox from '@zi-shui/components/checkbox'
import Button from '@zi-shui/components/button'
import Input from '@zi-shui/components/input'
import '@zi-shui/theme-chalk/src/index.scss'

const plugins = [
    Icon,
    Tree,
    Checkbox,
    Button,
    Input
]
const app = createApp(App)
plugins.forEach(plugin => app.use(plugin)) // 将组件注册成了全局组件，可以直接使用了

app.mount('#app')
