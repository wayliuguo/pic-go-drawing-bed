Object.prototype.MyCreate = function (obj) {
    function F () {}
    F.prototype = obj
    console.log(F.prototype) // [Function: Person]
    return new F()
}
function Person (name) {
    this.name = name
}
const obj = Object.MyCreate(Person)
console.log(obj) // Function {}