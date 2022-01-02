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

### 2.1 同步任务-异步任务

![redux原理图](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/同步异步任务.png)

- 同步进入主线程，异步进入Event Table并注册函数
- 当指定的事情完成时，Event Table会将这个函数移入任务队列(Event Queue)
- 主线程内的任务执行完毕为空，就去任务队列（Event Queue）读取对应的函数，进入主线程执行

### 2.2 宏任务-微任务

![redux原理图](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/宏任务微任务.png)

- 所有的同步任务都在主线程上执行，行成一个执行栈。
- 除了主线程之外，还存在一个任务列队，只要异步任务有了运行结果，就在任务列队中植入一个时间标记。
- 主线程完成所有任务(执行栈清空），就会读取任务列队，先执行微任务队列在执行宏任务队列。
- 重复上面三步。

### 2.3 代码

```
console.log("同步任务1");

function asyn(mac) {
    console.log("同步任务2");
    if (mac) {
        console.log(mac);

    }
    return new Promise((resolve, reject) => {
        console.log("Promise中的同步任务");
        resolve("Promise中回调的异步微任务")
    })
}
setTimeout(() => {
    console.log("异步任务中的宏任务");
    setTimeout(() => {
        console.log("定时器中的定时器（宏任务）");

    }, 0)
    asyn("定时器传递任务").then(res => {
        console.log('定时器中的:', res);
    })
}, 0)
asyn().then(res => {
    console.log(res);
})
console.log("同步任务3")
```

- 同步任务1
- 同步任务2
- Promise中的同步任务
- 同步任务3
- Promise中回调的异步微任务
- 异步任务中的宏任务
- 同步任务2
- 定时器传递任务
- Promise中的同步任务
- 定时器中的: Promise中回调的异步微任务
- 定时器中的定时器（宏任务）

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
  - `root`: 根路径。
  - `dir`: 从根路径开始的文件夹路径。
  - `base`: 文件名 + 扩展名
  - `name`: 文件名
  - `ext`: 文件扩展名

```
const obj = require('path').parse('/users/test.txt')
console.log(obj)

/* 
{ root: '/',       
  dir: '/users',   
  base: 'test.txt',
  ext: '.txt',     
  name: 'test' } 
*/
```

## 7. 系统模块

```
//arch: 返回标识底层架构的字符串
const os = require('os')
console.log(os.arch()) // x64

// cpus: 系统上cpu可用信息
console.log(os.cpus())

// 返回代表系统中可用内存的字节数
console.log(os.freemem()) //9648234496

// 返回到当前用户的主目录的路径
console.log(os.homedir()) // C:\Users\QSKJ

// 返回主机名
console.log(os.hostname()) // DESKTOP-PGMK1AK

// 返回操作系统对平均负载的计算
console.log(os.loadavg()) // [ 0, 0, 0 ]

// 返回系统上可用的网络接口的详细信息
console.log(os.networkInterfaces())

// 返回为 Node.js 编译的平台
console.log(os.platform()) // win32

// 返回标识操作系统版本号的字符串
console.log(os.release()) // 10.0.19043

// 返回指定的临时文件夹的路径
console.log(os.tmpdir()) // C:\Users\QSKJ\AppData\Local\Temp

// 返回表示系统中可用的总内存的字节数
console.log(os.totalmem()) // 17087356928

// 标识操作系统
console.log(os.type()) // Windows_NT

// 返回自上次重新启动以来计算机持续运行的秒数
console.log(os.uptime()) // 599158

// 返回包含当前 username、uid、gid、shell 和 homedir 的对象
console.log(os.userInfo())
/* 
{ uid: -1,
  gid: -1,
  username: 'QSKJ',
  homedir: 'C:\\Users\\QSKJ',
  shell: null }
*/
```

## 8. 事件模块

```
const EventEmitter = require('events')
const door = new EventEmitter()

const doSomething = () => {
    console.log('doSomething')
}
// 监听事件（addListener（）别名）
door.on('open', doSomething) 

// 在当前 EventEmitter 对象上注册的事件）数组
console.log(door.eventNames()) // [ 'open' ]
// 获取可以添加到 EventEmitter 对象的监听器的最大数量（默认为 10，但可以使用 setMaxListeners() 进行增加或减少）
console.log(door.getMaxListeners()) // 10
// 作为参数传入的事件监听器的数组
console.log(door.listenerCount('open')) // 1
// 触发事件
door.emit('open') // doSomething
// 移除事件（removeListener()的别名）
door.removeListener('open', doSomething)
```

## 9.http模块

### 9.1 属性

```
const http = require('http')

console.log(http.METHODS)
/**
 * 此属性列出了所有支持的HTTP方法
 * [ 'ACL',     
  'BIND',    
  'CHECKOUT',
  'CONNECT', 
  'COPY',    
  'DELETE',  
  'GET',     
  'HEAD',    
  'LINK',    
  'LOCK',    
  'M-SEARCH',
  'MERGE',   
  'MKACTIVITY',
  'MKCALENDAR',
  'MKCOL',
  'MOVE',
  'NOTIFY',
  'OPTIONS',
  'PATCH',
  'POST',
  'PROPFIND',
  'PROPPATCH',
  'PURGE',
  'PUT',
  'REBIND',
  'REPORT',
  'SEARCH',
  'SOURCE',
  'SUBSCRIBE',
  'TRACE',
  'UNBIND',
  'UNLINK',
  'UNLOCK',
  'UNSUBSCRIBE' ]
 */

console.log(http.STATUS_CODES)
/**
 * 此属性列出了所有的 HTTP 状态代码及其描述
 * { '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '103': 'Early Hints',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '208': 'Already Reported',
  '226': 'IM Used',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a Teapot',
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Unordered Collection',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended',
  '511': 'Network Authentication Required' }
 */
```

### 9.2 方法

- http.createServer()  返回 `http.Server` 类的新实例。
- http.request() 发送 HTTP 请求到服务器，并创建 `http.ClientRequest` 类的实例。
- http.get() 类似于 `http.request()`，但会自动地设置 HTTP 方法为 GET，并自动地调用 `req.end()`。

### 9.3 类

- http.Agent
- http.ClientRequest
- http.Server
- http.ServerResponse
- http.IncomingMessage

## 10. Buffer

- Buffer 是内存区域
- 它表示在 V8 JavaScript 引擎外部分配的固定大小的内存块（无法调整大小）。
- 可以将 buffer 视为整数数组，每个整数代表一个数据字节。

### 10.1 为什么需要 buffer？

- Buffer 被引进用以帮助开发者处理二进制数据
- Buffer 与流紧密相连。 当流处理器接收数据的速度快于其消化的速度时，则会将数据放入 buffer 中

### 10.2 如何创建 buffer

- Buffer.from()
- Buffer.alloc()
- Buffer.allocUnsafe()

```
const buf = Buffer.from('Hey!')
console.log(buf) // <Buffer 48 65 79 21>

const buf1 = Buffer.alloc(1024)
console.log(buf1)
const buf2 = Buffer.allocUnsafe(1024)
console.log(buf2)
const buf = Buffer.from('Hey!')
console.log(buf) // <Buffer 48 65 79 21>

const buf1 = Buffer.alloc(1024)
const buf2 = Buffer.allocUnsafe(1024)
console.log(buf2)
/**
 * buf1 和 buf2一样
 * <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 974 more bytes>       
 */
```

- alloc 和 `allocUnsafe` 均分配指定大小的 `Buffer`（以字节为单位）
- `alloc` 创建的 `Buffer` 会被使用零进行初始化，而 `allocUnsafe` 创建的 `Buffer` 不会被初始化

### 10.3 使用 buffer

#### 10.3.1 访问 buffer 的内容

```
const buf = Buffer.from('Hey!')
console.log(buf[0]) //72
console.log(buf[1]) //101
console.log(buf[2]) //121
console.log(buf.toString()) // Hey!
```

#### 10.3.2 获取 buffer 的长度

```
const buf = Buffer.from('Hey!')
console.log(buf.length) // 4

for(const item of buf) {
    console.log(item) // 74 101 121 33
}
```

#### 10.3.3 更改 buffer 的内容

```
const buf = Buffer.alloc(4)
buf.write('Hey!')
console.log(buf) // <Buffer 48 65 79 21>

const buf2 = Buffer.from('Hey!')
buf2[1] = 111 // 0
console.log(buf2.toString()) // Hoy!
```

#### 10.3.4 复制 buffer

```
const buf = Buffer.from('Hey!')
let bufcopy = Buffer.alloc(4) //分配 4 个字节。
buf.copy(bufcopy)
console.log(buf) // <Buffer 48 65 79 21>

const buf2 = Buffer.from('Hey!')
let bufcopy2 = Buffer.alloc(2) // 分配2个字节
buf2.copy(bufcopy2,0,0,2)
console.log(bufcopy2.toString()) // He
```

- buffer.copy(target, startIndex, endIndex, length)

#### 10.3.4 切片 buffer

切片不是副本：原始 buffer 仍然是真正的来源。 如果那改变了，则切片也会改变。

```
const buf = Buffer.from('Hey!')
buf.slice(0).toString() //Hey!
const slice = buf.slice(0, 2)
console.log(slice.toString()) //He
buf[1] = 111 //o
console.log(slice.toString()) //Ho
```

## 11. 流

- 是一种以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换
- 在传统的方式中，当告诉程序读取文件时，这会将文件从头到尾读入内存，然后进行处理
- 使用流，则可以逐个片段地读取并处理（而无需全部保存在内存中）

### 11.1 为什么是流

- 内存效率：无需加载大量的数据到内存中即可进行处理
- 时间效率：当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始

### 11.2 流的例子

```
const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) {
    fs.readFile(__dirname + '/data.txt', (err, data) => {
        res.end(data)
    })
})
server.listen(3000)
```

```
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const stream = fs.createReadStream(__dirname + '/data.txt')
  stream.pipe(res)
})
server.listen(3000)
```

### 11.3 pipe()

- 作用：获取来源流，并将其通过管道传输到目标流
- 返回值：目标流，可链式调用

```
src.pipe(dest1).pipe(dest2)
```

### 11.4 流驱动的 API

- `process.stdin` 返回连接到 stdin 的流。
- `process.stdout` 返回连接到 stdout 的流。
- `process.stderr` 返回连接到 stderr 的流。
- `fs.createReadStream()` 创建文件的可读流。
- `fs.createWriteStream()` 创建到文件的可写流。
- `net.connect()` 启动基于流的连接。
- `http.request()` 返回 http.ClientRequest 类的实例，该实例是可写流。
- `zlib.createGzip()` 使用 gzip（压缩算法）将数据压缩到流中。
- `zlib.createGunzip()` 解压缩 gzip 流。
- `zlib.createDeflate()` 使用 deflate（压缩算法）将数据压缩到流中。
- `zlib.createInflate()` 解压缩 deflate 流。

### 11.4 不同类型的流

- `Readable`: 可以通过管道读取、但不能通过管道写入的流（可以接收数据，但不能向其发送数据）。 当推送数据到可读流中时，会对其进行缓冲，直到使用者开始读取数据为止。
- `Writable`: 可以通过管道写入、但不能通过管道读取的流（可以发送数据，但不能从中接收数据）。
- `Duplex`: 可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合。
- `Transform`: 类似于双工流、但其输出是其输入的转换的转换流。

### 11.5 如何创建可读流

