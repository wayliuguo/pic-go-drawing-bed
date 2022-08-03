<template>
  <div>
    <div>{{title}}</div>
    <div>{{attrs.desc}}</div>
    <div>{{count}}</div>
    <div>{{firstName}}</div>
    <div>{{lastName}}</div>
    <button @click="add">增加1</button>
    <button @click="emit('update:firstName', 'liu')">change FirstName</button>
    <button @click="emit('update:lastName', 'guowei')">change FirstName</button>
  </div>
</template>

<script>
import { watchEffect, toRefs } from 'vue'
export default {
  name: 'SetUpLearnCom',
  props: {
    title: String,
    count: Number,
    firstName: String,
    lastName: String
  },
  emits: ['onAdd', 'update:firstName', 'update:lastName'],
  // contex 普通js对象，可以解构
  setup (props, ctx) {
    const { title, count } = toRefs(props)
    watchEffect(() => {
      // 如果没有使用toRefs(props),则由于title是解构props而来，会丢失响应式
      console.log(title.value)
      console.log(count.value)
    })
    const { attrs, emit } = ctx
    console.log(ctx)
    console.log(attrs)
    const add = () => {
      emit('onAdd', count.value + 1)
    }
    return {
      attrs,
      emit,
      add
    }
  }
}
</script>
