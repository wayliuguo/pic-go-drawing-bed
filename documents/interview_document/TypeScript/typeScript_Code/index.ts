// 定义条件类型
interface Fish {
    name1: string
}
interface Water {
    name2: string
}
interface Bird {
    name3: string
}
interface Sky {
    name4: string
}
type Condition<T> = T extends Fish ? Water : Sky
// let con: Water
let con: Condition<Fish> = {
    name2: '水'
}


// 条件类型的分发
// 条件类型有一个特性：分布式条件类型，前提是条件类型必须是 naked type parameter(裸露)
// let con1: Water | Bird
let con1: Condition<Fish | Bird> = {
    name2: '水'
}
// let con2: Water | Bird
let con2: Condition<Fish | Bird> = {
    name4: '天空'
}
// 无法达成类型分发
type Condition2<T> = {t: T} extends { t: Fish} ? Water : Sky
// <Fish | Bird>
let con3: Condition2<Fish | Bird> = {
    name4: '天空'
}

// 找出T中不包含U的部分
type Diff<T,U> = T extends U ? never : T
// type R = "d"
type R = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>
let r: R = 'd'

// 找出TU共有部分
type Filter<T, U> = T extends U ? T : never
// type F = "a" | "b" | "c"
type F = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>
let f: F = 'a'