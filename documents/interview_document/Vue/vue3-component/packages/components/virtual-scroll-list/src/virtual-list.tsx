import { defineComponent, onBeforeMount, ref } from 'vue'
import { RangeOptions, updateType, virtualPorps } from './props'
import { initVirtual } from './virtual'

export default defineComponent({
  name: 'z-virtual-scroll-list',
  props: virtualPorps,
  setup(props) {
    const range = ref<RangeOptions | null>(null)
    const update: updateType = newRange => {
      range.value = newRange
    }
    const getUniqueueIdFromDataSources = (): string[] => {
      const { dataSources, dataKey } = props
      return dataSources.map(
        dataSource => (dataSource as any)[dataKey as any]
      ) as string[]
    }
    let virtual: ReturnType<typeof initVirtual>
    const installVirtual = () => {
      virtual = initVirtual(
        {
          keeps: props.keeps,
          buffer: Math.round(props.keeps / 3),
          uniqueIds: getUniqueueIdFromDataSources(),
          estimateSize: props.estimateSize
        },
        update
      )
    }

    onBeforeMount(() => {
      installVirtual()
    })
    return () => {
      const { padFront, padBehind } = range.value!
      const paddingStyle = {
        padding: `${padFront}px 0 ${padBehind}px`
      }

      

      return (
        <div>
          <div style={paddingStyle}></div>
        </div>
      )
    }
  }
})
