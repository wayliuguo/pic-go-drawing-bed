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

# 三、模板编译

## 1.处理render方法

- src/init.js

```
import { initState } from "./state"
import { compileToFunctions } from './compiler/index'

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        ...
        // 页面挂载
        if (vm.$options.el) {
            // 将数据挂载到这个模板上
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        // 把模板转化成对应的渲染函数 =》虚拟dom的概念 Vnode =》
        // diff算法更新虚拟dom =》 产生真实节点，更新
        // 如果没有render方法
        if (!options.render) {
            let template = options.template
            // 如果没有模板但是有el
            if (!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunctions(template)
            options.render = render
        }
    }
}
```

- 往Vue的prototype挂载$mount方法
- 执行$mount方法
- 通过$mount方法将模板转化成渲染函数

## 2.解析标签和模板

- src/compiler/index.js

  ```
  // 匹配标签名 div
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
  // 获取获取标签名的 match 数组索引为1的: div
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  /* let r = '<div></div>'.match(new RegExp(qnameCapture))
  console.log(r) // [ 'div', 'div', index: 1, input: '<div></div>', groups: undefined ] */
  
  // 匹配开始标签
  const startTagOpen = new RegExp(`^<${qnameCapture}`)
  // 匹配闭合标签
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
  
  // 匹配属性 a=b a="b" a='b'
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
  //  />
  const startTagClose = /^\s*(\/?)>/
  // {{name}}
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  
  // html 字符串解析成对应的脚本来触发 tokens <div id="app">{{name}}</div>
  
  function start (tagName, attributes) {
      console.log(tagName, attributes)
  }
  function end (tagName) {
      console.log(tagName)
  }
  function chars(text) {
      console.log(text)
  }
  function parserHTML(html) { // <div id="app">{{name}}</div>
      // 截取字符串
      function advance (len) {
          html = html.substring(len)
      }
      // 匹配标签开头
      function parseStartTag () {
          const start = html.match(startTagOpen)
          // console.log(start) // ['<div', 'div']
          if (start) {
              const match = {
                  tagName: start[1],
                  attrs: []
              }
              advance(start[0].length)
              // console.log(html) // id="app">{{name}}</div>
              let end,attr
              // 如果没有遇到标签结尾就不停的解析
              while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                  // console.log(attr) // [' id="app"', 'id', '=', 'app', undefined, undefined]
                  advance(attr[0].length)
                  match.attrs.push({
                      name: attr[1],
                      value: attr[3] || attr[4] || attr[5]
                  })
                  /* console.log(match)
                  {
                      tagName: 'div',
                      attrs: [
                          {
                              name: 'id',
                              value: 'app'
                          }
                      ]
  
                  } */
                  // console.log(html) // >{{name}}</div>
              }
              if (end) {
                  // console.log(end)
                  // ['>', '']
                  advance(end[0].length)
                  return match
              }
  
          }
          // 不是开始标签
          return false 
      }
      
      // 解析的内容如果存在则不停地解析
      while (html) {
          // 当前解析的开头
          let textEnd = html.indexOf('<')
          if (textEnd === 0) {
              const startTagMatch = parseStartTag(html)
              if (startTagMatch) {
                  start(startTagMatch.tagName, startTagMatch.attrs)
                  continue
              }
              const endTagMatch = html.match(endTag)
              if (endTagMatch) {
                  end(endTagMatch[1])
                  advance(endTagMatch[0].length)
                  continue
              }
          }
          // 处理文本
          let text // {{name}}</div>
          if (textEnd >= 0) {
              text = html.substring(0, textEnd)
          }
          if (text) {
              chars(text)
              advance(text.length)
          }
      }
  }
  export function compileToFunctions (template) {
      
      parserHTML(template)
  }
  ```

  - 调用parserHTML()
  - 匹配标签开头、属性、结尾、文本

## 3.构造AST语法树

- compiler/parser.js

  ```
  let root
  let currentParent
  let stack = []
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  function createASTElement(tagName, attrs) {
      return {
          tag: tagName,
          type: ELEMENT_TYPE,
          children: [],
          attrs,
          parent: null
      }
  }
  
  // html 字符串解析成对应的脚本来触发 tokens <div id="app">{{name}}</div>
  
  function start(tagName, attributes) {
      let element = createASTElement(tagName, attributes)
      if (!root) {
          root = element
      }
      currentParent = element
      stack.push(element)
  }
  function end(tagName) {
      let element = stack.pop()
      currentParent = stack[stack.length - 1]
      if (currentParent) {
          element.parent = currentParent
          currentParent.children.push(element)
      }
  }
  function chars(text) {
      text = text.replace(/\s/g, '')
      if (text) {
          currentParent.children.push({
              type: TEXT_TYPE,
              text
          })
      }
  }
  ```

