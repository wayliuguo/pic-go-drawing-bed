<template>
  <div class="生命周期">
    <div>{{count}}</div>
    <HelloWorld
    v-for="(item, index) of data"
    :key="index"
    :item="item"
    @remove="remove"
    />
    <van-button plain hairline type="primary">细边框按钮</van-button>
    <van-button plain hairline type="success">细边框按钮</van-button>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { ref, watchEffect, onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from 'vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  setup (props, ctx) {
    const data = ref([
      {
        id: 1,
        title: '第一项'
      },
      {
        id: 2,
        title: '第二项'
      }
    ])
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

    const remove = (id) => {
      data.value = data.value.filter(item => item.id !== id)
    }

    return {
      count,
      data,
      remove
    }
  }
}
</script>
