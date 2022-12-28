<template>
  <div class="box" v-click-outside.m="hide">
    <input type="text" @focus="show">
    <div v-show="isShow">
      面板
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClickOutSide',
  directives: {
    clickOutside: {
      bind(el, bindings,vnode) {
        console.log('>>>bindings', bindings)
        console.log('>>>vnode', vnode)
        const handler = e => {
          // 如果点击的是外面
          if (!el.contains(e.target)) {
            let fn = vnode.context[bindings.expression]
            fn()
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.box {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid #ccc;
}
</style>
