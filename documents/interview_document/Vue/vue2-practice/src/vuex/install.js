let Vue

function install (_Vue) {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() { // this 代表每个组件实例
            // 获取根组件上的 store 将他共享给每个组件
            let options = this.$options
            if (options.store) {
                this.$store = options.store
            } else {
                if (this.$parent && this.$parent.$store) {
                    this.$store = this.$parent.$store
                }
            }
        }
    })
}

export {
    Vue,
    install
}