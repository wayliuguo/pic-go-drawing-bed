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
