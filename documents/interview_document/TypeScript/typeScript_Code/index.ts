type Cart<T> = {
    list: T[]
} | T []

let c1: Cart<string> = {
    list: ['1']
}
let c2: Cart<number> = [1]

interface MyCart<T=string> {
    list: T[]
}
let m1: MyCart<number> = {
    list: [1]
}
let m2: MyCart = {
    list: ['1']
}