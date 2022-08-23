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

## 3. instanceof

1. 首先获取类型的原型
2. 然后获得对象的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`

```
function myInstanceof (left, right) {
    let proto = Object.getPrototypeOf(left)
    let constructor = right.prototype
    while (true) {
        if (!proto) return false
        if (proto === constructor) return true
        proto = Object.getPrototypeOf(proto)
    }
}

console.log([] instanceof Array) // true
console.log(2 instanceof Number) // fasle
console.log(myInstanceof([], Array)) // true
console.log(myInstanceof(2, Number)) // true
```

## 4. debounce

函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求。

```
function debounce (fn, wait) {
	let timer = null
	return function () {
		let context = this
		console.log('context>>>', context)
		args = arguments;
		console.log('args>>>', args)
		// 如果此时存在定时器的话，则取消之前的定时器重新记时
		if (timer) {
			clearTimeout(timer);
            timer = null;
		}
		// 设置定时器，使事件间隔指定事件后执行
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, wait);
	}
}
```

```
function debounceArrow (fn, wait) {
	let timer = null
	return (...args) => {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, wait)
	}
} 
```

## 5. throttle

函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件节流来降低事件调用的频率。

```
function throttle (fn, delay) {
	let curTime = new Date()
	return function () {
        const context = this
        const args = arguments
        let nowTime = Date.now()
		if (nowTime - curTime >= delay) {
			curTime = nowTime
			return fn.apply(context, args)
		}
	}
}
```

## 6.类型判断

主要是通过typeof 和 Object.prototype.toString.call()来判断，由于typeof null 也等于 'object',所以才做了多一步的处理

```
function getType (value) {
    // 如果是null则返回
    if (value === null) {
        return value + ''
    }
    // 如果是数组、对象
    if (typeof value === 'object') {
        // [object Array]
        let valueClass = Object.prototype.toString.call(value)
        let type = valueClass.split(' ')[1].split('')
        type.pop()
        // ['A', 'r', 'r', 'a', 'y']
        return type.join('').toLowerCase()
    } else {
        return typeof value
    }
}

console.log(getType([])) // array
console.log(getType(2)) // number
```

## 7.call

核心思想：把调用方法contex的属性去执行，并把得到的结果返回

```
Function.prototype.MyCall = function (context) {
    if (typeof this !== 'function') {
        throw new Error('error')
    }
    // 获取参数
    let args = [...arguments].slice(1)
    let result = null
    // 核心思想：把调用方法contex的属性去执行，并把得到的结果返回
    context.fn = this
    result = context.fn(args)
    delete context.fn
    return result
}

const Person = {
    name: 'well'
}
function sayName (age) {
    return `name:${this.name},age:${age}`
}
console.log(sayName.MyCall(Person, 18)) // name:well,age:18
```

