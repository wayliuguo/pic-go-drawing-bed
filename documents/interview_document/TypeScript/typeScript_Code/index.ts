export {}
function classDecorator1() {
    return function (target: any) {
        console.log('classDecorator1')
    }
}
function classDecorator2() {
    return function (target: any) {
        console.log('classDecorator2')
    }
}
@classDecorator1()
@classDecorator2()
class Person {
    name: string = ''
    age: number = 18
    hello(p1:string, p2: string){}
}