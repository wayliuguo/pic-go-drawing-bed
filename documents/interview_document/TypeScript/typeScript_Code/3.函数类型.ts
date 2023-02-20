export {}
// 直接定义
function addFn (x: number, y: number):number {
    return x + y
}
const addFnArrow = (x: number, y: number): number => {
    return x + y
}
// 完整函数类型定义：指定参数、指定返回值
let addVal: (x: number, y: number) => number
addVal =  (x: number, y: number): number => x + y

// 接口定义
interface AddInt {
    (x: number, y: number): number
}
let myAdd: AddInt = (x: number, y:number):number => x + y

// 类型别名定义
type AddType = (x: number, y: number) => number
let myAddType = (x: number, y:number):number => x + y

// 可选参数
type AddMore = (x:number, y:number, z?:number) => number
let myAddMOre: AddMore = (x, y, z) => {
    if (z) {
        return x + y + z
    }
    return x + y
}
console.log(myAddMOre(1,2)) // 3
console.log(myAddMOre(1,2,3)) // 6

// 默认参数
const AddDefault = (x: number, y: number = 2) => {
    return x + y
}
const AddDefaultMore = (x: number, y: number | string = 2) => {
    return `${x}${y}`
}

// 剩余参数
const handleData = (x: number, ...args: number[]) => Array
const handleDataMore = (x: number, ...args: (number | string)[]) => Array

// 函数重载
let attrObj = {
    name: '',
    age: 0
}
// function attr():void
/* 
  如果传入的val是一个字符串赋值给attrObj.name
  如果传入的val是一个数字赋值给attrObj.age
  @param val
*/
function attr(val: string):void
function attr(val: number):void
function attr (val:any):void {
    if (typeof val === 'string') {
        attrObj.name = val
    } else if (typeof val === 'number') {
        attrObj.age  = val
    }
}
attr('well')
attr(18)
// attr(true) // 报错
