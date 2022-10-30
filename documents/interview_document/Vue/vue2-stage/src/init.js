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