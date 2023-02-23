export {}
abstract class Animal {
    name: string = 'well'
    constructor(name: string) {
        this.name = name
    }
    abstract speak(): void
    sing() {
        console.log('abcdefg')
    }
}

interface Flying {
    fly(): void
}

class Duck extends Animal implements Flying {
    price: number
    constructor(name: string, price: number) {
        super(name)
        this.price = price
    }
    fly(): void {
        console.log('fly...')
    }
    speak(): void {
        console.log('咕咕咕')
    }
}

let duck = new Duck('唐老鸭', 180)
console.log(duck.name) // 唐老鸭
console.log(duck.price) // 180
duck.fly() // fly...
duck.speak() // 咕咕咕
duck.sing() // abcdefg