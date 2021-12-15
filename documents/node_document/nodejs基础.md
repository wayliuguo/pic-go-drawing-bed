## 1.Commonjs

### 1.1 module 对象

```
console.log(module)

/* Module {
    id: '.',
    exports: {},
    parent: null,
    filename: 'D:\\liuguowei\\node_basic\\commonjs.js',
    loaded: false,
    children: [],
    paths:
     [ 'D:\\liuguowei\\node_basic\\node_modules',      
       'D:\\liuguowei\\node_modules',
       'D:\\node_modules' ]} */
```

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
- `module.filename` 模块的文件名，带有绝对路径。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 表示模块对外输出的值。

### 1.2 module.exports与exports

- Node为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令。

```
var exports = module.exports;
```

**module.exports**

```
// commonjs.js
module.exports.area = function (r) {
    return Math.PI * r * r;
};
module.exports.circumference = function (r) {
    return 2 * Math.PI * r;
};
// app.js
const common = require('./commonjs')
console.log(common) // { area: [Function], circumference: [Function] }
```

**exports**

```
// commonjs.js
exports.area = function (r) {
    return Math.PI * r * r;
};
exports.circumference = function (r) {
    return 2 * Math.PI * r;
};
// app.js
const common = require('./commonjs')
console.log(common) // { area: [Function], circumference: [Function] }
```

**不同**

```
// app.js
const common = require('./commonjs')
console.log(common(2))

// commonjs.js(module.exports) 
module.exports = function(r) {
    return Math.PI * r * r;
}
// commonjs.js(exports) 
exports = function(r) {
    return Math.PI * r * r;
}
```

- 如果一个模块的对外接口就是一个单一的值，不能使用exports输出，只能使用module.exports输出。
- exports输出对外接口输入单一值，接收的变量是一个空对象{}

```
const common = require('./commonjs')
console.log(common) // {} // exports输出
```



## 2.JavaScript执行机制

## 3.事件触发器

```
eventEmitter.on('start', (...args) => {
    console.log('开始了', args) // 开始了 [ 1, 2, 3, 4, 5, 6 ]
})
// 触发事件
eventEmitter.emit('start', 1,2,3,4,5,6)
```

- `once()`: 添加单次监听器。
- `removeListener()` / `off()`: 从事件中移除事件监听器。
- `removeAllListeners()`: 移除事件的所有监听器。

## 4.搭建 HTTP 服务器

```
const http = require('http')
const port = 3000
const server = http.createServer((req,res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('hello world')
})

server.listen(port, () => {
    console.log(`服务器运行在${port}端口`)
})
```

## 5. 文件属性

- 每个文件都带有一组详细信息，可以使用 Node.js 进行检查。
- 具体地说，使用 `fs 模块提供的 `stat()` 方法。
  - 使用 `stats.isFile()` 和 `stats.isDirectory()` 判断文件是否目录或文件。
  - 使用 `stats.isSymbolicLink()` 判断文件是否符号链接。
  - 使用 `stats.size` 获取文件的大小（以字节为单位）。

```
const fs = require('fs')

fs.stat('./index.txt', (err, stats) => {
    if(err) {
        console.log(err)
        return
    }
    console.log(stats.isFile())
    console.log(stats.isDirectory())
    console.log(stats.isSymbolicLink())
    console.log(stats.size)
})
```

## 6.文件路径

### 6.1 获取当前路径的三种方法

- __dirname：返回运行文件所在的目录
- resolve('./')：当前命令所在的目录
- process.cwd()：当前命令所在的目录

```
const { resolve } = require('path')

console.log('__dirname:', __dirname) // __dirname: D:\liuguowei\node_basic  
console.log('resolve:',resolve('./')) // resolve: D:\liuguowei\node_basic
console.log('cwd:', process.cwd()) // cwd: D:\liuguowei\node_basic
```

### 6.2 从路径获取信息

