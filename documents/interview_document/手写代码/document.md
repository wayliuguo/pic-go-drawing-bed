# 一、JavaScript基础

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

核心思想：把调用方法作为contex的属性去执行，并把得到的结果返回

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

## 8.apply

核心思想：把调用方法作为contex的属性去执行，并把得到的结果返回。

```
Function.prototype.MyApply = function (context) {
    if (typeof this !== 'function') {
        throw new Error('error')
    }
    let result = null
    context.fn = this
    if (arguments[1]) {
        result = context.fn(arguments[1])
    } else {
        result = context.fn(...arguments[1])
    }
    delete context.fn
    return result
}

const Person = {
    name: 'well'
}
function sayName () {
    return this.name
}
console.log(sayName.MyApply(Person, ['well'])) // well
```

## 9.bind

bind 函数的实现步骤：

1. 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2. 保存当前函数的引用，获取其余传入参数值。
3. 创建一个函数返回
4. 函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象。

```
// bind 函数实现
Function.prototype.myBind = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  var args = [...arguments].slice(1),
      fn = this;
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};
```

## 10. 实现浅拷贝

浅拷贝是指，一个新的对象对原始对象的属性值进行精确地拷贝，如果拷贝的是基本数据类型，拷贝的就是基本数据类型的值，如果是引用数据类型，拷贝的就是内存地址。如果其中一个对象的引用内存地址发生改变，另一个对象也会发生变化。

- Object.assign()
- 扩展运算符
- 数组方法实现数组浅拷贝

### 10.1 Object.assign()

```
let target = {a: 1};
let object2 = {b: 2};
let object3 = {c: 3};
Object.assign(target,object2,object3);  
console.log(target);  // {a: 1, b: 2, c: 3}
```

### 10.2 扩展运算符

```
let obj4 = {a:1,b:{c:1}}
let obj5 = {...obj4} // { a: 1, b: { c: 1 } }
console.log(obj5)
```

### 10.3 数组方法实现数组浅拷贝
```
// Array.prototype.slice
let arr = [1,2,3,4];
console.log(arr.slice()); // [1,2,3,4]
console.log(arr.slice() === arr); //false

// Array.prototype.concat
let arr2 = [1,2,3,4];
console.log(arr2.concat()); // [1,2,3,4]
console.log(arr2.concat() === arr); //false
```

### 10.4 浅拷贝的实现

```
function shallowCopy(object) {
    // 只拷贝对象
    if (!object || typeof object !== 'object') return
    // 根据object 的类型判断新建的是数组还是对象
    let newObject = Array.isArray(object) ? [] : {}
    // 遍历object，判断是object的属性才拷贝
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            newObject[key] = object[key]
        }
    }
    return newObject
}
const myObject = [1,2,3,4,5]
const newShallowObject = shallowCopy(myObject)
console.log(newShallowObject) // [ 1, 2, 3, 4, 5 ]
```

## 11. 实现深拷贝

深拷贝相对浅拷贝而言，如果遇到属性值为引用类型的时候，它新建一个引用类型并将对应的值复制给它，因此对象获得的一个新的引用类型而不是一个原有类型的引用。深拷贝对于一些对象可以使用 JSON 的两个函数来实现，但是由于 JSON 的对象格式比 js 的对象格式更加严格，所以如果属性值里边出现函数或者 Symbol 类型的值时，会转换失败。

- JSON.stringify
- lodash的_.cloneDeep
- 手动实现深拷贝函数

```
const obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
}
// JSON.stringfy
const obj2 = JSON.parse(JSON.stringify(obj1))
obj2.b.e =2
console.log(obj1) // { a: 1, b: { f: { g: 1 } }, c: [ 1, 2, 3 ] }
console.log(obj2) // { a: 1, b: { f: { g: 1 }, e: 2 }, c: [ 1, 2, 3 ] }

// 深拷贝的实现
function deepCopy (object) {
    // 只拷贝对象
    if (!object || typeof object !== 'object') return
    // 根据object 的类型判断新建的是数组还是对象
    let newObject = Array.isArray(object) ? [] : {}
    // 遍历 object
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            newObject[key] = typeof object[key] === 'object' ? deepCopy(object[key]) : object[key]
        }
    }
    return newObject
}
const obj3 = deepCopy(obj1)
obj3.b.f.g = 5
console.log(obj1) // { a: 1, b: { f: { g: 1 } }, c: [ 1, 2, 3 ] }
console.log(obj3) // { a: 1, b: { f: { g: 5 } }, c: [ 1, 2, 3 ] }
```

## 12.实现 sleep 函数

```
function sleep (wait) {
    return new Promise(resolve => {
        setTimeout(resolve, wait)
    })
}
const curTime = Date.now()
sleep(3000).then(() => {
    console.log(Date.now() - curTime) // 3000
})
```

