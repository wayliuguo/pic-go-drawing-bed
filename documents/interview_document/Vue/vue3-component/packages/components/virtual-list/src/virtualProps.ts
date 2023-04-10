import { ExtractPropTypes, PropType } from "vue"

export const virtualProps = {
  size: {
    type: Number as PropType<number>,
    default: 35
  },
  remain: {
    default: 8,
    type: Number as PropType<number>
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => []
  }
} as const

export type VirtualProps = ExtractPropTypes<typeof virtualProps>