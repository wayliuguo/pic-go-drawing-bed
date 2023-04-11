<template>
  <div :class="bem.b()">
    <z-virtual-list 
      :items="flattenTree"
      :remain="8"
      :size="35"
    >
      <template #default="{ node }">
        <z-tree-node
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loadingKeys="loadingKeysRef"
          @toggle="toggleExpand"
          @select="handleSelect"
          :selectedKeys="selectKeysRef"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="true"
          :indeterminate="true"
        >
        </z-tree-node>
      </template>
    </z-virtual-list>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create';
import { computed, watch, provide, useSlots, ref } from 'vue';
import { TreeNode, TreeOption, treeProps, Key, treeEmitts, treeInjectKey } from './tree'
import ZTreeNode from './treeNode.vue';
import ZVirtualList from '@zi-shui/components/virtual-list'

const bem = createNamespace('tree')

// component name
defineOptions({
  name: 'z-tree'
})

// 定义 emitts
const emit = defineEmits(treeEmitts)

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
const createTree = (data: TreeOption[], parent: TreeNode | null = null): any => {
  const traversal = (data: TreeOption[], parent: TreeNode | null = null) => {
    return data.map(node => {
      const children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [], // 默认为空，有children再去递归
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        disabled: !!node.disabled,
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
  const result: TreeNode[] = traversal(data, parent)
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
  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i])
  }
  // 深度遍历
  while (stack.length) {
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
const isExpanded = (node: TreeNode): boolean => {
  return expandedKeysSet.value.has(node.key)
}

// 折叠功能
const collpase = (node: TreeNode) => {
  expandedKeysSet.value.delete(node.key)
}

// loading 的keys
const loadingKeysRef = ref(new Set<Key>())

// 触发加载
const triggerLoading = async (node: TreeNode) => {
  // 需要异步加载的判断
  if (!node.children.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      const onLoad = props.onLoad
      if (onLoad) {
        try {
          const children = await onLoad(node.rawNode)
          // 修改原来的节点
          node.rawNode.children = children
          // 更新自定义的node，下次点击就不用重写加载了
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}

// 展开功能
const expand = (node: TreeNode) => {
  expandedKeysSet.value.add(node.key)
  // 这里应该实现对应的加载逻辑
  triggerLoading(node)
}

// 切换展开
const toggleExpand = (node: TreeNode) => {
  const expandedKeys = expandedKeysSet.value
  // 如果节点正在加载中，不能收起
  if (expandedKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collpase(node)
  } else {
    expand(node)
  }
}

// 选中节点
const selectKeysRef = ref<Key[]>([])
watch(
  () => props.selectedKeys,
  value => {
    if (value) {
      selectKeysRef.value = value
    }
  },
  {
    immediate: true
  }
)

const handleSelect = (node: TreeNode) => {
  // selectKeysRef 是proxy的，可以使用Array.from 得到数组类型的
  let keys = Array.from(selectKeysRef.value)

  if (!props.selectable) return

  if (props.multiple) {
    let index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      // 已选中移除
      keys.splice(index, 1)
    } else {
      // 未选中
      keys.push(node.key)
    }
  } else {
    if (keys.includes(node.key)) {
      // 已选中移除
      keys = []
    } else {
      // 未选中
      keys = [node.key]
    }
  }
  emit('update:selectedKeys', keys)
}

provide(treeInjectKey, {
  slots: useSlots()
})

// checkbox 选中的数据
const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))
const isChecked = (node: TreeNode) => {
  return checkedKeysRefs.value.has(node.key)
}

</script>