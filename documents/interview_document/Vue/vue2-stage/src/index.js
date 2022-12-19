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

/* // diff 核心
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
// let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1>{{message}}</div>`
// 3.3 双方都有儿子
// 3.3.1 ABCD ADCD(同头指针开始比较)
// 3.3.2 ABCD ABCDE（新的没有比较完）
// 3.3.3 ABCD EABCD(Key)（从尾指针开始比较）
// 3.3.4 从尾比较没比较完
// 3.3.4.1 ABCD AB
// 3.3.4.2 ABCD CD
// 3.3.5 ABCD BCDA (头尾比较)
// 3.3.6 ABCD DABC (尾头比较)
// 3.3.7 CABD BCDA (乱序比较)
let oldTemplate = `<div>
    <li key="C">C</li>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="D">D</li>
</div>`
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
// let newTemplate = `<div style="color: blue;background: red;" b=2></div>`
// 3.3 双方都有儿子
// 3.3.1 ABCD ADCD (同头指针开始比较)
// 3.3.2 ABCD ABCDE （新的没有比较完）
// 3.3.3 ABCD EABCD(Key)（从尾指针开始比较）
// 3.3.4 从尾比较没比较完
// 3.3.4.1 ABCD AB
// 3.3.4.2 ABCD CD
// 3.3.5 ABCD BCDA (头尾比较)
// 3.3.6 ABCD DABC (尾头比较)
// 3.3.7 CABD BCDA (乱序比较)
let newTemplate = `<div>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
    <li key="A">A</li>
</div>`
let vm2 = new Vue({data: {message: 'world'}})
const render2 = compileToFunctions(newTemplate)
const newVnode = render2.call(vm2)

// 根据新的虚拟节点更新老的节点，老的节点能复用尽量复用
setTimeout(() => {
    patch(oldVnode, newVnode)
}, 2000) */


export default Vue