# 一、基础篇

## 1.快速入门

### 1.代码初始化

```
// npm
npm install -g typescriptl/ yarm
yarn global add typescript//查看版本
tsc -v
```

### 2. ts-node

```
npm i -g ts-node
```

### 3.初始化配置文件

```
tsc --init
```

```
{
	"compileroptions": {"target" : "es5", //指定ECMAScript目标版本: 'ES5'
	"module" : "commonjs ", //指定使用模块: 'commonjs ', 'amd ' , 'system ', "umd ' or 'es2015'
	"moduleResolution" : "node" , //选择模块解析策略
	"experimentalDecorators" : true,//启用实验性的Es装饰器
	"allowSyntheticDefaultImports": true，//允许从没有设置默认导出的模块中默认导入
	"sourceMap" : true, //把ts文件编译成js 文件的时候，同时生成对应的 map 文件
	"strict" : true, //启用所有严格类型检查选项
	"noImplicitAny" : true, //在表达式和声明上有隐含的any类型时报错
	"alwaysstrict" : true, //以严格模式检查模块，并在每个文件里加入'use strict'
	"declaration" : true, //生成相应的.d.ts文件
	"removeComments" : true, //删除编译后的所有的注释
	"noImplicitReturns" : true, //不是函数的所有返回路径都有返回值时报错
	"importHelpers" : true, //从tslib 导入辅助工具函数
	"lib": [ "es6", "dom" ], //指定要包含在编译中的库文件
	"typeRoots": [ "node_modules/@types"],
	"outDir": "./dist",
	"rootDir": "./src"},
	"include": [ //需要编译的ts文件*表示文件匹配**表示忽略文件的深度问题
	"./src/**/*.ts"
	],
	"exclude" : [ //不需要编译的ts文件
	"node_modules",
	"dist",
	"**/*.test.ts" ,
}
```

## 2.数据类型

### 1.简单数据类型

在语法层面，缺省类型注解的TypeScript与JavaScript完全一致。

类型的注解主要通过类型后置语法来实现："**变量:类型**"

```
let num = 996
let num: number = 996
```

第一行为 隐式定义，第二行显示声明了类型，两行的代码都不能给num赋值为其他类型。

在JavaScript中，原始类型指的是**非对象且没有方法的数据类型，包括：**

- number
- boolean
- string
- null
- undefined
- symbol
- bigInt

他们对应的TypeScript 如下

| **JavaScript原始基础类型** | **typescript类型** |
| -------------------------- | ------------------ |
| number                     | number             |
| boolean                    | boolean            |
| string                     | string             |
| null                       | null               |
| undefined                  | undefined          |
| symbol                     | symbol             |
| bigInt                     | bigInt             |

#### 1.number

```
let num: number
num = 123
num = 0b1111011 // 二进制
num = 0o146 // 八进制
num = 0x7b // 十六进制
```

#### 2.string

```
// string
let str: string = 'hello world'
```

#### 3.boolean

```
let bol: boolean = false
```

#### 4.null 和 undefined

它们既是实际的值，也是类型。

undefined 和 null 是所有类型的子类型，如果“compilerOptions”里设置为"strictNullChecks": false 时，则可以把他们赋值给其他类型，否则不可以。

```
let u: undefined = undefined
let n: null = null
```

#### 5.bigInt

使用BigInt 可以安全地存储和操作大整数。

BigInt 需要 "target": "es2020"

```
/* const max = Number.MAX_SAFE_INTEGER
const max1 = max +1
const max2 = max +2
console.log(max1 === max2) // true */

const max = BigInt(Number.MAX_SAFE_INTEGER)
const max1 = max +1n
const max2 = max +2n
console.log(max1 === max2) // false
```

#### 6.symbol

##### 1.symbol 的基本使用

- 使用Symbol 构造函数生成
- 用来标表示独一无二的值

```
const s1= Symbol('TypeScript')
const s2 = Symbol('TypeScript')
console.log(typeof s1)
// console.log(s1 === s2) // 报错，此条件始终返回false
```

