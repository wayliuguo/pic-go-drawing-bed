import MyButton from './MyButton'
import MyInput from './MyInput'

const componentPool = [
  MyButton,
  MyInput
]

export default {
  install (app, options) {
    // 这里的app可以获取到整个app实例，例如app.config.globalProperties
    console.log('app:', app)
    // options 即 use传入的第二个参数
    console.log('options:', options)

    // 注册 component
    // app.component(MyButton.name, MyButton)
    // app.component(MyInput.name, MyInput)
    // 组件按需加载
    if (options.components) {
      options.components.forEach(compName => {
        componentPool.forEach(comp => {
          if (compName === comp.name) {
            app.component(comp.name, comp)
          }
        })
      })
    } else {
      componentPool.forEach(comp => {
        app.component(comp.name, comp)
      })
    }

    // 自定义指令
    app.directive('focus', {
      // 当被绑定的元素挂载到 DOM 中时……
      mounted (el) {
        // 聚焦元素
        el.focus()
      }
    })
    // 全局挂载
    app.config.globalProperties.version = 3
  }
}
