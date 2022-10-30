# 一、使用rollup搭建开发环境

```
npm install  @babel/preset-env @babel/core rollup rollup-plugin-babel -D
```

- @babel/core: babel 核心包
- @babel/preset-env：es6+转es5
- rollup-plugin-babel：rollup 的 babel 插件

## rollup.config.js

```
import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js', // 入口
    output: {
        format: 'umd', // 支持amd 和 commonjs 规范
        name: 'Vue', // window.Vue
        file: 'dist/vue.js',
        sourcemap: true
    },
    pulgins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
}
```

## 配置.babelrc 文件

```
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

## 执行脚本配置

```
"serve": "rollup -c -w"
```

# 二、响应式原理

## 1.导出 Vue 构造函数

- src/index.js

  ```
  import { initMixin } from "./init"
  
  function Vue(options) {
      // options 为用户传入的选项
      this._init(options) // 初始化操作、组件
  }
  
  // 给原型上新增_init 方法
  initMixin(Vue)
  
  export default Vue
  ```

  - 其_init 是在 initMIxin 中新增的

## 2.init方法中初始化vue状态

- src/init.js

  ```
  import { initState } from "./state"
  
  export function initMixin (Vue) {
      Vue.prototype._init = function (options) {
          // el, data
          const vm = this
          vm.$options = options
  
          // 对数据进行初始化（watch、computed、props、data...）
          // 这些数据都存在于vm.options
          initState(vm)
      }
  }
  ```

  - 把实例化的参数options 赋值给 $options
  - 对数据进行初始化

## 3. 根据不同属性进行初始化操作

- src/state.js

  ```
  import { isFunction } from "./utils"
  import { observe } from "./observer/index"
  
  export function initState (vm) {
      const opts = vm.$options
      // 初始化data
      if (opts.data) {
          initData(vm)
      }
      // 初始化方法
      if (opts.methods) {
          initMethod(vm)
      }
      // 初始化 props
      if (opts.props) {
          initProps(vm)
      }
      // 初始化 computed
      if (opts.computed) {
          initComputed(vm)
      }
      // 初始化 watch
      if (opts.watch) {
          initWatch(vm)
      }
      
      function initData(vm) {
          let data = vm.$options.data
          // vue2 中会将data 中的所有数值进行数据劫持(Object.defineProperty)
          // 如果传入的data 是一个方法，则取其返回值，否则取其值
          data = vm._data = isFunction(data) ? data.call(vm) : data
  
          // 数据响应式
          observe(data)
      }
  
      // 未实现的方法
      function initProps() {}
      function initMethod() {}
      function initComputed() {}
      function initWatch() {}
  }
  ```

  - vue2 中将data 中的所有数值进行数据劫持（object.defineProperty）
  - 判断data，如果传入的是一个方法，则取其返回值，否则取其值即可
  - 通过observe(data) 进行劫持

## 4.数据劫持

- src/observer/index.js

  ```
  import { isObject } from "../utils";
  
  class Observer {
      // 对对象中的所有属性进行劫持
      constructor (data) {
          this.walk(data)
      }
      walk(data) {
          Object.keys(data).forEach(key => {
              defineReactive(data, key, data[key])
          })
      }
  }
  
  // vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
  function defineReactive(data, key, value) {
      // 如果value是一个对象，则继续递归进行劫持
      observe(value) 
      Object.defineProperty(data, key, {
          get() {
              return value
          },
          set(newV) {
              // 如果用户赋值一个新对象，需要将这个对象进行劫持
              observe(newV)
              value = newV
          }
      })
  }
  
  export function observe(data) {
      // 如果是对象才观察（省略对数组进行处理）
      if (!isObject(data)) {
          return
      }
      
      // 默认最外层 data 必须是一个对象
      return new Observer(data)
  }
  ```

  1. 判断是否是对象才进行劫持
  2. 递归遍历对象，通过defineReactive 这个函数进行劫持
  3. defineReactive 中通过Object.defineProperty进行劫持
     - 如果劫持的属性值是一个对象的时候，继续递归劫持
     - 自定义set函数中，如果用户对一个属性重新赋值，需要对这个属性进行劫持

## 5.测试

```
<body>
    <div id="app"></div>
    <script src="../dist/vue.js"></script>
    <script>
        // viewModal 数据模型
        // 典型的MVVM view vm modal
        let vm = new Vue({
            el: '#app',
            data: {
                name: 'well',
                a: {
                    a: 1
                }
            },
            computed: {},
            watch: {}
        })
        vm._data.a = { ...vm._data.a, b: 1}
    </script>
</body>
```

![image-20221030220215392](手写vue核心原理.assets/image-20221030220215392.png)
