export {}
abstract class Animal {
    name!: string
    abstract speak():void
}

// 子类实现父类，必须实现
class Cat extends Animal {
    speak(): void {
        console.log('喵喵喵')
    }
}