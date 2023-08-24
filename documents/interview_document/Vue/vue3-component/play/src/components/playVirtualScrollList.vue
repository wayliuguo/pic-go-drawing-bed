<script setup lang="ts">
import { Random } from 'mockjs'
import { ref } from 'vue'
import playItem from './playItem.vue'
import { DefineComponent } from 'vue'
const totalCount = 100
interface DataType {
  id: number,
  name: string,
  desc: string,
  index: number
}
const data: Array<DataType> = []
let index = 0
while (index++ !== totalCount) {
  data.push({
    id: index,
    name: Random.name(),
    desc: Random.csentence(20, 120),
    index
  })
}
const items = ref<Array<DataType>>(data)
console.log(items)
</script>

<template>
  <z-virtual-scroll-list class="virtual-list" :data-sources="items" data-key="id" :keeps="30" :estimateSize="80"
    :data-component="(playItem as DefineComponent<{}, {}, any>)">
  </z-virtual-scroll-list>
</template>

<style lang="scss">
.virtual-list {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  border: 3px solid red;
}
</style>