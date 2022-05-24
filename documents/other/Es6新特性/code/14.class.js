/* function Person(name) {
    this.name = name
    this.speak = function() {
        return this.name
    }
}
Person.prototype.say = function () {
    return this.name
}
const person = new Person('liuguowei')
person.name = 'well'
console.log(person.speak())// well
console.log(person.say()) // well
 */

class Person {
    constructor(name) {
        this.name = name
    }
    say () {
        return this.name
    }
    // 静态方法， this 指向 类本身
    static create(name) {
        return new Person(name)
    }
}
const p = new Person('well')
console.log(p.say())
const tom = Person.create('tom')
console.log(tom.say()) // tom

// 继承
class Student extends Person {
    constructor (name, number) {
        super(name)
        this.number = number
    }
    hello() {
        return super.say()
    }
}
const s = new Student('jack', 100)
console.log(s.hello()) // jack