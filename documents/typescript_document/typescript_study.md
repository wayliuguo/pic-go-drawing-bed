## 1.搭建学习环境

1. 安装最新版typescript

   ```
   npm i -g typescript
   ```

2. 安装ts-node

   ```
   npm i -g ts-node
   ```

3. 创建一个 tsconfig.json 文件

   ```
   tsc --init
   ```

## 2.官方playground

https://www.typescriptlang.org/zh/play?#code/Q

## 3.基础数据类型

### 3.1 JS 的八种内置类型

```
let str: string = 'liuguwoei'
let num: number = 18
let boool: boolean = false
let u: undefined = undefined
let n: null = null
let obj: object = {x: 1}
let big: bigint = 100n // tsconfig.json target 需配置到不低于es2020
let sym: symbol = Symbol('me')
```

### 3.2 注意点

#### 3.2.1 null 和 undefined

- null 和 undefined 是所有类型的子类型，可以把null 和 undefined 赋值给其他类型

- 但是需要把 tsconfig.json 中 strictNullChecks: false

  ```
  // null 和 undefined 注意点
  let nameString: string = 'well'
  nameString = null
  nameString = undefined
  ```

#### 3.2.2 null 和 bigint

```
// null 和 bigint 都表示数字，但是这两个类型不兼容
let bigInt: bigint =  100n;
let numNum: number = 6;
// bigInt = numNum;
```

## 4.其他类型

### 4.1 Array

1. 对数组类型定义的两种方式

   **必须定义至少一个类型参数，如 Number，string**

   ```
   let arrNum:Array<number> = [1,2,3]
   let arrStr:string[] = ['well', 'liu', 'guowei']
   ```

2. 定义联合类型数组

   **通过 | **

   ```
   // 定义联合类型数组
   let arr:(number | string | {})[]
   arr = [1, 'well', {}]
   ```

3. 定义知道对象成员的数组

   ```
   // 定义指定对象成员的数组
   interface arrObj {
       name: string,
       age: number
   }
   
   let arrObj:arrObj[] = [
       {
           name: 'well',
           age: 22
       }
   ]
   ```


### 4.2 函数

1. 函数声明

   ```
   // 函数声明
   function sum(x: number, y: number): number {
       return x + y
   }
   ```

2. 函数表达式

   ```
   // 完整表达式
   const mySum: (x: number, y: number) => number =  (x: number, y: number): number => x + y
   // 省略左边
   const mySum1 = (x: number, y: number) => x + y
   // 省略右边
   const mySum2: (x: number, y: number) => number = (x, y) => x + y
   ```

3. 接口定义函数类型

   ```
   // 接口定义函数类型
   interface myName {
       (firstName: string, lastName: string): string
   }
   const myNameFn: myName = (firstName: string, lastName: string) => firstName + lastName
   console.log(myNameFn('liu', 'guowei'))
   ```

4. 可选参数

   注意点： 可选参数后面不允许再出现必须参数

   ```
   function buildName(firstName: string, lastName?: string) {
       if (lastName) {
           return firstName + ' ' + lastName
       } else {
           return firstName
       }
   }
   console.log(buildName('well'))
   ```

5. 参数默认值

   ```
   function buildSpecialName(firstName: string, lastName: string = 'liu'): string {
       return firstName + ' ' + lastName
   }
   ```

6. 剩余参数

   ```
   function push(array: any[], ...items: any[]) {
       items.forEach(item => array.push(item))
       console.log(array)
   }
   console.log(push([], 1,2,3)) // [1,2,3]
   ```

7. 函数重载

   ```
   // 函数重载
   type Types = number | string
   function add(a:number,b:number):number;
   function add(a: string, b: string): string;
   function add(a: string, b: number): string;
   function add(a: number, b: string): string;
   function add(a:Types, b:Types) {
     if (typeof a === 'string' || typeof b === 'string') {
       return a.toString() + b.toString();
     }
     return a + b;
   }
   const result1 = add('Semlinker', ' Kakuqo');
   const result2 = add(1, 2);
   console.log(result1) // Semlinker Kakuqo
   console.log(result2) // 3
   ```


### 4.3 元组

1. 元组定义

   众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组。在 JavaScript 中是没有元组的，元组是 TypeScript 中特有的类型，其工作方式类似于数组。

   元组最重要的特性是可以限制**数组元素的个数和类型**，它特别适合用来实现多值返回。

   ```
   let x: [string, number]
   x = ['hello', 10]
   // x = ['hello', 10, 10]
   // x = [10, 'hello']
   ```

2. 元组类型的解构赋值

   ```
   let employee: [number, string] = [1, 'student']
   let [id, username] = employee
   console.log(id, username) // 1 student
   ```

3. 元组类型的可选元素

   ```
   let optionalTuple: [string, boolean?]
   optionalTuple = ['well', true]
   console.log(optionalTuple) // [ 'well', true ]
   optionalTuple = ['well']
   console.log(optionalTuple) // [ 'well' ]
   ```

4. 元组类型的剩余参数

   自己尝试未见生效

   ```
   type RestTupleType = [number, ...string[]]
   let restTuple: RestTupleType = [666, "Semlinker", "Kakuqo", "Lolo"]
   console.log(restTuple[0]) // 666
   console.log(restTuple[1]) // Semlinker
   ```

5. 只读的元组类型

```
const point: readonly [number, number] = [10, 10]
// point[0] = 1 error
```

### 4.4 void

- `void`表示没有任何类型，和其他类型是平等关系
- 如果tsconfig.json 中 strictNullChecks 为 false，则可以赋值 null 和 undefined

```
let a: void
a = null
a = undefined
```

### 4.5 never

`never`类型表示的是那些永不存在的值的类型。

```
let ne: never
let nev: never
let an: any

ne = nev
// ne = an // error
```

### 4.6 any

任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的顶级类型

```
let param: any
param = 1
param = '123'

```

### 4.7 unknown

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

### 4.8 注意点

原始类型与包装类型

```
// 原始类型和包装类型
// 原始类型如： number、string、boolean、symbol
// 包装类如： Number、String、Boolean、Symbol
// 不要使用对象类型来注解值的类型，因为这没有任何意义
let numA: number = 1
let numB: Number = 2
numB = numA
// numA = numB // error
```
