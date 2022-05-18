## 1. let

```
if (true) {
    // console.log(foo) // 报错
    let foo = 'well'
}
```

## 2. const

- const = let + 衡量
- 不是不给修改，而是不可以改变内存指向

```
const obj = {
    name: 'well'
}

obj.name = 'liuguowei'
obj = {} // 报错
```

## 3.数组的解构

- 按下标解构
- 剩余成员
- 默认值

```
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
```

## 4.对象的解构

- 按照属性名 解构
- 变量名冲突，可重新命名
- 添加默认值

```
const obj = {
    name: 'well',
    age: 18
}

// 按属性名匹配
const { name } = obj
console.log(name) // well

// 如果存在变量冲突，则可解构后使用另一个变量名称接收
// 默认值使用=
const age = 20
const {age: AGE = 88} = obj
console.log(AGE) // 18

```

