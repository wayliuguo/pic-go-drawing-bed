<template>
  tree
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TreeNode, treeProps } from './tree'
defineOptions({
  name: 'z-tree'
})

const props = defineProps(treeProps)
// 有了 props 要对用户的数据进行格式化，格式化一个固定的结果
// label, key, children 

// 将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([])
</script>