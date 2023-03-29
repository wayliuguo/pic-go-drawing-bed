<template>
  <div :class="bem.b()">
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create';
import { watch } from 'vue';
import { ref } from 'vue';
import { TreeNode, TreeOption, treeProps } from './tree'

const bem = createNamespace('tree')

// component name
defineOptions({
  name: 'z-tree'
})

const props = defineProps(treeProps)
// 有了 props 要对用户的数据进行格式化，格式化一个固定的结果
// label, key, children 

// 将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([])

const createOptions = (key: string, label: string, children: string) => {
  return {
    getKey(node: TreeOption) {
      return node[key] as string | number
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    }
  }
}
const treeOptions = createOptions(
  props.keyField, 
  props.labelField, 
  props.childrenField
)
const createTree = (data: TreeOption[]): any => {
  const traversal = (data: TreeOption[], parent: TreeNode | null = null) => {
    return data.map(node => {
      const children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [], // 默认为空，有children再去递归
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        // 判断节点是否自带了isLeaf, 如果自带了以自带的为准，如果没有自带的则根据有没有 children
        // children
        isLeaf: node.isLeaf ?? children.length === 0
      }
      if (children.length > 0) {
        // 有 children再去递归 将其格式化为treeNode 类型
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  const result: TreeNode[] = traversal(data)
  return result
}

// 监控数据变化，调用格式化方法，一上来就调用
watch(
  () => props.data, 
  (data: TreeOption[]) => {
    tree.value = createTree(data)
    console.log(tree.value)
  },
  {
    immediate: true
  }
)

// 希望将一颗树拍平， 点击还能实现展开操作
// 需要展开的key有哪些
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))
</script>