## 13. 实现 Object.assign

```
Object.myAssign = function (target, ...source) {
    if (target === null) {
        throw new TypeError('error')
    }
    let ret = Object(target)
    source.forEach(obj => {
        if (obj !== null) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ret[key] = obj[key]
                }
            }
        }
    })
    return ret
}

let target = {a: 1}
let object2 = {b: 2}
let object3 = {c: 3}
Object.myAssign(target,object2,object3)
console.log(target);  // {a: 1, b: 2, c: 3}
```

## 14.手写 Promise

# 二、数据处理

## 15.实现日期格式化函数

```
const dateFormat = function (dateInput, format) {
    const day = dateInput.getDate()
    const month = dateInput.getMonth() + 1
    const year = dateInput.getFullYear()
    format = format.replace(/yyyy/, year)
    format = format.replace(/MM/, month)
    format = format.replace(/dd/, day)
    return format
}

console.log(dateFormat(new Date('2020-12-01'), 'yyyy/MM/dd')) // 2020/12/01
console.log(dateFormat(new Date('2020-04-01'), 'yyyy/MM/dd')) // 2020/04/01
console.log(dateFormat(new Date('2020-04-01'), 'yyyy年MM月dd日')) // 2020年04月01日
```

## 16. 实现数组的乱序输出

```
const arr = [1,2,3,4,5,6,7,8,9,10]

let length = arr.length
let randomIndex
while (length) {
    randomIndex = Math.floor(Math.random() * length)
    length--
    [arr[length], arr[randomIndex]] = [arr[randomIndex], arr[length]]
}
console.log(arr)
```

## 17.实现数组元素的求和

```
let arr = [1,2,3,4,5,6,7,8,9,10]
// reduce
let sum = arr.reduce((total, i) => total += i, 0)
console.log(sum) // 5

// 递归
function add (arr) {
    if (arr.length === 1) return arr[0]
    return arr[0] + add(arr.slice(1)) 
}
console.log(add(arr)) // 5
```

## 18.数组扁平化

- 递归实现
- 迭代实现
- 扩展运算符实现
- split 和 toString
- ES6 flat

```
let arr = [1, [2, [3, 4, 5]]]
// 递归实现
function flatten (arr) {
    let result = []
    for (let i=0; i<arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result
}
console.log(flatten(arr)) // [ 1, 2, 3, 4, 5 ]

// 迭代实现
function flattenReduce (arr) {
    return arr.reduce((previousValue, currentValue) => {
        return previousValue.concat(Array.isArray(currentValue) ? flattenReduce(currentValue) : currentValue)
    }, [])
}
console.log(flattenReduce(arr)) // [ 1, 2, 3, 4, 5 ]

// 扩展运算符实现
function flattenExtension (arr) {
    while(arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}
console.log(flattenExtension(arr)) // [ 1, 2, 3, 4, 5 ]

// split 和 toString 
function flattenByString (arr) {
    return arr.toString().split(",")
}
console.log(flattenByString(arr)) // [ '1', '2', '3', '4', '5' ]

// ES6 flat
console.log(arr.flat(Infinity)) // [ 1, 2, 3, 4, 5 ]
```

## 19. 数组去重

- set
- map

```
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8]

// Array.from(new Set(arr))
console.log(Array.from(new Set(array))) // [ 1, 2, 3, 5, 9, 8 ]

// map
function uniqueArray (arr) {
    let map = new Map()
    let res = []
    for (let i=0; i<arr.length; i++) {
        if (!map.has(arr[i])) {
            map.set(arr[i], 1)
            res.push(arr[i])
        }
    }
    return res
}
console.log(uniqueArray(array)) // [ 1, 2, 3, 5, 9, 8 ]
```

## 20. flat 实现

```
function _flat (arr, depth) {
    if (!Array.isArray(arr) || depth <= 0) {
        return arr
    }
    return arr.reduce((previousVal, currentVal) => {
        if (Array.isArray(currentVal)) {
            return previousVal.concat(_flat(currentVal, depth - 1))
        } else {
            return previousVal.concat(currentVal)
        }
    }, [])
}

let arr = [1, [2, [3, 4, 5]]]
console.log(_flat(arr, 1)) // [ 1, 2, [ 3, 4, 5 ] ]
console.log(arr.flat(1)) // [ 1, 2, [ 3, 4, 5 ] ]
```

## 21. push 实现

```
Array.prototype.myPush = function (...args) {
    for (let i=0; i<args.length; i++) {
        this[this.length] = args[i]
    }
    return this.length
}
const arr = [1, 2, 3]
const ret = arr.push(4, 5, 6)
console.log(ret) // 6
console.log(arr) // [ 1, 2, 3, 4, 5, 6 ]
```

## 22. filter 实现

