import { defineComponent, onBeforeMount, ref } from 'vue'
import { RangeOptions, updateType, virtualPorps } from './props'
import { initVirtual } from './virtual'
import VirtualItem from './virtual-item'

export default defineComponent({
  name: 'z-virtual-scroll-list',
  props: virtualPorps,
  setup(props) {
    const range = ref<RangeOptions | null>(null)
    // 更新range
    const update: updateType = newRange => {
      range.value = newRange
    }
    // 获取数据源指定唯一key组成的数组
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

    const onItemResize = (id: string | number, size: number) => {
      virtual.saveSize(id, size)
    }

    const genRenderComponent = () => {
      const slots = []
      const { start, end } = range.value!
      const { dataSources, dataComponent, dataKey } = props
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index]
        const uniqueKey = (dataSource as any)[dataKey]
        if (dataSource) {
          slots.push(
            <VirtualItem
              uniqueKey={uniqueKey}
              source={dataSource}
              component={dataComponent}
              onItemResize={onItemResize}
            ></VirtualItem>
          )
        }
      }
      return slots
    }

    const root = ref<HTMLElement | null>()
    const onScroll = () => {
      if (root.value) {
        // 滚动的距离
        const offset = root.value.scrollTop
        virtual.handleScroll(offset)
      }
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
        <div onScroll={onScroll} ref={root}>
          <div style={paddingStyle}>{genRenderComponent()}</div>
        </div>
      )
    }
  }
})
