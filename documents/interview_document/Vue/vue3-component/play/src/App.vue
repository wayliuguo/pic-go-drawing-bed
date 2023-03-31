<script setup lang="ts">
import { ref } from 'vue'
import {  AddCircle } from '@vicons/ionicons5'

function createData(level = 4, parentKey=''):any {
  if (!level) return []
  const arr = new Array(6-level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    }
  }) 
}
function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}
const data = ref(createData())
</script>

<template>
    <!-- <z-icon :color="'yellow'" :size="20">
        <AddCircle></AddCircle>
    </z-icon> -->
    <!-- 在使用树组件的时候 会传递一个树型的结构 -->
    <z-tree 
      :data="data" 
      label-field="label"
      key-field="key"
      children-field="children"
      :default-expanded-keys="['40', '41']"
    >
    </z-tree>
</template>

<style scoped>
</style>
