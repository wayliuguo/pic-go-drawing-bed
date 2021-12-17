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

## 5. 文件模块

### 5.1 文件属性

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

### 5.2 读取文件

- 同步： fs.readFile()
- 异步：fs.readFileSync()

```
// file/index.txt
123456789
// app.js
const path = require('path')
const fs = require('fs')

const file = path.resolve('file', 'index.txt')
fs.readFile(file, 'utf-8',(err, data) => {
    if(err) {
        console.log(err)
        return
    }
    console.log(data) // 123456789
})

try {
    const data = fs.readFileSync('./file/index.txt', 'utf-8')
    console.log(data) // 123456789
} catch (error) {
    console.log(error)
}
```

- `fs.readFile()` 和 `fs.readFileSync()` 都会在返回数据之前将文件的全部内容读取到内存中。
- 大文件会对内存的消耗和程序执行的速度产生重大的影响，更好使用流来读取文件的内容。

### 5.3 写入文件

- fs.writeFile(fileName, content, callBack): 异步
- fs.writeFileSync(filePath, content, {flag}): 同步
- 默认是覆盖掉之前的内容然后重新写入，可以通过指定标志来修改默认的行为
  - r+: 打开文件用来读写
  - w+:  打开文件用于读写，将流定位到文件的开头。如果文件不存在则创建文件
  - a:打开文件用于写入，将流定位到文件的末尾。如果文件不存在则创建文件。
  - a+: 打开文件用于读写，将流定位到文件的末尾。如果文件不存在则创建文件。
- 区分：
  - 只有a才会追加，其余的都会重写，w:不存在会创建文件
  - +：不只是读，而且写
  - 将内容追加到末尾的便捷方法：
    - fs.appendFile()
    - fs.appendFileSync()

```
const path = require('path')
const fs = require('fs')

const file = path.resolve('file', 'index.txt')
const content = '一些内容'
fs.writeFile(file, content, err => {
    if (err) {
        console.error(err)
        return
    }
    fs.readFile(file, 'utf-8', (err,data) => {
        if(err) {
            console.log(err)
            return
        }
        console.log(data) // 一些内容
    })
})
```

```
const path = require('path')
const fs = require('fs')

const file = path.resolve('file', 'index.txt')
const content = '一些内容'

try {
    const data = fs.writeFileSync(file, content)
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err) {
            console.error(err)
            return
        }
        console.log(data) // 一些内容
    })
} catch (error) {
    console.error(error) 
}
```

### 5.4 使用文件夹

- fs.access(): 检查文件夹是否存在与node.js是否具有访问权限
- fs.mkdir()、fs.mkdirSync(): 创建新的文件夹
- fs.readdir()、fs.readdirSync(): 读取目录的内容
- fs.rename、fs.renameSync():重命名文件夹
- fs.rmdir()、fs.rmdirSync()：删除文件夹
  - fs-extra模块
    - remove()

```
/* 
    创建文件夹
    注意：只能建一层，即如果要新建 __dirname/abc1/abc2 的文件夹,而abc1不存在则报错
*/
const fs = require('fs')
const folderName = __dirname + '/newFolder'
try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
} catch (err) {
    console.error(err)
}
```

```
/* 
    读取文件目录
*/
const fs = require('fs')
const path = require('path')

const folderPath = __dirname
console.log(fs.readdirSync(folderPath)) // [ 'app.js', 'commonjs.js', 'file', 'newFolder' ]
```

- 当前命令存在file、newFolder、app.js、commonjs.js文件夹与文件

```
/* 
    重命名文件夹
*/
const fs = require('fs')
const path = require('path')

const folderPath = path.join(__dirname, 'newFolder')
const renameFolder = path.join(__dirname, 'renameFolder')

fs.rename(folderPath, renameFolder, err => {
    if (err) {
        console.error(err)
        return
    }
})
```

```
// 删除文件夹
const fs = require('fs')
const path = require('path')

const folder = path.resolve('renameFolder')
fs.rmdir(folder, err => {
    if(err) {
        console.log(err)
    }
})
```

### 5.5 文件方法一览

- `fs.access()`: 检查文件是否存在，以及 Node.js 是否有权限访问。
- `fs.appendFile()`: 追加数据到文件。如果文件不存在，则创建文件。
- `fs.chmod()`: 更改文件（通过传入的文件名指定）的权限。相关方法：`fs.lchmod()`、`fs.fchmod()`。
- `fs.chown()`: 更改文件（通过传入的文件名指定）的所有者和群组。相关方法：`fs.fchown()`、`fs.lchown()`。
- `fs.close()`: 关闭文件描述符。
- `fs.copyFile()`: 拷贝文件。
- `fs.createReadStream()`: 创建可读的文件流。
- `fs.createWriteStream()`: 创建可写的文件流。
- `fs.link()`: 新建指向文件的硬链接。
- `fs.mkdir()`: 新建文件夹。
- `fs.mkdtemp()`: 创建临时目录。
- `fs.open()`: 设置文件模式。
- `fs.readdir()`: 读取目录的内容。
- `fs.readFile()`: 读取文件的内容。相关方法：`fs.read()`。
- `fs.readlink()`: 读取符号链接的值。
- `fs.realpath()`: 将相对的文件路径指针（`.`、`..`）解析为完整的路径。
- `fs.rename()`: 重命名文件或文件夹。
- `fs.rmdir()`: 删除文件夹。
- `fs.stat()`: 返回文件（通过传入的文件名指定）的状态。相关方法：`fs.fstat()`、`fs.lstat()`。
- `fs.symlink()`: 新建文件的符号链接。
- `fs.truncate()`: 将传递的文件名标识的文件截断为指定的长度。相关方法：`fs.ftruncate()`。
- `fs.unlink()`: 删除文件或符号链接。
- `fs.unwatchFile()`: 停止监视文件上的更改。
- `fs.utimes()`: 更改文件（通过传入的文件名指定）的时间戳。相关方法：`fs.futimes()`。
- `fs.watchFile()`: 开始监视文件上的更改。相关方法：`fs.watch()`。
- `fs.writeFile()`: 将数据写入文件。相关方法：`fs.write()`。

## 6.路径模块

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

- `dirname`: 获取文件的父文件夹。
- `basename`: 获取文件名部分。
- `extname`: 获取文件的扩展名。

```
const path = require('path')

const file = '/file/index.txt'
console.log(path.dirname(file)) // file
console.log(path.basename(file)) // index.txt
console.log(path.extname(file)) // .txt
```

### 6.3 使用路径

- path.join(): 连接路径的两个或多个片段
- path.resolve():  获得相对路径的绝对路径计算
- path.normalize:当包含诸如 `.`、`..` 或双斜杠之类的相对说明符时，其会尝试计算实际的路径：

```
const path = require('path')

const name = 'jerry'
console.log(path.join('/', 'users', name, 'index.txt')) // \users\jerry\index.txt

console.log(path.join(__dirname, 'file', 'index.txt')) // D:\liuguowei\node_basic\file\index.txt
console.log(path.resolve('file','index.txt')) // D:\liuguowei\node_basic\file\index.txt

console.log(path.normalize('/users/joe/..//text.txt')) // \users\text.txt
```

- path.isAbsolute(): 如果是绝对路径，返回true
- path.relative():接受 2 个路径作为参数。 基于当前工作目录，返回从第一个路径到第二个路径的相对路径。
- path.parse(): 解析对象的路径为组成其的片段
  - 
