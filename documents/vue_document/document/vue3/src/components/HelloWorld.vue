<template>
  <div>
    {{count}}
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
export default {
  name: 'HelloWorld',
  setup (props, ctx) {
    const instance = getCurrentInstance()
    console.log(instance)
    const count = ref(0)

    return {
      count
    }
  }
}
</script>