##### 2.symbol 作为属性名

```
let title = Symbol()
let obj = {
    [title]: 'TypeScript'
}
console.log(obj) // { [Symbol()]: 'TypeScript' }
console.log(obj[title]) // TypeScript
// console.log(obj.title) // 报错，不存在属性title
```

##### 3. symbol 属性名遍历

```
const myTitle = Symbol('TypeScript')
const myObj = {
    [myTitle]: 'TypeScript',
    age: 18
}
// for in 与 下面的方法都取不到
for (const key in myObj) {
    console.log(key) // age
}
console.log(Object.keys(myObj)) // [ 'age' ]
console.log(Object.getOwnPropertyNames(myObj)) // [ 'age' ]
console.log(JSON.stringify(myObj)) // {"age":18}
// 可以使用 Object.getOwnPropertySymbols
console.log(Object.getOwnPropertySymbols(myObj)) // [ Symbol(TypeScript) ] 
// Reflect.ownKeys 可以获取所有类型的属性名
console.log(Reflect.ownKeys(myObj)) // [ 'age', Symbol(TypeScript) ]
```

##### 4.symbol 静态方法

- Symbol.for()
  - 使用Symbol.for()方法传入字符串会先检查有没有使用该字符串调用Symbol.for 方法创建的symbol值
- Symbol.keyFor()
  - 该方法传入一个symbol值，返回该值在全局注册的键名

```
const tsSymbol = Symbol.for('TypeScript')
console.log(tsSymbol === Symbol.for('TypeScript')) // true
console.log(Symbol.keyFor(tsSymbol)) // TypeScript
```

### 2.复杂数据类型

#### 1.Array

##### 两种定义方式

- 直接定义(推荐): number[]
- 数组泛型：Array<number>

```
let list1: number[] = [1,2,3]
let list2: Array<number> = [1,2,3]
```

##### 定义联合类型数组

```
let list3: (number | string | object)[] = ['a', 1, {}]
```

#### 2.object

```
let obj2: object
obj2 = {
    name: 'TypeScript'
}
function getKeys (obj: object) {
    return Object.keys(obj)
}
getKeys({
    a: 'a'
})
// getKeys(123) // 运行会报错，Argument of type 'number' is not assignable to parameter of type 'object'
```

#### 3.元组

- 已知元素数量
- 已知元素类型
- 各个位置上 的元素类型也要对应

```
let arr: [string, number, boolean]
arr = ['a', 1, false]
// arr = [1, 'a', false] error
// arr = ['a', 2] error
```

新版本中，[string, number]元组类型的声明效果可以看作等同于下面声明

```
interface Tuple extends Array<number | string> {
    0: string;
    1: number;
    length: 2;
}
```

#### 4.枚举

- **作用：给一组数值赋予名字**

- **默认从0开始，后一个是前一个的+1**

```
enum Roles {
    SUPER_ADMIN,
    ADMIN,
    USER
}
console.log(Roles.SUPER_ADMIN) // 0
enum Roles1 {
    SUPER_ADMIN = 5,
    ADMIN=4,
    USER
}
console.log(Roles1.SUPER_ADMIN) // 5
console.log(Roles1.USER) // 5
```

#### 5.any

它是一个任意类型，定义为any类型的变量就会绕过TypeScript的静态类型检测。

```
let anyType: any = 1
anyType = false
```

#### 6.void

- 表示没有类型，就是什么类型也不是
- 在定义函数，并且函数不返回任何内容（实际上返回undefined）
- null 和 undefined 可以赋值给它

```
const consoleText = (text: string): void => {
    console.log(text)
}
let consoleVal = consoleText('123')
consoleVal = null // 需要关闭strictNullChecks
consoleVal = undefined
```

#### 7.never

- 指永远粗存在的类型
- 其值是**总会抛出异常或根本不会有返回值的函数表达式的返回值**

##### never 的特点

- never 是任何类型的子类型，可以赋值给任务类型
- 任何类型都不可以赋值给never 类型

