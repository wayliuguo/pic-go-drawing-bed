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

## 5.字符串的扩展方法

- startsWith
- endsWith
- includes

```
const message = 'Error: foo is not defined.'

console.log(message.startsWith('Error')) // true
console.log(message.endsWith('.')) // true
console.log(message.includes('foo')) // true
```

## 6.参数默认值

```
/* function foo (enable) {
    enable = enable === undefined ? true : enable
    console.log(enable)
} */

function foo (enable=true) {
    console.log(enable)
}
foo()
```

## 7.剩余参数

- arguments
- 剩余参数

```
function foo () {
    console.log(arguments) // 伪数组
    // [Arguments] { '0': 1, '1': 2, '2': 3, '3': 4 }
    console.log(arguments[0]) // 1
}

function face (first, ...args) {
    console.log(args) // [ 2, 3, 4 ]
} 

foo(1,2,3,4)
face(1,2,3,4)
```

## 8.展开数组

- 以前的做法
- 展开数组

```
const arr = [1, 2, 3]

// log 方法是console 对象调用的，把log指向 console
console.log.apply(console, arr) // 123

console.log(...arr) // 123
```

## 9. 箭头函数

- 没有this机制，不会改变this的指向
- 箭头函数不会创建自己的`this,它只会从自己的作用域链的上一层继承this`

```
<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
   <script>


      const age = 18

      const A = {
         age: 18,
         sayHello: () => {
            console.log(this.age) // undefined
            console.log(this.name) // window 
            console.log(this === window) // true
         },
         sayHi: function () {
            console.log(this.age) // 18
         }
      }
      A.sayHello()
      A.sayHi()
   </script>
</head>

<body>

</body>

</html>
```

