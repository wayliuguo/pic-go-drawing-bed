## vue2 运行机制

### 1.原型 mixin

#### initMixin(vue)

- Vue.prototype._init = function(options) {}
  1. mergeOptions：合并参数
  2. beforeCreate
  3. initState
  4. created
  5. $mount
- Vue.prototype.$mount = function (el) {}
  - comileToFunctions：构建render函数
  - mountComponent：组件挂载

#### renderMixin(vue)

- Vue.prototype._c
- Vue.prototype._v
- Vue.prototype._s
- Vue.prototype._render

#### lifecycleMixin(vue)

- Vue.prototype._update = function (vnode) {}

#### stateMixin(vue)

- Vue.prototype.$watch

#### initGlobalApi(vue)

- Vue.options = {}
- Vue.options.components = {}
- Vue.options._base = Vue
- let cid = 0
- Vue.mixin
- Vue.extend
- Vue.component

### 2.响应式原理



