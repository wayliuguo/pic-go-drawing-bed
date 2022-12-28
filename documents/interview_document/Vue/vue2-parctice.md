## 1.指令

```
<template>
  <div class="box" v-click-outside.m="hide">
    <input type="text" @focus="show">
    <div v-show="isShow">
      面板
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClickOutSide',
  directives: {
    clickOutside: {
      bind(el, bindings,vnode) {
        console.log('>>>el', el)
        console.log('>>>bindings', bindings)
        console.log('>>>vnode', vnode)
        const handler = e => {
          // 如果点击的是外面
          if (!el.contains(e.target)) {
            let fn = vnode.context[bindings.expression]
            fn()
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  }
}
```

![image-20221227205850639](vue2-parctice.assets/image-20221227205850639.png)

![image-20221227205942344](vue2-parctice.assets/image-20221227205942344.png)

## 2.图片懒加载

- LazyLoad.vue

  ```
  <template>
      <div class="box">
          <li v-for="(item, index) in list" :key="index">
              <img v-lazy="item" alt="">
          </li>
      </div>
    </template>
    
    <script>
    export default {
      name: 'LazyLoad',
      data() {
          return {
              list: []
          }
      },
      mounted() {
          this.list = [
          	...
          ]
      }
    }
    </script>
    
    <style scoped>
    .box {
      width: 400px;
      height: 400px;
      overflow: scroll;
    }
    img {
      width: 100px;
      height: 150px;
    }
    </style>
    
  ```

- main.js

  ```
  import Vue from 'vue'
  import App from './App.vue'
  import VueLazyLoad from '@/plugins/vue-lazyload'
  import logo from '@/assets/logo.png'
  
  Vue.use(VueLazyLoad, {
    loading: logo,
    preload: 1.2
  })
  
  new Vue({
    render: h => h(App),
  }).$mount('#app')
  
  ```

- plugins/vue-lazyload.js

  ```
  import _ from 'lodash'
  
  const VueLazyLoad = {
      install(Vue, options) {
          const LazyClass = lazy(Vue)
          const instance = new LazyClass(options)
          Vue.directive('lazy', {
              bind: instance.add.bind(instance),
              unbind: instance.remove.bind(instance)
          })
      }
  }
  
  const scrollParent = el => {
      let parent = el.parentNode
      while(parent) {
          // getComputedStyle: 原生方法用于获取元素样式
          if (/scroll/.test(getComputedStyle(parent)['overflow'])) {
              return parent
          }
          parent = parent.parentNode
      }
  }
  
  const render = (listener, status) => {
      let el = listener.el
      let src = ''
      switch (status) {
          case 'loading':
              src = listener.options.loading
              break;
          case 'loaded':
              src = listener.src
              break;
          case 'error':
              src = listener.options.error
          default:
              break;
      }
      el.setAttribute('src', src)
  }
  
  const loadImg = (src, resolve, reject) => {
      let img = new Image()
      img.src = src
      img.onload = resolve
      img.onerror = reject
  }
  
  const lazy = (Vue) => {
  
      class ReactiveListener {
          constructor({el, src, options}) {
              this.el = el
              this.src = src
              this.options = options
              this.state = {
                  loading:  false
              }
          }
          // 用来检测自己在不在可视区域内
          checkInView() {
              // 获取当前元素距离屏幕的位置
              let { top } = this.el.getBoundingClientRect()
              return top < window.innerHeight * this.options.preload
          }
          load() {
              // 先显示loading图片
              // 再去加载真实图片，图片成功后显示成功内容，失败显示失败内容
              render(this, 'loading')
              loadImg(this.src, () => {
                  this.state.loading = true
                  render(this, 'loaded')
              }, () => {
                  render(this, 'error')
              })
          }
      }
  
      return class LazyClass {
          constructor(options) {
              this.options = options
              this.bindHandler = false
              this.listeners = []
          }
          add(el, bindings) {
              Vue.nextTick(() => {
                  // 寻找到可滚动的元素
                  let ele = scrollParent(el)
                  // 1. 监控el是否需要显示
                  let listener = new ReactiveListener({
                      el,
                      src: bindings.value,
                      options: this.options
                  })
                  this.listeners.push(listener)
                  // 2.绑定滚动事件
                  // 只需要绑定一次
                  if (!this.bindHandler) {
                      // 也可以使用 intersectionObserver(兼容性不好)
                      // 节流降低使用频率
                      let lazyHandler = _.throttle(this.lazyLoadHandler.bind(this), 500)
                      ele.addEventListener('scroll', lazyHandler, {
                          passive: true
                      })
                      this.bindHandler = true
                  }
                  // 默认不滚动也需要展示的
                  this.lazyLoadHandler() 
              })
          }
          lazyLoadHandler() {
              // 看一下 哪些需要加载
              // 在可视区域内，这个元素没有被加载过
              this.listeners.forEach(listener => {
                  // 如果加载过
                  if (listener.state.loading) return
                  listener.checkInView() && listener.load()
              })
          }
          remove() {
  
          }
      }
  }
  
  export default VueLazyLoad
  ```

  
