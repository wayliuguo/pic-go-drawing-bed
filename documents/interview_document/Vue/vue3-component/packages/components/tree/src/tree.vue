<template>
  <div :class="bem.b()">
    <z-tree-node 
      v-for="node in flattenTree"
      :key="node.key"
      :node="node"
      :expanded="isExpanded(node)"
      @toggle="toggleExpand"
    >
    </z-tree-node>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create';
import { computed, watch } from 'vue';
import { ref } from 'vue';
import { TreeNode, TreeOption, treeProps } from './tree'
import ZTreeNode from './treeNode.vue';

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

// 数据格式化
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
  },
  {
    immediate: true
  }
)

// 希望将一颗树拍平， 点击还能实现展开操作
// 需要展开的key有哪些 [40, 41]
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))
const flattenTree = computed(() => {
  // 需要展开的keys
  let expandedKeys = expandedKeysSet.value

  // 扁平后的节点
  let flattenNodes: TreeNode[] = []
  // 被格式化后的节点
  const nodes = tree.value || []
  // 用于遍历树的栈 [41, 40]
  const stack: TreeNode[] = []
  for (let i=nodes.length -1; i>=0; --i) {
    stack.push(nodes[i])
  }
  // 深度遍历
  while(stack.length) {
    const node = stack.pop()
    if (!node) continue
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      // 如果有
      const children = node.children 
      if (children) {
        for (let i = node.children.length - 1; i >= 0; --i) {
          stack.push(node.children[i])
        }
      }
    }
  }
  return flattenNodes
})

// 是否是展开的
const isExpanded = (node: TreeNode):boolean => {
  return expandedKeysSet.value.has(node.key)
}

// 折叠功能
const collpase = (node: TreeNode) => {
  expandedKeysSet.value.delete(node.key)
}

// 展开功能
const expand = (node: TreeNode) => {
  expandedKeysSet.value.add(node.key)
}

// 切换展开
const toggleExpand = (node: TreeNode) => {
  const expandedKeys = expandedKeysSet.value
  if (expandedKeys.has(node.key)) {
    collpase(node)
  } else {
    expand(node)
  }
}

</script>