<template>
  <div>
    <SetUpLearnCom
      :title="title"
      :desc="desc"
      :count="count"
      v-model:first-name="firstName"
      v-model:last-name="lastName"
      @onAdd="onAddOne"
    />
  </div>
</template>

<script>
import SetUpLearnCom from '@/components/SetUpLearnCom.vue'
import { ref } from 'vue'
export default {
  name: 'setupLearn',
  components: {
    SetUpLearnCom
  },
  setup (props, ctx) {
    const title = ref('我是vue')
    const desc = ref('不接收的值')
    const count = ref(0)
    const firstName = ref('刘')
    const lastName = ref('国威')
    setTimeout(() => {
      title.value = '我是vue3.0'
      desc.value = '更新不接收的值'
    }, 1000)
    const onAddOne = () => {
      count.value++
    }
    return {
      title,
      desc,
      count,
      firstName,
      lastName,
      onAddOne
    }
  }
}
</script>
