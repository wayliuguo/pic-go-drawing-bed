import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { virtualProps } from './virtualProps'
import { createNamespace } from '@zi-shui/utils/create'
import { reactive } from 'vue'
import { throttle } from 'lodash'

export default defineComponent({
  name: 'ZVirtualList',
  props: virtualProps,
  setup(props, { slots }) {
    const bem = createNamespace('vl')

    const wrapperRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()

    // 计算显示的区域
    const state = reactive({
      start: 0,
      end: props.remain
    })
    // 偏移量：滚动过去了多少个
    const offset = ref(0)

    const prev = computed(() => {
      return Math.min(state.start, props.remain)
    })
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end)
    })

    // 这里应该多展示上八条和下八条(两屏)，保证快速滚动不会白屏
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    // 监听滚动
    const handleScroll = throttle(() => {
      // 根据当前滚动的距离来算过去了几个数据
      const scrollTop = wrapperRef.value!.scrollTop
      // 滚动后的开始位置
      state.start = Math.floor(scrollTop / props.size)
      // 滚动后的结束位置
      state.end = state.start + props.remain
      // 滚动过去了多少个（- props.size * prev.value）：减去前面补的
      offset.value = state.start * props.size - props.size * prev.value
    }, 300)

    const initWrapper = () => {
      wrapperRef.value!.style.height = `${props.remain * props.size}px`
      barRef.value!.style.height = `${props.items.length * props.size}px`
    }

    watch(
      () => props.items,
      () => {
        initWrapper
      }
    )

    onMounted(() => {
      initWrapper()
    })

    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
          {/* 模拟总长度，感觉有很多数据 */}
          <div class={bem.e('scroll-bar')} ref={barRef}></div>
          <div
            class={bem.e('scroll-list')}
            style={{ transform: `translate3d(0, ${offset.value}px, 0)` }}
          >
            {visibleData.value.map((node, idx) => slots.default!({ node }))}
          </div>
        </div>
      )
    }
  }
})
