<template>
  <div>
    proxyObj.a = {{proxyObj.a}}
  </div>
  <div>
    proxyObj.h= {{proxyObj.h}}>>>解构丢失了响应性
  </div>
</template>

<script setup>
import { reactive, readonly, ref, computed } from 'vue'
// reactive —— 深层响应式对象
const proxyObj = reactive({
  a: 1,
  b: {
    c: 2,
    d: [1, 2, 3],
    e: {
      f: 3
    }
  },
  h: 200
})
// reactive 解构会丢失响应性
let { h } = proxyObj
h = 500

// readonly —— 只读
const newProxyObj = readonly(proxyObj)
newProxyObj.a = 2

// ref——返回一个响应式且可变的 ref 对象
const myName = ref('刘国威')
// 如果 ref 传入一个对象，则其被 reactive 处理为深层响应式对象,(其value 变成 Proxy)
const refObj = ref({
  status: 1
})
// ref 作为响应式对象的property 被访问或更改时，自动解包
// 其仅仅发生在 Object 嵌套的时候，如果是数组或者其他原生集合如Map都不会自动解包，需要.value
const myNameReactive = reactive({
  myName
})
const myNameArrReactive = reactive([
  myName
])

// compouted
const sentence = ref('well')
const sentenceAll = ref('liuguowei')
const superSentence = computed(() => sentence.value)
const superSentenceAll = computed({
  get () {
    return sentenceAll.value
  },
  set (value) {
    sentenceAll.value += value
  }
})
superSentenceAll.value = '已修改'

console.log('reactive>>>', proxyObj.a) // reactive>>> 1
console.log('reactive>>>', h) // reactive>>> 500
console.log('readonly>>>', newProxyObj.a) // 警告——1
console.log('ref>>>', myName.value) // ref>>> 刘国威
console.log('ref>>>', myNameArrReactive[0].value) // ref>>> 刘国威
console.log('ref>>>', refObj) // RefImpl{...}
console.log('ref>>>', myNameReactive.myName) // ref>>> 刘国威
console.log('computed>>>', superSentence.value) // computed>>> well
console.log('computed>>>', superSentenceAll.value) // computed>>> liuguowei已修改
</script>
