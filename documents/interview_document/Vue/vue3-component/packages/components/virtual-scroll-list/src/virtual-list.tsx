import { defineComponent, onBeforeMount, ref } from 'vue'
import { RangeOptions, updateType, virtualPorps } from './props'
import { initVirtual } from './virtual'
import VirtualItem from './virtual-item'

export default defineComponent({
  name: 'z-virtual-scroll-list',
  props: virtualPorps,
  setup(props) {
    // 范围变量
    const range = ref<RangeOptions | null>(null)
    // 更新range
    const update: updateType = newRange => {
      range.value = newRange
    }
    // 获取数据源指定唯一key组成的数组
    const getUniqueueIdFromDataSources = (): string[] => {
      const { dataSources, dataKey } = props
      return dataSources.map(dataSource => dataSource[dataKey])
    }
    // 虚拟列表处理对象
    let virtual: ReturnType<typeof initVirtual>
    // 初始化虚拟列表
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
      // virtual.saveSize(id, size)
    }

    const genRenderComponent = () => {
      const slots = []
      const { start, end } = range.value!
      const { dataSources, dataComponent, dataKey } = props
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index]
        const uniqueKey = dataSource[dataKey]
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
    // 监听虚拟列表滚动事件
    const onScroll = () => {
      if (root.value) {
        // 获取滚动的距离
        const offset = root.value.scrollTop
        console.log(offset)
        // 根据滚动的距离更新虚拟列表
        virtual.handleScroll(offset)
      }
    }

    onBeforeMount(() => {
      // 初始化虚拟列表
      installVirtual()
    })

    return () => {
      // 获取虚拟列表上下padding
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
