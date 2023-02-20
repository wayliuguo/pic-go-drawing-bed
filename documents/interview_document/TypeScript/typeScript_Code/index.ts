class Father {
    static fatherName:string = 'father'
    public name: string
    protected age: number
    private money: number
    constructor(name: string, age: number, money: number) {
        this.name = name
        this.age = age
        this.money = money
    }
    getName():string {
        // public 自己能访问
        return this.name
    }
}

class Child extends Father {
    static childName:string = 'child'
    constructor(name: string, age: number, money: number) {
        super(name, age, money)
    }
    desc() {
        // public protected 子类能访问
        console.log(this.name, this.age)
    }
    showMoney() {
        // console.log(this.money) // 属性“age”受保护，只能在类“Father”及其子类中访问。
    }
}

let child = new Child('well', 18, 2000)
// public 其他类能访问
console.log(child.name)
// console.log(child.age) // 属性“age”受保护，只能在类“Father”及其子类中访问。
// console.log(child.money) // 属性“money”为私有属性，只能在类“Father”中访问

// 子类也可以调用父类的静态属性或方法
console.log(Child.fatherName, Child.childName)