export {}
class Animal {
    name!: string
}
class Bird extends Animal {
    age!: number
}
let b: Bird = {
    name: '',
    age: 0
}
const a: Animal = b