## 4.codegen生成对应代码

- src/compiler/generate.js

  ```
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  
  function gen (node) {
      if (node.type === 1) {
          return generate(node)
      } else {
          let text = node.text
          if (!defaultTagRE.test(text)) {
              return `_v(${JSON.stringify(text)})`
          }
          let lastIndex = defaultTagRE.lastIndex = 0
          let tokens = []
          let match,index
          while(match = defaultTagRE.exec(text)) {
              index = match.index
              if (index > lastIndex) {
                  tokens.push(JSON.stringify(text.slice(lastIndex, index)))
              }
              tokens.push(`_s(${match[1].trim()})`)
              lastIndex = index + match[0].length
          }
          if (lastIndex < text.length) {
              tokens.push(JSON.stringify(text.slice(lastIndex)))
          }
          return `_v(${tokens.join('+')})`
      }
  }
  
  function getChildren(el) {
      const children = el.children
      if (children) {
          return `${children.map(c => gen(c)).join(',')}`
      } else {
          return false
      }
  }
  
  function genProps(attrs) {
      let str = ''
      for (let i=0; i<attrs.length; i++) {
          let attr = attrs[i]
          if (attr.name === 'style') {
              let obj = {}
              attr.value.split(';').forEach(item => {
                  let [key, value] = item.split(':')
                  obj[key] = value
              })
              attr.value = obj
          }
          str += `${attr.name}:${JSON.stringify(attr.value)},`
      }
      return `{${str.slice(0, -1)}}`
  }
  
  export function generate (el) {
      let children = getChildren(el)
      let code = `_c('${el.tag}',${
          el.attrs.length?`${genProps(el.attrs)}`:'undefined'
      }${
          children?`,${children}`:''
      })`
      return code
  }
  ```

- index.html

  ```
  <div id="app">
          <ul>
              <li class="first" style="color: red;background: blue;">{{name}}</li>
              <li class="second">{{name}}</li>
          </ul>
          <ul>
              <li class="first">{{name}}</li>
              <li class="second">{{name}}</li>
          </ul>
      </div>
  ```

- 结果

  ```
  _c('div',{id:"app"},_c('ul',undefined,_c('li',{class:"first",style:{"color":" red","background":" blue"}},_v(_s(name))),_c('li',{class:"second"},_v(_s(name)))),_c('ul',undefined,_c('li',{class:"first"},_v(_s(name))),_c('li',{class:"second"},_v(_s(name)))))
  ```

## 5.生成render模板

即使字符串转成代码，有两种方法

- eval：消耗性能，作用域问题
- new Function()

- compiler/index.js

```
import { parserHTML } from './parser'
import { generate } from './generate'

export function compileToFunctions (template) {
    
    let root = parserHTML(template)
    console.log(root)
    let code = generate(root)
    console.log(code)
    let render = `with(this){return ${code}}`
    return render
}
```

- 由于数据在data上，需要用with去指定作用域

# 四、组件挂载

## 1.生成虚拟dom

- src/index.js

  ```
  import { initMixin } from "./init"
  import { lifecycleMixin } from "./lifecycle"
  import { renderMixin } from "./render"
  function Vue(options) {
      // options 为用户传入的选项
      this._init(options) // 初始化操作、组件
  }
  
  // 给原型上新增_init 方法
  initMixin(Vue)
  renderMixin(Vue)
  lifecycleMixin(Vue)
  
  export default Vue
  ```

  - 执行renderMixin、lifecycleMixin
  - 给原型上挂载对应方法

- src/lifecycle.js

  ```
  export function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
          console.log('update')
      }
  }
  
  export function mountComponent(vm, el) {
      // 更新函数 数据变化后 会再次调用此函数
      let updateComponent = () => {
          // 1.调用render函数，生成、更新虚拟dom
          // 2.用虚拟dom生成真实dom
  
          vm._update(vm._render())
      }
      updateComponent()
  }
  ```

  - 挂载 _update 方法，用于更新虚拟dom
  - 导出mountComponent 方法, 此方法中执行updateComponent函数，用于更新组件

