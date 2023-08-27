import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import { virtualItemProps } from './props'

export default defineComponent({
  name: 'virtual-item',
  props: virtualItemProps,
  emits: ['itemResize'],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null)

    const dispatchEvent = () => {
      emit('itemResize', props.uniqueKey, root.value?.offsetHeight)
    }

    onMounted(dispatchEvent)
    onUpdated(dispatchEvent)
    return () => {
      const { component: Com, source, uniqueKey } = props
      return (
        Com && (
          <div key={uniqueKey} ref={root}>
            <Com source={source}></Com>
          </div>
        )
      )
    }
  }
})