import {ExtractPropTypes, PropType} from 'vue'

type Key = string | number

export interface TreeNode extends Required<TreeOption> {
  level: number,
  rawNode: TreeOption
}

export interface TreeOption {
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