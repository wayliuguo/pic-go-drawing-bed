import { DefineComponent, ExtractPropTypes, PropType } from 'vue'

export const virtualPorps = {
  // 要渲染的总数居
  dataSources: {
    type: Array,
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
  start: number
  end: number
  padFront: number
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
