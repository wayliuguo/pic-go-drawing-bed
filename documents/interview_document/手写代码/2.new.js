function objectFactory () {
    // 获取传入的构造函数
    const constructor = Array.prototype.shift.call(arguments)
    let result = null
    let newObject = null
    if (typeof constructor !== 'function') {
        throw new Error('error')
    }
    // 设置原型，将对象的原型设置为函数的 prototype 对象
    newObject = Object.create(constructor.prototype)
    console.log('将对象的原型设置为函数的 prototype 对象>>>', newObject) // Person {}
    // 将 this 指向新建对象，并执行函数
    result = constructor.apply(newObject, arguments) // Person { name: 'well' }
    console.log('将 this 指向新建对象，并执行函数>>>', newObject)
    // 判断返回对象
    let flag = result && (typeof result === "object" || typeof result === "function");
    // 判断返回结果
    return flag ? result : newObject;
}

function Person (name) {
    this.name = name
}
const well = objectFactory(Person, 'well')
console.log(well)