<template>
  <div>
    {{count}}
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
export default {
  name: 'AppConfig',
  setup () {
    const count = ref(0)
    const a = ref(1)
    const b = ref(1)
    const instance = getCurrentInstance()
    const { appContext } = instance
    const { config } = appContext
    const { globalProperties } = config
    const { utils } = globalProperties
    const { plus } = utils
    count.value = plus(a.value, b.value)
    return {
      count
    }
  }
}
</script>
