import {ExtractPropTypes, PropType} from 'vue'

export type Key = string | number

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
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
  // 选中节点
  selectedKeys: {
    type: Array as PropType<Key[]>
  },
  selectable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
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
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>,
    default: new Set([])
  },
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  }
} as const

export const treeNodeEmitts = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node
}

export const treeEmitts = {
  // 内部发射的事件，用来同步响应式数据
  'update:selectedKeys': (keys: Key[]) =>  keys
}

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