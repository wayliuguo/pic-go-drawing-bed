import { initMixin } from "./init"

function Vue(options) {
    // options 为用户传入的选项
    this._init(options) // 初始化操作、组件
}

// 给原型上新增_init 方法
initMixin(Vue)

export default Vue