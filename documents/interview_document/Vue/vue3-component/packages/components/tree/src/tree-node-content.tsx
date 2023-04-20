import { defineComponent } from 'vue'
import { treeInjectKey, treeNodeContentProps } from './tree'
import { inject } from 'vue'

export default defineComponent({
  name: 'ZTreeNodeContent',
  props: treeNodeContentProps,
  setup(props) {
    const treeContext = inject(treeInjectKey)
    const node = props.node
    return () => {
      return treeContext?.slots.default
        ? treeContext?.slots.default({ node })
        : node?.label
    }
  }
})
