### tsconfig.json

[tsconfig.json](https://www.tslang.cn/docs/handbook/compiler-options.html)

```
// 安装
npm install -g typescript
// 运行
tsc ×××.ts
```

- 在编译后如果没有tsconfig.json,则vscode会报相同声明的函数语法错误。

- const name: string 无法重新声明块范围变量“name”。ts(2451)

  - 原因：在默认状态下，typescript 将 DOM typings 作为全局的运行环境，所以当我们声明 name时， 与 DOM 中的全局 window 对象下的 name 属性出现了重名

  - 解决：

    - 在tsconfig.json 中声明

      ```
      {
          "compilerOptions": {
              "lib": [
                  "ES2015"
              ]
          }
      }
      ```

    - 在脚本文件最后一行，添加 `export {};`。将文件声明为模块， 变量`name`限制在了 模块作用域下，就不会与全局作用域下的`name`产生冲突。

### 基础类型

- boolean
- string
- Array
- Tuple
- enum
- Any
- Void
- Null
- Undefined
- never
- Object
- 断言

### 接口

```

```

- 接口类型检查
- 可选属性
- 只读属性
  - readonly
  - ReadonlyArray<T>
- 函数类型
- 可索引类型
- 类类型
- 接口继承接口
- 接口继承类
