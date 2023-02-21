export {}
/* function Person () {}
Object.defineProperty(Person.prototype,'say', {
    value: function say() {
        console.log('hello')
    }
})
let p1 = new(Person as any)()
p1.say() // hello */

// 普通装饰器
namespace a {
    function addNameEat(c: Function) {
        c.prototype.name = 'well'
        c.prototype.eat = function () {
           console.log(this.name) // well
        }
    }
    @addNameEat
    class Person {
        name!: string;
        eat!: Function;
        constructor(){
        }
    }
    let p:Person = new Person()
    console.log(p.name) // well
    p.eat()
}

// 工厂装饰器
namespace b {
    function addNameEatFactory(name: string) {
        return function addNameEat(c: Function) {
            c.prototype.name = name
            c.prototype.eat = function () {
            console.log(this.name)  // liuguowei
            }
        }
    }
    @addNameEatFactory('liuguowei')
    class Person {
        name!: string;
        eat!: Function;
        constructor(){
        }
    }
    let p:Person = new Person()
    console.log(p.name) // liuguowei
    p.eat()
}