```
const throwErrorFunc = () => { throw new Error()}
const add = (a:number,b:number):number => a + b
// let neverVal: never = add(1,2) // 不能将类型“number”分配给类型“never”
let neverVal: never = throwErrorFunc()
const myString = ''
// never 类型可以赋值给其他类型
const myInt: number = neverVal
// neverVal = myString // 其他类型不可以赋值给never类型
// 函数中的never
```

##### 函数中的never

TypeScript 使用 never 作为那些无法达到的终点的函数的返回值类型，主要有两种情况：

- 函数抛出异常
- 函数不会有返回值（无限循环）

```
const throwErrorFunc = () => { throw new Error()}

const output = () => {
    while(true) {
        console.log('循环')
    }
}
```

##### never 和 void 的区别？

- 类型赋值
  - void 类型值可以是 null、undefined
  - never 只能是never
- 函数中
  - void：没有返回任何内容（undefined）
  - never：抛出异常或者无限循环

#### 8.unknow

unknown 与 any 一样，所有类型的值都可以赋值给它

```
let notSure: unknown = 4
notSure = 'string'
notSure = [1, 2, 3]
```

any 类型可以赋值给任何类型，unknown 类型只能赋值给 unknown 和 any

```
let nameString = 'well'
// nameString = notSure // error
let notSureA: unknown = 2
notSure = notSureA
let anyA: any = 2
anyA = notSure
```

**作用：缩小类型范围**

```
let result: unknown
if (typeof result === 'number') {
    result.toFixed()
}
```



## 3.枚举类型

- 1.数字枚举
  - 从0开始递增
- 2.字符串枚举
- 3.反向枚举
  - 只支持数字枚举
- 4.异构枚举
  - 既有数字又有字符串
- 5.常量枚举

```
// 数字枚举
enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}
console.log(Day.SUNDAY) // 0

// 字符串枚举
enum message {
    Error = 'error',
    SUCCESS = 'success'
}

// 反向枚举(只支持数字枚举)
console.log(Day['MONDAY']) // 1
console.log(Day[1]) // MONDAY

// 异构枚举
enum Result {
    Faild = 0,
    Success = 'success'
}

// 常量枚举
const enum Animal {
    Dog,
    Cat
}
```

## 4.函数类型

### 1.函数类型定义

#### 直接定义

- 参数
- 返回值

```
function addFn (x: number, y: number):number {
    return x + y
}
const addFnArrow = (x: number, y: number): number => {
    return x + y
}
// 完整函数类型定义：指定参数、指定返回值
let addVal: (x: number, y: number) => number
addVal =  (x: number, y: number): number => x + y
```

- 如果省略参数类型，则默认参数 any 类型
- 如果省略返回值类型，如果没有返回内容，则未void，否则根据返回值推断出返回类型

#### 接口定义

```
interface AddInt {
    (x: number, y: number): number
}
let myAdd: AddInt = (x: number, y:number):number => x + y
```

#### 类型别名定义

```
type AddType = (x: number, y: number) => number
let myAddType = (x: number, y:number):number => x + y
```

### 2.函数参数定义

#### 可选参数

```
type AddMore = (x:number, y:number, z?:number) => number
let myAddMOre: AddMore = (x, y, z) => {
    if (z) {
        return x + y + z
    }
    return x + y
}
console.log(myAddMOre(1,2)) // 3
console.log(myAddMOre(1,2,3)) // 6
```

#### 默认参数

```
const AddDefault = (x: number, y: number = 2) => {
    return x + y
}
const AddDefaultMore = (x: number, y: number | string = 2) => {
    return `${x}${y}`
}
```

#### 剩余参数

```
const handleData = (x: number, ...args: number[]) => Array
const handleDataMore = (x: number, ...args: (number | string)[]) => Array
```

### 3.函数重载

```
const handleDatas = (x: string | number | null): any => {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number' ) {
        return String(x);
    }
    return -1;
}
console.log(handleDatas(996)) // "996"
console.log(handleDatas("996")) // 996
// handleData(false) // error
```

## 5.类类型

### 1.类的概念

#### 类的使用

