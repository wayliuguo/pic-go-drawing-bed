import { DefineComponent, ExtractPropTypes, PropType } from 'vue'

interface dataSourceType {
  id: number
  [prop: string]: any
}

export const virtualPorps = {
  // 要渲染的总数居
  dataSources: {
    type: Array as PropType<Array<dataSourceType>>,
    require: true,
    default: () => []
  },
  // 每项数据的标识
  dataKey: {
    type: String,
    required: true
  },
  // 显示个数
  keeps: {
    type: Number,
    default: 30
  },
  // 大约高度
  estimateSize: {
    type: Number,
    default: 80
  },
  // 使用的渲染组件
  dataComponent: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>,
    require: true
  }
} as const

export type VirtualPorps = ExtractPropTypes<typeof virtualPorps>

export type RangeOptions = {
  // 开始
  start: number
  // 结束
  end: number
  // 上 padding
  padFront: number
  // 下 padding
  padBehind: number
}

export type VirtualOptions = {
  keeps: number
  buffer: number
  estimateSize: number
  uniqueIds: string[]
}

export type updateType = (range: RangeOptions) => void

export const virtualItemProps = {
  uniqueKey: {
    type: [String, Number] as PropType<string | number>
  },
  source: {
    type: Object,
    required: true
  },
  component: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>
  }
}

export type VirtualItemProps = ExtractPropTypes<typeof virtualItemProps>
