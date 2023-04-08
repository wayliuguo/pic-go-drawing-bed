<script setup lang="ts">
import { TreeOption, Key } from '@zi-shui/components/tree/src/tree';
import { ref } from 'vue'


/* function createData () {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false
    }
  ]
} */

function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(6 - level).fill(0)
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
/* const data = ref<TreeOption[]>(
  [
    {
      key: '0',
      label: '0',
      children: [
        {
          key: '0-0',
          label: '0-0'
        },
        {
          disabled: true,
          key: '0-1',
          label: '0-1',
          children: [
            {
              label: '0-1-0',
              key: '0-1-0'
            },
            {
              label: '0-1-1',
              key: '0-1-1'
            }
          ]
        }
      ]
    },
    {
      key: '1',
      label: '1',
      children: [
        {
          key: '1-0',
          label: '1-0'
        },
        {
          checkboxDisabled: true,
          key: '1-1',
          label: '1-1',
          children: [
            {
              label: '1-1-0',
              key: '1-1-0'
            },
            {
              label: '1-1-1',
              key: '1-1-1'
            }
          ]
        }
      ]
    }
  ]) */

const handleLoad = (node: TreeOption) => {
  return new Promise<TreeOption[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 2000)
  })
}

const value = ref<Key[]>(['40', '41'])

</script>

<template>
  <z-tree 
    v-model:selected-keys="value" 
    selectable multiple :data="data" 
    label-field="label" key-field="key"
    children-field="children"
    :default-expanded-keys="['40', '41']"
    :on-load="handleLoad"
  >
    <template #default="{node}">
      {{ node.key }} - {{ node.label }}
    </template>
  </z-tree>
</template> 
