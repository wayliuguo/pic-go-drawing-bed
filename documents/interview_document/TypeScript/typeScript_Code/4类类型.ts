// 1.类的使用
class Point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    getPosition():string {
        return `${this.x}${this.y}`
    }
}
const point = new Point(1,2)
point.getPosition()

// 2.类的继承
class A {
    name: string
    age: number
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
    getName () {
        return this.name
    }
}
class B extends A {
    job: string
    constructor(name: string, age: number) {
        super(name, age)
        this.job = 'IT'
    }
    getJob() {
        return this.job
    }
    getNameAndJob() {
        return super.getName() + this.job
    }
}
const b = new B('Tom', 20)
console.log(b.name) // Tom
console.log(b.age) // 20
console.log(b.getName()) // Tom
console.log(b.getJob()) // IT
console.log(b.getNameAndJob()) // TomIT

// 3.访问修饰符-protected
class Parent {
    protected age: number
    constructor(age: number) {
        this.age = age
    }
    protected getAge() {
        return this.age
    }
}
const p = new Parent(18)
// console.log(p.age) // 属性“age”受保护，只能在类“Parent”及其子类中访问
// console.log(p.getAge()) // 属性“getAge”受保护，只能在类“Parent”及其子类中访问
// console.log(Parent.age) // 类型“typeof Parent”上不存在属性“age”
class Child extends Parent {
    constructor(age: number) {
        super(age)
        console.log(super.age) // undefined
        console.log(super.getAge()) // 18
    }
}
new Child(18)

// 3.访问修饰符-private
class Parent1 {
    private age: number
    constructor(age: number) {
        this.age = age
    }
    private getAge() {
        return this.age
    }
}
const p1 = new Parent1(18)
// console.log(p1.age) // 属性“age”为私有属性，只能在类“Parent1”中访问
// console.log(p1.getAge()) // 属性“getAge”为私有属性，只能在类“Parent1”中访问
// console.log(Parent1.age) // 类型“typeof Parent1”上不存在属性“age”
class Child1 extends Parent1 {
    constructor(age: number) {
        super(age)
        // console.log(super.age) // 属性“age”为私有属性，只能在类“Parent1”中访问
        // console.log(super.getAge()) // 属性“getAge”为私有属性，只能在类“Parent1”中访问
    }
}
new Child1(18)

//  4.只读修饰符
class UserInfo {
    readonly name: string
    constructor(name: string) {
        this.name = name
    }
}
const user = new UserInfo('TypeScript')
// user.name = 'haha' // 无法分配到 "name" ，因为它是只读属性

// 5.类的使用-抽象类
abstract class People {
    constructor(public name: string) {}
    abstract printName(): void
}
class Man extends People {
    constructor(name: string) {
        super(name)
        this.name = name
    }

    printName(): void {
        console.log(this.name)   
    }
}
// const m = new Man() // 应有 1 个参数，但获得 0 个
const m = new Man('mike')
m.printName()
// const pike = new People('pike') // 无法创建抽象类的实例


