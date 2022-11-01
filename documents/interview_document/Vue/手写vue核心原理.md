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

## 6.数据代理

- src/state.js

  ```js
  ...
  function proxy (vm, source, key) {
          Object.defineProperty(vm, key, {
              get() {
                  return vm[source][key]
              },
              set(newValue) {
                  vm[source][key] = newValue
              }
          })
      }
      
  function initData(vm) {
      let data = vm.$options.data
      // vue2 中会将data 中的所有数值进行数据劫持(Object.defineProperty)
      // 如果传入的data 是一个方法，则取其返回值，否则取其值
      data = vm._data = isFunction(data) ? data.call(vm) : data
  
      // 数据响应式
      observe(data)
  
      // 数据代理
      for (let key in data) {
          proxy(vm, '_data', key)
      }
  }
      
  ```

## 7.数组的递归监控

用户很少通过索引操作数组，vue 内部就想到不对索引进行劫持，因为消耗严重，内部数组不采用defineProperty

- push
- shift
- pop
- unshift
- reverse
- sort
- splice

上面7个方法非纯函数，会更改原数组

- src/observer/index.js

  ```
  import { isObject } from "../utils";
  import { arrayMethods } from './array'
  
  class Observer {
      // 对对象中的所有属性进行劫持
      constructor (data) {
          // 使__ob__属性不可枚举，如果不这么做，data会一直是一个对象，则溢栈
          // 这里把__ob__挂载在实例上，同时此属性不可枚举
          Object.defineProperty(data, '__ob__', {
              value: this,
              enumerable: false
          })
          // 如果是数组，则进行数组劫持的逻辑
          // 对数组原来的方法进行改写
          if (Array.isArray(data)) {
              data.__proto__ = arrayMethods
              // 如果数组中的数据是对象类型，需要监控对象的变化
              this.observeArray(data)
          } else {
              this.walk(data)
          }
      }
      observeArray(data) {
          // 对数组中的数组 数组中的对象再次劫持
          data.forEach(item => {
              observe(item)
          })
      }
      walk(data) {
          ...
      }
  }
  
  // vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
  function defineReactive(data, key, value) {
     ...
  }
  
  export function observe(data) {
      ...
      // 如果已经被观察过了则不需再观察
      if (data.__ob__) {
          return
      }
      // 默认最外层 data 必须是一个对象
      return new Observer(data)
  }
  ```

  - 如果是数组，则调用observeArray()

  - observeArray 方法遍历data进行劫持

  - ```
     Object.defineProperty(data, '__ob__', {
                value: this,
                enumerable: false
     })
    ```

    这里把`__ob__`挂载到实例上，同时不可枚举，防止后面一直判断到data是一个对象死循环

- src/observer/array.js

  ```
  // arrayMethods.__proto__ = Array.prototype
  let oldArrayProrotype = Array.prototype
  export let arrayMethods = Object.create(oldArrayProrotype)
  
  let methods = [
      'push',
      'shift',
      'unshift',
      'pop',
      'reverse',
      'sort',
      'splice'
  ]
  
  methods.forEach(method => {
      // 用户调用的，如果是以上七个方法，则使用自己重写的，否则用原来的数组方法
      arrayMethods[method] = function (...args) {
          // vm.name.push(×××), 则this表示vm
          oldArrayProrotype[method].call(this, ...args)
          // 新增的内容
          let inserted
          // 根据当前数组获取到observe实例
          let ob = this.__ob__
          switch (method) {
              case 'push':
              case 'unshift':
                  inserted = args
                  break
              case 'splice':
                  inserted = args.splice(2)
                  break
              default:
                  break
          }
          // 如果有新增的内容要进行继续劫持
          if (inserted) {
              ob.observeArray(inserted)
          }
      }
  })
  ```

  - 对数组的方法进行重写
  - 对数组的方法增加的内容进行劫持

- index.html

  ```
  <script>
          // viewModal 数据模型
          // 典型的MVVM view vm modal
          let vm = new Vue({
              el: '#app',
              data: {
                  name: 'well',
                  a: {
                      a: 1
                  },
                  // arr: [1, 2, 3],
                  arrObj: [
                      {
                          name: 'well'
                      },
                      {
                          name: 'well'
                      }
                  ]
              },
              computed: {},
              watch: {}
          })
          vm._data.a = { ...vm._data.a, b: 1}
          vm.arrObj[1].name = '123'
          vm.arrObj.push({age: 18})
          console.log(vm)
      </script>
  ```

  ![image-20221102074627002](手写vue核心原理.assets/image-20221102074627002.png)
