import { ExtractPropTypes } from "vue"

export const virtualProps = {
  size: {
    type: Number,
    default: 35
  },
  remain: {
    default: 8,
    type: Number
  },
  items: {
    type: Array,
    default: () => []
  }
} as const

export type VirtualProps = ExtractPropTypes<typeof virtualProps>