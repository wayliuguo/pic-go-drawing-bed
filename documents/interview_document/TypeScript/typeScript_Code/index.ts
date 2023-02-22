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
function propertyDecorator(key: string) {
    return function(target:any, propertyName: string) {
        console.log('propertyDecorator', propertyName, key)
    }
}
function methodDecorator() {
    return function(target:any, propertyName: string) {
        console.log('methodDecorator', propertyName)
    }
}
function parameterDecorator() {
    return function(target:any, methodName: string, index: number) {
        console.log('parameterDecorator', methodName)
    }
}
@classDecorator1()
@classDecorator2()
class Person {
    @propertyDecorator('name')
    name: string = ''
    @propertyDecorator('age')
    age: number = 18
    @methodDecorator()
    hello(@parameterDecorator() p1:string, @parameterDecorator() p2: string){}
}