```
Array.prototype.myFilter = function (fn) {
    if (typeof fn !== 'function') {
        throw TypeError('参数必须是一个函数')
    }
    let res = []
    for (let i=0; i<this.length; i++) {
        fn(this[i]) && res.push(this[i])
    }
    return res
}

const arr = [1, 2, 3, 4, 5, 6]
console.log(arr.myFilter(item => item>3)) // [ 4, 5, 6 ]
```

## 23. map 实现

```
Array.prototype.myMap = function (fn) {
    if (typeof fn !== 'function') {
        throw TypeError('参数必须是一个函数')
    }
    const res = []
    for (let i=0; i<this.length; i++) {
        res.push(fn(this[i]))
    }
    return res
}

const arr = [1, 2, 3, 4, 5, 6]
console.log(arr.myMap(item => item * item)) // [ 1, 4, 9, 16, 25, 36 ]
```

## 24.repeat 实现

- 冒泡实现
- 迭代实现

```
function repeat(s, n) {
    if (n > 0) {
        return s + repeat(s, --n)
    } else {
        return ''
    }
}

function repeatReduce (s, n) {
    while (n > 1) {
        s += s
        n--
    }
    return s
}

console.log(repeat('abc', 2)) // abcabc
console.log(repeatReduce('abc', 2)) // abcabc
```

## 25.柯里化-参数长度不确定

```
// 参数长度不固定
function currying (fn) {
    let args = []
    return function temp (...newArgs) {
        if (newArgs.length) {
            args = [
                ...args,
                ...newArgs
            ]
            return temp
        } else {
            let val = fn.apply(this, args)
            args = [] //保证再次调用时清空
            return val
        }
    }
}

function add (...args) {
    //求和
    return args.reduce((a, b) => a + b)
}
function getSum (a,b,c) {
    return a+b+c
}
let addCurry = currying(add)
let getSumCurry = currying(getSum)
console.log(addCurry(1)(2)(3)(4, 5)())  //15
console.log(addCurry(1)(2)(3, 4, 5)())  //15
console.log(addCurry(1)(2, 3, 4, 5)())  //15

console.log(getSumCurry(1,2,3)()) // 6
console.log(getSumCurry(1)(2)(3)()) // 6
console.log(getSumCurry(1,2)(3)()) // 6
```



## 26.柯里化-参数长度确定

```
// 参数长度固定
function curry (func) {
    return function curriedFn(...args) { // 使用剩余参数接收实参
        //  如果实参小于形参，递归执行(func.length: 传入函数的参数长度)
        if (args.length < func.length) {
            return function () {
                // argument 是再次调用的实参，需转换为数组然后拼接之前转为参数
                return curriedFn(...[...args, ...arguments])
            }
        }
        // 如果实参等于形参直接执行
        return func(...args)
    }
}
```

## 27. 函数组合

```
function composeRight(...args) {
    return function(value) {
        let res = value
        for (let i=args.length-1; i>=0; i--) {
            res = args[i](res)
        }
        return res
    }
}
function composeRightReduce(...args) {
    return function(value) {
        // reduce:对数组中的每一个元素执行提供的函数，并汇总成单个结果
        return args.reverse().reduce(function(acc,fn) {
            return fn(acc)
        },value) // 把value作为acc的初始值
    }
}

const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()

const f = composeRight(toUpper,first,reverse)
const fReduce = composeRightReduce(toUpper,first,reverse)
console.log(f(['one','two','three'])) // THREE
console.log(fReduce(['one','two','three'])) // THREE
```

# 三、场景应用

## 28.红蓝绿循环打印

```
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}
// 回调函数实现
const task = (wait, light, callback) => {
    setTimeout(() => {
        switch (light) {
            case 'red':
                red()
                break
            case 'green':
                green()
                break
            case 'yellow':
                yellow()
                break
        }
        callback()
    }, wait)
}
const step = () => {
    task(3000, 'red', () => {
        task(2000, 'green', () => {
            task(1000, 'yellow', step)
        })
    })
}
// step()

// promise 实现
const taskPromise = (wait, light) => {
    return new Promise (resolve => {
        setTimeout(() => {
            switch (light) {
                case 'red':
                    red()
                    break
                case 'green':
                    green()
                    break
                case 'yellow':
                    yellow()
                    break
            }
            resolve()
        }, wait)
    })
}
const setpPromise = () => {
    taskPromise(3000, 'red')
        .then(() => {
            taskPromise(2000, 'green')
        })
        .then(() => {
            taskPromise(1000, 'yellow')
        })
        .then(() => {
            setpPromise()
        })
}
// setpPromise()

const stepRunner = async () => {
    await taskPromise(3000, 'red')
    await taskPromise(2000, 'green')
    await taskPromise(1000, 'yellow')
    stepRunner()
}
stepRunner()
```

