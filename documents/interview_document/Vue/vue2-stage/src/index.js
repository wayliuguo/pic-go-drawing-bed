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