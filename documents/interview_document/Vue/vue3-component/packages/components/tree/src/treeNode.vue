<template>
  <div :class="bem.b()">
    <div 
      :class="bem.e('content')"
      :style="{paddingLeft: `${node.level * 16}px`}"
    >
      <span 
        :class="[bem.e('expand-icon'), { expanded: expanded && !node.isLeaf }]">
        <z-icon size="25">
          <Switcher></Switcher>
        </z-icon>
      </span>
      <span>{{ node?.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ZIcon from '@zi-shui/components/icon'
import Switcher from '@zi-shui/components/internal-icon/Switcher';
import { createNamespace } from '@zi-shui/utils/create';
import { treeNodeProps } from './tree';

const props = defineProps(treeNodeProps)
console.log(props)

const bem = createNamespace('tree-node')
</script>