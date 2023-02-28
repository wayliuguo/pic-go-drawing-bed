export {}

// 比较参数: 参数不能比定义的多
type Func = (a: number, b: number) => void
let sum: Func
const f1 = (a: number, b:number):void => {}
function f2(a:number):void {}
// sum  有两个number类型参数，只要符合子集即可满足类型
sum = f1
sum = f2

// 比较返回值：返回值不能比定义的少
type GetPerson = () => {name: string, age: number}
let getPerson: GetPerson
function g1 () {
    return {
        name: 'well',
        age: 18
    }
}
function g2 () {
    return {
        name: 'well'
    }
}
function g3 () {
    return {
        name: 'well',
        age: 18,
        sex: 1
    }
}
getPerson = g1
// getPerson = g2 // 类型 "{ name: string; }" 中缺少属性 "age"
getPerson().age.toString() // 以这个来理解， g2没有age就会报错
getPerson = g3