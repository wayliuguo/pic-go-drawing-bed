// tuple(元组)转union(联合)
type Elements<T> = T extends Array<infer E> ? E : never
type Ttuple = [string, number]
// type TupleToUnion = string | number
type TupleToUnion = Elements<Ttuple>

// 联合类型转交叉类型
type T1 = {
    name: string
}
type T2 = {
    age: number
}
type ToIntersection<T> = T extends {
    a: (x: infer U) => void, b: (x: infer U) => void
} ? U : never
// type T3 = T1 & T2
type T3 = ToIntersection<{ a: (x: T1) => void, b: (x: T2) => void}>
let tt3: T3 = {
    name: 'well',
    age: 18
}
