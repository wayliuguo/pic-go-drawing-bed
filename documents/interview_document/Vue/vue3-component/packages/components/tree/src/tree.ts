import {ExtractPropTypes, PropType} from 'vue'

type Key = string | number

export interface TreeNode extends Required<TreeOption> {
  level: number,
  rawNode: TreeOption,
  children: TreeNode[],
  isLeaf: boolean
}

export interface TreeOption {
  isLeaf: boolean
  label?: Key
  key?: Key
  children?: TreeOption[],
  [key: string]: unknown // 任意属性值
}

export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  }
} as const // as const 把 props 转为readOnly

export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  },
  expanded: {
    type: Boolean,
    required: true
  }
} as const

export type TreeNodeProps = ExtractPropTypes<typeof treeNodeProps>

export type TreeProps = ExtractPropTypes<typeof treeProps>
/**
 * 通过 ExtractPropTypes 获得以下类型
 * type TreeProps = {
    readonly data: TreeOption[];
    readonly labelField: string;
    readonly keyField: string;
    readonly childrenField: string;
  } & {}
 */