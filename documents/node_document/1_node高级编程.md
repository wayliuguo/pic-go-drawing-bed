## 1. nodejs 架构

![image-20220103235646550](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220103235646550.png)

### 1.1 Natives modules

- 当前层内容由 JS 实现
- 提供应用程序可直接调用库，例如fs、path、http
- js 语言无法直接操作底层硬件设置

### 1.2 Builtin modules "胶水层"

- 充当桥梁使node核心模块获取技术支持完成更底层操作
- 在图中即 Node C/C++ Bindings

### 1.3 底层

- V8: 执行 JS 代码，提供桥梁接口
- Libuv: 事件循环、事件队列、异步IO
- 第三方模块：zlib、http、c-ares等

## 2. nodejs 异步IO

### 2.1 同步与异步

![image-20220104001922090](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220104001922090.png)

### 2.2 阻塞IO 与非阻塞IO

- 阻塞IO

  - 轮询：重复调用IO操作，判断IO是否结束
  - read、select、poll、kqueue、event port

- 非阻塞IO

  - 期望实现无需主动判断的非阻塞IO
  - nodejs 非阻塞IO由libuv实现

  ![image-20220104002443522](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220104002443522.png)

- node 实现异步IO

![image-20220104002606752](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220104002606752.png)

### 2.3 总结

- IO 是应用程序的瓶颈所在
- 异步IO提高性能无需原地等待结果返回
- IO操作属于操作系统级别，平台都有对应实现
- nodejs 单线程配合事件循环架构及libuv实现了异步

## 3. 事件驱动架构

![image-20220104002606752](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220104002606752.png)

```
const EventEmitter = require('events')

const myEvent = new EventEmitter()

myEvent.on('event1', () => {
    console.log('event1执行了')
})

myEvent.emit('event1')
```

## 4. nodejs 单线程

- 单线程如何实现高并发？
  - 异步非阻塞IO配合事件回调通知
  - 单线程：nodejs 主线程是单线程
- 劣势
  - cpu密集型过多占用cpu，无法体现多核cpu优势
  - 解决方案：class集群

```
const http = require('http')

function sleepTime(time) {
    const sleep = Date.now() + time * 1000
    while(Date.now() < sleep) {}
    return
}
sleepTime(4)
const server = http.createServer((req, res) => {
    res.end('server start...')
})

server.listen(8080, () => {
    console.log('服务启动了') // 在4秒后打印
})
```

## 5. 应用场景

- IO 密集型高并发请求

  - 作为中间层

  ![image-20220104005826664](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220104005826664.png)

  - 操作数据库提供API服务
  - 实时聊天应用程序

- 更加适合IO密集型高并发请求

- 前端工程化

## 6. 实现API服务

- 安装typescript

```
npm i typescript -g
```

- 初始化typescript配置文件

```
tsc --init

// tsconfig.json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5", /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs", /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
    /* Strict Type-Checking Options */
    "strict": true, /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */
    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true, /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */
    "resolveJsonModule": true,
    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */
    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    /* Advanced Options */
    "skipLibCheck": true, /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  }
}
```

- 安装ts-node

  - 作用：无需转换为js，可直接运行ts

  ```
  npm i ts-node -g
  ```

  [ts-node的坑]: https://zhuanlan.zhihu.com/p/270592378

  - ts-node ***.ts

- express安装、es模块导入express

  ```
  npm i express -S
  npm i @types/express -D
  ```

- ts 导入 json
  - 修改tsconfig.json里的 resolveJsonModule

## 7. 全局对象

- Global 的根本作用就是作为属主
- 全局对象可以看作是全局变量的属主

### 7.1 常见全局变量

- __filename: 返回正在执行脚本文件的绝对路径
- __dirname: 返回正在执行脚本所在目录
- timer类函数： 执行顺序与事件循环间的关系
- process： 提供与当前进程互动的接口
- require：实现模块的加载
- module、exports：处理模块的导出

```
console.log(global)
```