```
// 1.类的使用
class Point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    getPosition():string {
        return `${this.x}${this.y}`
    }
}
const point = new Point(1,2)
point.getPosition()
```

es6之前，通过函数+原型链形式模拟实现

```
function Point(x, y){
	this.x = x;
	this.y = y;
}
Point. prototype.getPosition = function() {
	return(${this.x}，${this.y});
}
const point = new Point(1，2);
point.getPosition() // (1，2)

```

#### 类的继承

- super 函数会调用基类的构造函数
- 派生类如果包含一个构造函数constructor，则必须在构造函数中调用super方法

```
class A {
    name: string
    age: number
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
    getName () {
        return this.name
    }
}
class B extends A {
    job: string
    constructor(name: string, age: number) {
        super(name, age)
        this.job = 'IT'
    }
    getJob() {
        return this.job
    }
    getNameAndJob() {
        return super.getName() + this.job
    }
}
const b = new B('Tom', 20)
console.log(b.name) // Tom
console.log(b.age) // 20
console.log(b.getName()) // Tom
console.log(b.getJob()) // IT
console.log(b.getNameAndJob()) // TomIT
```

### 2.类的修饰符

#### 访问修饰符

- 定义在实例的属性和方法会在创建实例后添加到实例上
- 如果是定义在类里没有定义在this上的方法，实例可以继承
- 如果使用static 修饰符定义的属性和方法，则是静态的，实例不可以访问与继承

**TypeScript 中有三类访问修饰符**

- public(默认)：修饰的是任何地方可见、公有的属性或方法
- protected: 修饰的是仅在类自身及子类中可见、受保护的属性或方法 
- private：修饰的是仅在同一类中可见，私有的属性或方法

##### protected

```
class Parent {
    protected age: number
    constructor(age: number) {
        this.age = age
    }
    protected getAge() {
        return this.age
    }
}
const p = new Parent(18)
// console.log(p.age) // 属性“age”受保护，只能在类“Parent”及其子类中访问
// console.log(p.getAge()) // 属性“getAge”受保护，只能在类“Parent”及其子类中访问
// console.log(Parent.age) // 类型“typeof Parent”上不存在属性“age”
class Child extends Parent {
    constructor(age: number) {
        super(age)
        console.log(super.age) // undefined
        console.log(super.getAge()) // 18
    }
}
new Child(18)
```

##### private

```
class Parent1 {
    private age: number
    constructor(age: number) {
        this.age = age
    }
    private getAge() {
        return this.age
    }
}
const p1 = new Parent1(18)
// console.log(p1.age) // 属性“age”为私有属性，只能在类“Parent1”中访问
// console.log(p1.getAge()) // 属性“getAge”为私有属性，只能在类“Parent1”中访问
// console.log(Parent1.age) // 类型“typeof Parent1”上不存在属性“age”
class Child1 extends Parent1 {
    constructor(age: number) {
        super(age)
        // console.log(super.age) // 属性“age”为私有属性，只能在类“Parent1”中访问
        // console.log(super.getAge()) // 属性“getAge”为私有属性，只能在类“Parent1”中访问
    }
}
new Child1(18)
```

#### 只读修饰符

```
class UserInfo {
    readonly name: string
    constructor(name: string) {
        this.name = name
    }
}
const user = new UserInfo('TypeScript')
// user.name = 'haha' // 无法分配到 "name" ，因为它是只读属性
```

### 3.类的使用

#### 抽象类

```
abstract class People {
    constructor(public name: string) {}
    abstract printName(): void
}
class Man extends People {
    constructor(name: string) {
        super(name)
        this.name = name
    }

    printName(): void {
        console.log(this.name)   
    }
}
// const m = new Man() // 应有 1 个参数，但获得 0 个
const m = new Man('mike')
m.printName()
// const pike = new People('pike') // 无法创建抽象类的实例
```

- 定义了一个抽象类People，在抽象类里定义contructor方法必须传入一个字符串类型参数
- 使用**abstract**关键字定义的方法，在继承时必须自身实现。

## 6.接口类型

