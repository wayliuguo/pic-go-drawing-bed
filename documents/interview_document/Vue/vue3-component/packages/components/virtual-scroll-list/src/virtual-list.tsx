import { defineComponent, onBeforeMount, onUpdated, ref } from 'vue'
import { RangeOptions, updateType, virtualPorps } from './props'
import { initVirtual } from './virtual'
import { throttle } from 'lodash'

export default defineComponent({
  name: 'z-virtual-scroll-list',
  props: virtualPorps,
  setup(props) {
    // 定义范围变量
    const range = ref<RangeOptions | null>(null)
    // 方法对象
    let virtual: ReturnType<typeof initVirtual>
    // 列表 ref
    const root = ref<HTMLElement | null>(null)

    // 获取数据源id数组
    const getUniqueIdFromDataSources = () => {
      const { dataSources, dataKey } = props
      return dataSources.map(dataSource => dataSource[dataKey])
    }

    // 更新范围
    const update: updateType = newRange => {
      range.value = newRange
    }

    // 初始化范围
    const installVirtual = () => {
      // 初始化范围
      virtual = initVirtual(
        {
          keeps: props.keeps,
          buffer: Math.round(props.keeps / 3),
          uniqueIds: getUniqueIdFromDataSources(),
          estimateSize: props.estimateSize
        },
        update
      )
    }
    // 根据范围更新渲染的组件
    function genRenderComponent() {
      const slots = []
      const { start, end } = range.value!
      const { dataSources, dataComponent, dataKey } = props
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index]
        const uniqueKey = dataSource[dataKey]
        if (dataComponent) {
          slots.push(
            <dataComponent key={uniqueKey} source={dataSource}></dataComponent>
          )
        }
      }
      return slots
    }
    // 滚动事件
    const onScroll = throttle(() => {
      if (root.value) {
        // 获取滚动卷去的高度
        const offset = root.value.scrollTop
        virtual.handleScroll(offset)
      }
    }, 16.7)

    // 挂载前计算范围
    onBeforeMount(() => {
      installVirtual()
    })

    return () => {
      // 从范围变量中获取上下padding并设置
      const { padBehind, padFront } = range.value!
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
