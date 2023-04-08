<template>
  <div :class="[
    bem.b(), 
    bem.is('selected', isSelected),
    bem.is('disabled', node.disabled)
  ]">
    <div 
      :class="bem.e('content')"
      :style="{paddingLeft: `${node.level * 16}px`}"
    >
      <span 
        :class="[
          bem.e('expand-icon'),
          { expanded: expanded && !node.isLeaf },
          bem.is('leaf', node.isLeaf)
        ]"
        @click="handleExpand"
      >
        <z-icon size="25">
          <Switcher v-if="!isLoading"></Switcher>
          <Loading v-else></Loading>
        </z-icon>
      </span>
      <span 
        @click="handleSelected"
        :class="bem.e('label')"
      >
        <ZTreeNodeContent :node="node"></ZTreeNodeContent>
        <!-- {{ node?.label }}{{ treeContext?.slots.default!({ node }) }} -->
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ZIcon from '@zi-shui/components/icon'
import Switcher from '@zi-shui/components/internal-icon/Switcher';
import Loading from '@zi-shui/components/internal-icon/Loading'
import ZTreeNodeContent from './tree-node-content'
import { createNamespace } from '@zi-shui/utils/create';
import { treeInjectKey, treeNodeEmitts, treeNodeProps } from './tree';
import { computed } from 'vue';
import { inject } from 'vue';

// 定义 props
const props = defineProps(treeNodeProps)

// 定义 emitts
const emit = defineEmits(treeNodeEmitts)

const bem = createNamespace('tree-node')

// 触发切换
const handleExpand = () => {
  emit('toggle', props.node)
}

// 是否正在加载
const isLoading = computed(() => {
  return props.loadingKeys.has(props.node.key)
})

// 是否选中
const isSelected = computed(() => {
  return props.selectedKeys.includes(props.node.key)
})

const handleSelected = () => {
  // 如果是禁用的
  if (props.node.disabled) return
  emit('select', props.node)
}

const treeContext = inject(treeInjectKey)
</script>