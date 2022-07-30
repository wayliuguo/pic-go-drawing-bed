<template>
  <div>
    <span>{{item.title}}</span>
    <button @click="remove(item.id)">删除</button>
  </div>
</template>

<script>
import { ref, watchEffect, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'
export default {
  name: 'HelloWorld',
  props: {
    item: Object
  },
  emits: ['remove'],
  setup (props, ctx) {
    const remove = (id) => {
      ctx.emit('remove', id)
    }
    const count = ref(0)

    setTimeout(() => {
      count.value = 1
    }, 2000)

    onBeforeMount(() => {
      console.log('onBeforeMount')
    })

    onMounted(() => {
      console.log('onMounted')
    })

    onBeforeUpdate(() => {
      console.log('onBeforeUpdate')
    })

    onUpdated(() => {
      console.log('onUpdated')
    })

    watchEffect(() => {
      const a = count.value
      console.log('watchEffect', a)
    })

    onBeforeUnmount(() => {
      console.log('ID为' + props.item.id + '的项即将被删除')
    })

    onUnmounted(() => {
      console.log('ID为' + props.item.id + '的项正在被删除')
    })

    return {
      count,
      remove
    }
  }
}
</script>
