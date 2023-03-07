class Person {
    name: string
    constructor(name: string) {
        this.name = name
    }
    getName() {
        console.log(this.name)
    }
}
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
    T extends abstract new (...args: infer P) => any ? P : never
type params = ConstructorParameters<typeof Person>
// let p: [name: string]
let p: params = ['well']