- src/render.js

  ```
  import { createElement, createTextNode } from "./vdom/index"
  
  export function renderMixin (Vue) {
      Vue.prototype._c = function () {
          return createElement(this, ...arguments)
      }
      Vue.prototype._v = function (text) {
          return createTextNode(this, text)
      }
      Vue.prototype._s = function (val) {
          return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
      }
      Vue.prototype._render = function() {
          const vm = this
          // 获取 render 函数
          let render = vm.$options.render
          let vnode = render.call(vm)
          console.log('vnode>>>', vnode)
          return vnode
      }
  }
  ```

  - 导出_render 方法，用于调用渲染函数render,生成虚拟dom
  - 挂载`_c、_v、_s`，供渲染函数render内部调用

- src/init.js

  ```
  import { initState } from "./state"
  import { compileToFunctions } from './compiler/index'
  import { mountComponent } from "./lifecycle"
  
  export function initMixin (Vue) {
      Vue.prototype._init = function (options) {
          ...
      }
      Vue.prototype.$mount = function (el) {
         ...
          // 组件挂载
          mountComponent(vm, el)
      }
  }
  ```

## 2.生成真实dom

- src/lifecycle.js

  ```
  import { patch } from "./vdom/patch"
  
  export function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
          const vm = this
          patch(vm.$el, vnode)
      }
  }
  
  export function mountComponent(vm, el) {
    ...
  }
  ```

  - 调用patch函数

- src/vdom/patch.js 

  ```
  export function patch(oldVnode, vnode) {
      // 如果是元素
      if (oldVnode.nodeType === 1) {
          // 用vnode来生成真实dom，替换成原来的dom元素
  
          // 找到其父亲元素
          const parentElm = oldVnode.parentNode
          // 根据虚拟节点创建元素
          let elm = createElm(vnode)
          parentElm.insertBefore(elm, oldVnode.nextSibling)
          // 把自己删除
          parentElm.removeChild(oldVnode)
      }
  }
  
  function createElm (vnode) {
      let { tag, data, children, text, vm } = vnode
      // 如果是元素
      if (typeof tag ==='string') {
          // 虚拟节点会有一个el属性，对应真实节点
          vnode.el = document.createElement(tag)
          updateProperties(vnode)
          children.forEach(child => {
              vnode.el.appendChild(createElm(child))
          })
      } else {
          vnode.el = document.createTextNode(text)
      }
      return vnode.el
  }
  
  function updateProperties(vnode) {
      let newProps = vnode.data || {}
      // 当前真实节点
      let el = vnode.el
      for (let key in newProps) {
          // 如果是有style属性
          if (key === 'style') {
              for (let styleName in newProps.style) {
                  el.style[styleName] = newProps.style[styleName]
              }
          } else if (key === 'class') {
              el.className = newProps.class
          } else {
              el.setAttribute(key, newProps[key])
          }
      }
  }
  ```

  - 找到真实dom的父节点，通过vnode创建真实节点挂载在父节点上，删除旧节点

# 五.响应式原理

## 1.对象依赖收集

### 1 手动更新视图

- src/vdom/patch.js

  ```
  export function patch(oldVnode, vnode) {
      // 如果是元素
      if (oldVnode.nodeType === 1) {
          // 用vnode来生成真实dom，替换成原来的dom元素
  
          // 找到其父亲元素
          const parentElm = oldVnode.parentNode
          // 根据虚拟节点创建元素
          let elm = createElm(vnode)
          parentElm.insertBefore(elm, oldVnode.nextSibling)
          // 把自己删除
          parentElm.removeChild(oldVnode)
          return elm
      }
  }
  ```

  - 返回新的dom元素

- src/lifecycle.js

  ```
  export function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
          const vm = this
          vm.$el = patch(vm.$el, vnode)
      }
  }
  ```

  - 将返回的dom元素作为$el,下次对比的时候vnode跟他对比

- index.html

  ```
  // 数据变化需要影响视图
  setTimeout(() => {
  	vm.name = 'liuguowei'
  	// 重新调用render方法产生
  	vm._update(vm._render())
  }, 1000)
  ```

### 2 自动更新

- 观察者模式
  - 属性：“被观察者”
  - 刷新页面：“观察者”