![image-20220105000436567](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220105000436567.png)

```
console.log(__filename) // D:\学习资料\学习笔记\node_study\1_node高级编程\7_全局对象\node_grobal.js
console.log(__dirname) // D:\学习资料\学习笔记\node_study\1_node高级编程\7_全局对象

console.log(this) // {}
// 默认情况 this 是空对象，和global 并不是一样的
console.log(this == global) // false
```

### 7.2 全局变量 process

- 获取进程信息
- 执行进程操作

```
// 1.资源信息： cpu  内存
console.log(process.memoryUsage())
/**
 * {
  rss: 19582976,     
  heapTotal: 4481024,
  heapUsed: 2856584,
  external: 938610,  
  arrayBuffers: 9898 
}
 */

console.log(process.cpuUsage()) // { user: 78000, system: 15000 }

// 2.运行环境: 运行目录、node环境、cpu架构、用户环境、系统平台
console.log(process.cwd()) // D:\学习资料\学习笔记\node_study\1_node高级编程\7_全局对象
console.log(process.version)  // v14.8.2
console.log(process.versions)
/**
 * {
  node: '14.18.2',
  v8: '8.4.371.23-node.85',
  uv: '1.42.0',
  zlib: '1.2.11',
  brotli: '1.0.9',
  ares: '1.18.1',
  modules: '83',
  nghttp2: '1.42.0',
  napi: '8',
  llhttp: '2.1.4',
  openssl: '1.1.1l',
  cldr: '39.0',
  icu: '69.1',
  tz: '2021a',
  unicode: '13.0'
}
 */

console.log(process.arch) // x64
console.log(process.env.NODE_ENV) // 环境参数
console.log(process.env.path) // 环境变量
console.log(process.env.USERPROFILE) // C:\Users\way liu 管理员目录
console.log(process.platform) // win32 平台

// 3.运行状态： 启动参数、运行时间
console.log(process.argv)
/**
 * 默认存在两项参数
 * [
    'C:\\Program Files\\nodejs\\node.exe',
    'D:\\学习资料\\学习笔记\\node_study\\1_node高级编程\\7_全局对象\\process.js'
    ]
 */
console.log(process.uptime()) // 0.1322332 运行时间

//4.事件
process.on('ext', (code) => {
    console.log('exit' + code)
}) 
process.on('beforeExit', (code) => {
    console.log('before exit' + code)
})
console.log('代码执行完了')
/**
 * 代码执行完了
 * before exit0
 */
 
// 手动退出
process.exit()
```

- 资源信息
- 运行环境
- 运行状态
- 事件

## 8. 核心模块-path

- path.basename():获取路径中的基础名称
- path.dirname(): 获取路径目录名（路径）
- path.extname(): 获取路径的扩展名

```
const path = require('path')

// 1. 获取路径中的基础名称
/**
 * 返回的是接收路径的最后一部分：可能是文件或目录
 * 第二个参数标识扩展名，如果没有设置或者没有匹配上则返回完整的文件名称带后缀
 * 处理目录路径如果结尾处有路径分隔符，则会被忽略
 */

console.log(path.basename(__filename)) // path.js
console.log(path.basename(__filename, '.js'))
console.log(path.basename(__filename, '.css')) // path
console.log(path.basename('/a/b/c')) // c
console.log(path.basename('/a/b/c/')) // c


// 2. 获取路径目录名（路径）
/**
 * 返回路径中最后一个部分的上一次目录所在路径
 */
console.log(path.dirname(__filename)) // D:\学习资料\学习笔记\node_study\1_node高级编程\8_path模块
console.log(path.dirname('/a/b/c')) // /a/b
console.log(path.dirname('/a/b/c/')) // /a/b

// 3. 获取路径的扩展名
/**
 * 返回相应文件名最后一个 . 后面的部分（后缀）
 * 
 */
console.log(path.extname(__filename)) // .js
console.log(path.extname('/a/b/index.html.css')) // .css
console.log(path.extname('/a/b/index.css.')) // .
```

