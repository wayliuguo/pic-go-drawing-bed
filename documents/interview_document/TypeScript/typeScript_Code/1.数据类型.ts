export {}
// num
let num: number
num = 123
num = 0b1111011 // 二进制
num = 0o146 // 八进制
num = 0x7b // 十六进制

// string
let str: string = 'hello world'

// boolean
let bol: boolean = false

// null 和 undefined
let u: undefined = undefined
let n: null = null

// bigInt
/* const max = Number.MAX_SAFE_INTEGER
const max1 = max +1
const max2 = max +2
console.log(max1 === max2) // true */
const max = BigInt(Number.MAX_SAFE_INTEGER)
const max1 = max +1n
const max2 = max +2n
console.log(max1 === max2) // false

// symbol
// 1.基本使用
const s1= Symbol('TypeScript')
const s2 = Symbol('TypeScript')
console.log(typeof s1)
// console.log(s1 === s2) // 报错，此条件始终返回false
let a: symbol = Symbol()
// 2.作为属性名
let title = Symbol()
let obj = {
    [title]: 'TypeScript'
}
console.log(obj) // { [Symbol()]: 'TypeScript' }
console.log(obj[title]) // TypeScript
// console.log(obj.title) // 报错，不存在属性title
// 3.symbol 属性名遍历
const myTitle = Symbol('TypeScript')
const myObj = {
    [myTitle]: 'TypeScript',
    age: 18
}
// for in 与 下面的方法都取不到
for (const key in myObj) {
    console.log(key) // age
}
console.log(Object.keys(myObj)) // [ 'age' ]
console.log(Object.getOwnPropertyNames(myObj)) // [ 'age' ]
console.log(JSON.stringify(myObj)) // {"age":18}
// 可以使用 Object.getOwnPropertySymbols
console.log(Object.getOwnPropertySymbols(myObj)) // [ Symbol(TypeScript) ] 
// Reflect.ownKeys 可以获取所有类型的属性名
console.log(Reflect.ownKeys(myObj)) // [ 'age', Symbol(TypeScript) ]
// symbol 静态方法
const tsSymbol = Symbol.for('TypeScript')
console.log(tsSymbol === Symbol.for('TypeScript')) // true
console.log(Symbol.keyFor(tsSymbol)) // TypeScript

// Array
let list1: number[] = [1,2,3]
let list2: Array<number> = [1,2,3]
let list3: (number | string | object)[] = ['a', 1, {}]

// object
let obj2: object
obj2 = {
    name: 'TypeScript'
}
function getKeys (obj: object) {
    return Object.keys(obj)
}
getKeys({
    a: 'a'
})
// getKeys(123) // 运行会报错，Argument of type 'number' is not assignable to parameter of type 'object'

// 元组
let arr: [string, number, boolean]
arr = ['a', 1, false]
// arr = [1, 'a', false] error
// arr = ['a', 2] error

interface Tuple extends Array<number | string> {
    0: string;
    1: number;
    length: 2;
}

// 枚举
enum Roles {
    SUPER_ADMIN,
    ADMIN,
    USER
}
console.log(Roles.SUPER_ADMIN) // 0
enum Roles1 {
    SUPER_ADMIN = 5,
    ADMIN=4,
    USER
}
console.log(Roles1.SUPER_ADMIN) // 5
console.log(Roles1.USER) // 5

// any
let anyType: any = 1
anyType = false

// void
const consoleText = (text: string): void => {
    console.log(text)
}
let consoleVal = consoleText('123')
consoleVal = null // 需要关闭strictNullChecks
consoleVal = undefined

// never
// never的特点
const throwErrorFunc = () => { 
    throw new Error()
}
const add = (a:number,b:number):number => a + b
// let neverVal: never = add(1,2) // 不能将类型“number”分配给类型“never”
let neverVal: never = throwErrorFunc()
const myString = ''
// never 类型可以赋值给其他类型
const myInt: number = neverVal
// neverVal = myString // 其他类型不可以赋值给never类型
// 函数中的never
const output = () => {
    while(true) {
        console.log('循环')
    }
}

// unknow
// 其他类型可以赋值给unknow
let notSure: unknown = 4
notSure = 'string'
notSure = [1, 2, 3]
// unknow 值只可以赋值给unknow或any
let nameString = 'well'
// nameString = notSure // error
let notSureA: unknown = 2
notSure = notSureA
let anyA: any = 2
anyA = notSure
// 缩小类型范围
let result: unknown
if (typeof result === 'number') {
    result.toFixed()
}