- 每个组件渲染的时候都会有一个watcher

- src/lifecycle.js

  ```
  export function mountComponent(vm, el) {
      // 更新函数 数据变化后 会再次调用此函数
      let updateComponent = () => {
          // 1.调用render函数，生成、更新虚拟dom
          // 2.用虚拟dom生成真实dom
  
          vm._update(vm._render())
      }
      // updateComponent()
      // 观察者模式 属性：“被观察者” 刷新页面：“观察者”
      new Watcher(vm, updateComponent, () => {
          console.log('更新视图了')
      }, true) // true 表示是一个渲染watcher，后续有其他watcher
  }
  ```

  - 不再手动调用updateComponent
  - 通过 new Watcher() 创建 Watcher 实例

- src/observer/watcher.js

  ```
  import { popTarget, pushTarget } from "./dep"
  
  let id = 0
  class Watcher {
      constructor(vm, exprOrFn, cb, options) {
          this.vm = vm
          this.exprOrFn = exprOrFn
          this.cb = cb
          this.options = options
          this.id = id++
          this.deps = [] // 存放 dep
          this.depsId = new Set() // 用于去重 dep
  
          // 默认应该让exprOrFn 执行，exprOrFn => render => 去vm上取值
          this.getter = exprOrFn
          this.get() // 默认初始化，要取值
      }
      get() {
          // 由于取值会触发 defineProperty.get
          // 一个属性可以有多个watcher，一个watcher可以对应多个属性（多对多）
          // 每个属性都可以收集自己的watcher
          pushTarget(this) // 往Dep的target属性上挂载Watcher 实例
          this.getter()
          popTarget()
      }
      // 存放dep，同时让dep存储watcher实例
      addDep(dep) {
          let id = dep.id
          if (!this.depsId.has(id)) {
              this.depsId.add(id)
              this.deps.push(dep)
              dep.addSub(this) // 让dep 存储Watcher 实例
          }
      }
      // 更新视图
      update() {
          this.get()
      }
  }
  
  export default Watcher
  ```

  - 实例化的时候就执行get方法
    1. 往Dep的target属性上挂载Watcher 实例
    2. 执行传入的updateComponent，这里会取data的值，触发object.defineProperty()
    3. 清除Dep的target属性上的Watcher 实例
  - addDep
    1. 由于在Dep的target属性上挂载了Watcher 实例，可以通过Dep.target获取Watcher实例，调用此方法
    2. 此方法可以存储dep实例，同时通过传参获取dep实例使实例存储Watcher实例

- src/observer/dep.js

  ```
  // 每个属性都分配一份dep,
  // dep 可以用来存放watcher
  // watcher 中还要存放这个dep
  
  let id = 0
  export class Dep {
      constructor () {
          this.id = id++
          this.subs = [] // 存放watcher
      }
      // 让Watcher实例存放dep
      depend () {
          // Dep.target 就是Watcher
          if (Dep.target) {
              Dep.target.addDep(this) // 让Watcher 去存放dep
          }
      }
      // dep 实例存放 watcher 实例
      addSub(watcher) {
          this.subs.push(watcher)
      }
      // 通知关联的每一个watcher更新
      notify() {
          this.subs.forEach(watcher => watcher.update())
      }
  }
  
  Dep.target = null
  
  export function pushTarget(watcher) {
      Dep.target = watcher
  }
  
  export function popTarget() {
      Dep.target = null
  }
  ```

  - depend
  - addSub
  - notify

- src/observer/index.js

  ```
  function defineReactive(data, key, value) {
      // 如果value是一个对象，则继续递归进行劫持
      observe(value) 
      // 每个属性都有一个dep属性
      // 创建dep实例，下面的setter和getter可以通过闭包访问到
      let dep = new Dep()
      Object.defineProperty(data, key, {
          get() {
              // 取值时将watcher和dep对应起来
              if (Dep.target) {
                  // 收集依赖
                  dep.depend()
              }
              return value
          },
          set(newV) {
              // 如果用户赋值一个新对象，需要将这个对象进行劫持
  
              // 如果新旧值相同则return
              if (newV === value) return 
              observe(newV)
              value = newV
              dep.notify() // 通知渲染Watcher 去更新
          }
      })
  }
  ```
  
  - 通过闭包使getter和setter可以访问到对应的实例

## 2.
