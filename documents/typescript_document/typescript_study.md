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

   
