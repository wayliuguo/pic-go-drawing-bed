interface A {
    name: string
    c: number
}
interface B {
    age: number
    c: number
}
type C = A | B
let c1: C = {
    name: 'well',
    c: 18
}
let c2: C = {
    age: 18,
    c: 110
}
let c3: C = {
    name: 'well',
    age: 18,
    c: 110
}
let c4: C = {
    name: 'well',
    age: 18,
    c: 110,
    // type: 'boom' // error
}


type AA = string | number
type BB = string | boolean
type CC = AA | BB // type CC = string | number | boolean
let cc1: CC = 'WELL'
let cc2: CC = 18
let cc3: CC = false

