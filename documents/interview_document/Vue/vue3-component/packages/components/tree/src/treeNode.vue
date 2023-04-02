<template>
  <div :class="bem.b()">
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
      <span>{{ node?.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ZIcon from '@zi-shui/components/icon'
import Switcher from '@zi-shui/components/internal-icon/Switcher';
import Loading from '@zi-shui/components/internal-icon/Loading'
import { createNamespace } from '@zi-shui/utils/create';
import { treeNodeEmitts, treeNodeProps } from './tree';
import { computed } from 'vue';

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
</script>