export {}
// 从赋的值中推断出来（从右到左）
let name = 'well'
// name = 1 // 不能将类型“number”分配给类型“string”

// 根据 return 推断返回类型（底部流出）
function add(a:number, b: number) {
    return a+b
}
let c = add(1,2)
// c = '3' // 不能将类型“string”分配给类型“number”

// 从左到右
type Sum = (a: number, b: number) => number
let sum: Sum = (a, b) => {
    // a = '1' // 不能将类型“string”分配给类型“number”
    return a + b
}

// 对象类型推断
let Person = {
    age: 18
}
let { age } = Person
// age = '18' // 不能将类型“string”分配给类型“number”

// 接口类型推断
interface DefaultProps {
    name?: string
    age?: number
}
let defaultProps: DefaultProps = {
    name: 'well',
    age: 18
}
let props = {
    ...defaultProps,
    home: '深圳'
}
/**
 * let props: {
    home: string;
    name?: string | undefined;
    age?: number | undefined;
  }
 */


// 小心使用返回值
function addOne (a: any) {
    return a+1
}
function total(a:number, b: number) {
    return a+addOne(b)
}
let k = total(1,2) // let k: any