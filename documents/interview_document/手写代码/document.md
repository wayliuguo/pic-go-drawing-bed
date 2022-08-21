## 1. Object.create

思路：将传入的对象作为原型

```
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
```

## 2. new 操作符

- 创建一个空对象
- 设置原型，将对象的原型设置为函数的 prototype 对象
- 让函数的this指向这个对象，执行构造函数（为这个新对象添加属性）
- 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象

```
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
```

输出：

```
将对象的原型设置为函数的 prototype 对象>>> Person {}
将 this 指向新建对象，并执行函数>>> Person { name: 'well' }
Person { name: 'well' }
```

