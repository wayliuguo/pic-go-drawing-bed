import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"
import { stateMixin } from "./state"

function Vue(options) {
    // options 为用户传入的选项
    this._init(options) // 初始化操作、组件
}

// 给原型上新增_init 方法
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
stateMixin(Vue)

// 在类上扩展的Vue.mixin
initGlobalApi(Vue)

// diff 核心
// compileToFunctions: 传入template 获得render函数
import { compileToFunctions } from "./compiler/index"
// createElm：传入vnode得到真实dom
import { createElm, patch } from "./vdom/patch"

// 1.标签名不一样，直接删掉老的换成新的即可
// let oldTemplate = `<div>{{message}}</div>`
// 2.标签一样比较属性
// let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1>{{message}}</div>`
// 3.一方有儿子 一方没儿子
// 3.1 老的没儿子， 新的有儿子
// let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1></div>`
// 3.2 老的有儿子,新的没儿子
let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1>{{message}}</div>`
let vm1 = new Vue({data: {message: 'hello'}})
const render1 = compileToFunctions(oldTemplate)
const oldVnode = render1.call(vm1)
document.body.appendChild(createElm(oldVnode))

// v-if v-else
// 1.标签名不一样，直接删掉老的换成新的即可
// let newTemplate = `<p>{{message}}</p>`
// 2.标签一样比较属性
// let newTemplate = `<div style="color: blue;background: red;" b=2>{{message}}</div>`
// 3.一方有儿子 一方没儿子
// 3.1 老的没儿子， 新的有儿子
// let newTemplate = `<div style="color: blue;background: red;" b=2>{{message}}</div>`
// 3.2 老的有儿子,新的没儿子
let newTemplate = `<div style="color: blue;background: red;" b=2></div>`
let vm2 = new Vue({data: {message: 'world'}})
const render2 = compileToFunctions(newTemplate)
const newVnode = render2.call(vm2)

// 根据新的虚拟节点更新老的节点，老的节点能复用尽量复用
setTimeout(() => {
    patch(oldVnode, newVnode)
}, 2000)


export default Vue