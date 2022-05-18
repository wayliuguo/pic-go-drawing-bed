const arr = [100, 200, 300]

const one = arr[0]
const two = arr[1]
const three = arr[2]

// 根据数组下标解构
const [ONE, TWO, THREE] = arr
console.log(ONE, TWO, THREE) // 100 200 300 

// 解构数组剩余成员，只可以用在末尾
const [foo, ...rest] = arr
console.log(foo, rest) // 100 [ 200, 300 ]

// 没有提取到，取到默认值
const [first, second, third, four=400] = arr
console.log(four) // 400