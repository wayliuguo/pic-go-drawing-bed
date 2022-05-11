## 1. 起步

### 1.1 Hello World

```
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('Server run at 3000')
})
```



### 1.2 路由基础

```
app.METHOD(PATH, HANDLER)
```

- app 是 Express 实例
- METHOD 是小写的 HTTP 请求方法
- PATH 是服务器上的路径
- HANDLER 是当路由匹配时执行的功能

```
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.post('/', (req, res) => {
    console.log(req)
    res.send('Hello World')
})
app.put('/user', (req, res) => {
    res.send('Hello World')
})
app.delete('/user', (req, res) => {
    res.send('Hello World')
})
app.listen(3000, () => {
    console.log('Server run at 3000')
})
```

### 1.3 请求对象

express 应用使用路由回调函数的参数：request 和 response 对象来处理请求和响应的数据。

express 不对 Node.js 已有的特性进行二次抽象，知识在它之上扩展了web应用所需的基本功能。

- 内部使用的还是 http 模块
- 请求对象继承自
  - http.InComingMessage 类
  - http://nodejs.cn/api/http.html#class-httpincomingmessage
  - ![image-20220303232215250](5_express.assets/image-20220303232215250.png)

- express req
  - http://expressjs.com/en/4x/api.html#req
  - ![image-20220306123719279](5_express.assets/image-20220306123719279.png)

### 1.4 响应对象

- 内部使用的还是 http 模块
- 请求对象继承自
  - http.ServerResponse 类
  - http://nodejs.cn/api/http.html#class-httpincomingmessage
    - [`'close'` 事件](http://nodejs.cn/api/http.html#event-close_1)
    - [`'finish'` 事件](http://nodejs.cn/api/http.html#event-finish)
    - [`response.addTrailers(headers)`](http://nodejs.cn/api/http.html#responseaddtrailersheaders)
    - [`response.connection`](http://nodejs.cn/api/http.html#responseconnection)
    - [`response.cork()`](http://nodejs.cn/api/http.html#responsecork)
    - [`response.end([data[, encoding\]][, callback])`](http://nodejs.cn/api/http.html#responseenddata-encoding-callback)
    - [`response.finished`](http://nodejs.cn/api/http.html#responsefinished)
    - [`response.flushHeaders()`](http://nodejs.cn/api/http.html#responseflushheaders)
    - [`response.getHeader(name)`](http://nodejs.cn/api/http.html#responsegetheadername)
    - [`response.getHeaderNames()`](http://nodejs.cn/api/http.html#responsegetheadernames)
    - [`response.getHeaders()`](http://nodejs.cn/api/http.html#responsegetheaders)
    - [`response.hasHeader(name)`](http://nodejs.cn/api/http.html#responsehasheadername)
    - [`response.headersSent`](http://nodejs.cn/api/http.html#responseheaderssent)
    - [`response.removeHeader(name)`](http://nodejs.cn/api/http.html#responseremoveheadername)
    - [`response.req`](http://nodejs.cn/api/http.html#responsereq)
    - [`response.sendDate`](http://nodejs.cn/api/http.html#responsesenddate)
    - [`response.setHeader(name, value)`](http://nodejs.cn/api/http.html#responsesetheadername-value)
    - [`response.setTimeout(msecs[, callback\])`](http://nodejs.cn/api/http.html#responsesettimeoutmsecs-callback)
    - [`response.socket`](http://nodejs.cn/api/http.html#responsesocket)
    - [`response.statusCode`](http://nodejs.cn/api/http.html#responsestatuscode)
    - [`response.statusMessage`](http://nodejs.cn/api/http.html#responsestatusmessage)
    - [`response.uncork()`](http://nodejs.cn/api/http.html#responseuncork)
    - [`response.writableEnded`](http://nodejs.cn/api/http.html#responsewritableended)
    - [`response.writableFinished`](http://nodejs.cn/api/http.html#responsewritablefinished)
    - [`response.write(chunk[, encoding\][, callback])`](http://nodejs.cn/api/http.html#responsewritechunk-encoding-callback)
    - [`response.writeContinue()`](http://nodejs.cn/api/http.html#responsewritecontinue)
    - [`response.writeHead(statusCode[, statusMessage\][, headers])`](http://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers)
    - [`response.writeProcessing()`](http://nodejs.cn/api/http.html#responsewriteprocessing)

- express res

  - ![image-20220306125049199](5_express.assets/image-20220306125049199.png)

  

### 1.5 基础案例

- app.js

  ```
  const express = require('express')
  const fs = require('fs')
  const { getDb, saveDb } = require('./db')
  
  const app = express()
  
  // 配置解析表单请求体：application/json
  // 配置后可以通过 req.body获取请求体数据
  app.use(express.json())
  // 解析表单请求体：application/x-www-form-urlencoded
  app.use(express.urlencoded())
  
  app.get('/todos', async (req, res) => {
      try {
          const db = await getDb()
          res.status(200).json(db.todos)
      } catch (err) {
          res.status(500).json({
              error: err.message
          })
      }
  })
  
  app.get('/todos/:id', async (req, res) => {
      try {
          const db = await getDb()
          const todo = db.todos.find(todo => todo.id === Number.parseInt(req.params.id))
          if (!todo) {
              return res.status(404).end()
          }
          res.status(200).json(todo)
      } catch (err) {
          res.status(500).json({
              error: err.message
          })
      }
  })
  
  app.post('/todos', async (req, res) => {
      try {
          // 1.获取客户端请求体参数
          const todo = req.body
          // 2.数据验证
          if(!todo.title) {
              return res.status(422).json({
                  error: 'The field titile is required'
              })
          }
          // 3.数据验证通过，把数据存储到 db 中
          const db = await getDb()
          const lastTodo = db.todos[db.todos.length - 1]
          todo.id = lastTodo ? lastTodo.id + 1 : 1
          db.todos.push(todo)
          await saveDb(db)
          // 4.发送响应
          res.status(200).json(todo)
      } catch (err) {
          res.status(500).json({
              error: err.message
          })
      }
  })
  
  app.patch('/todos/:id', async (req, res) => {
      try {
          // 1.获取表单数据
          const todo = req.body
  
          // 2.查找要修改的任务项
          const db = await getDb()
          const ret = db.todos.find(todo => todo.id === Number.parseInt(req.params.id))
  
          if(!ret) {
              return res.status(404).end()
          }
  
          Object.assign(ret, todo)
          await saveDb(db)
  
          res.status(200).json(db)
      } catch (err) {
          res.status(500).json({
              error: err.message
          })
      }
  })
  
  app.delete('/todos/:id', async (req, res) => {
      try {
          const todoId = Number.parseInt(req.params.id)
          const db = await getDb()
          const index = db.todos.findIndex(todo =>  todo. todoId)
          if(index === -1) {
              return res.status(404).end()
          }
          db.todos.splice(index, 1)
          await saveDb(db)
          res.status(204).end()
      } catch (err) {
          res.status(500).json({
              error: err.message
          })
      }
  })
  
  app.listen(3000, () => {
      console.log('Server run at 3000')
  })
  ```

- db.js

  ```
  const fs = require('fs')
  const { promisify } = require('util')
  const path = require('path')
  
  const readFile = promisify(fs.readFile)
  const writeFile = promisify(fs.writeFile)
  
  const dbPath = path.join(__dirname, './db.json')
  
  exports.getDb = async () => {
      const data = await readFile(dbPath, 'utf-8')
      return JSON.parse(data)
  }
  
  exports.saveDb = async db => {
      const data = JSON.stringify(db)
      await writeFile(dbPath, data)
  }
  ```

- db.json

  ```
  {
      "todos": [
          {
              "id": 1,
              "title": "吃饭"
          },
          {
              "id": 2,
              "title": "睡觉"
          },
          {
              "id": 3,
              "title": "写代码"
          }
      ],
      "users":[]
  }
  ```

- 总结

  1. 获取请求表单参数
  2. 获取路由参数
  3. 状态码返回
  4. 数据库操作封装，使用 util 的 promisify 转换方法为 promise形式

## 2. 中间件

### 2.1 示例引入

```
const express = require('express')

const app = new express()

/**
 * req: 请求对象
 * res: 响应对象
 * next：下一个中间件
 */

app.use((req, res, next) => {
    console.log(req.method, req.url, Date.now())
    // 交出执行权，往后继续匹配执行
    next()
})

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.listen(3000, () => {
    console.log('Server run at 3000')
})
```

### 2.2 中间件函数

```
app.get('/', (req, res, next) => {
    res.send('Hello world!')
    next()
})
```

**在中间件函数中可以执行以下任何任务**

- 执行任务代码
- 修改 request 或者 response 响应对象
- 结束请求响应周期
- 调用下一个中间件



**express.json()原理**

```
function json(req, res, next) {
	// 处理req的数据，往req添加body属性
	// 调用下一个中间件
	next()
}
app.use(json)
```

### 2.3 中间件分类

- 应用程序级别中间件
- 路由级别中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

#### 2.3.1 应用程序级别中间件

**不关心请求路径 **

```
app.use((req, res, next) => {
    console.log(req.method, req.url, Date.now())
    // 交出执行权，往后继续匹配执行
    next()
})
```

**限定请求路径**

```
app.use('/user/:id', (req, res, next) => {
    console.log(req.method, req.url, Date.now())
    // 交出执行权，往后继续匹配执行
    next()
})
```

**限定请求方法 + 请求路径**

```
app.get('/user/:id', (req, res, next) => {
    console.log(req.method, req.url, Date.now())
    // 交出执行权，往后继续匹配执行
    next()
})
```

**限定路径 + 多个处理函数**

```
app.use('/user/:id', (req, res, next) => {
    console.log(req.method, req.url, Date.now())
    // 交出执行权，往后继续匹配执行
    next()
},(req, res, next) => {
	console.log('hello world')
})
```

**限定请求方法 + 请求路径+多个处理中间件**

```
app.get('/user/:id', (req, res, next) => {
    console.log(req.method, req.url, Date.now())
    // 交出执行权，往后继续匹配执行
    next()
},(req, res, next) => {
	console.log('hello world')
})
```

- 要从路由器中间件堆栈中跳过其余中间件功能，请调用 next('router') 将控制权传递给下一条路由。

- 注意：next('router') 仅在使用app.METHOD() 或 router.METHOD() 函数加载的中间件函数中有效

- ```
  app.get('/', (req, res, next) => {
      next('route')
  },(req, res, next) => {
  	console.log('second function')
  })
  
  app.get('/', (req, res) => {
      res.send('Hello world!')
  })
  ```

- 这里的代码由于执行了 next('route'),所以第二个中间件会被跳过（不会打印second function）

#### 2.3.2 路由级别中间件

路由器级中间件与应用程序中间件工作方式相同，只不过它绑定到的实例是 express.Router()

```
const router = express.Router()
```

使用 router.use() 和 router.METHOD() 函数加载路由器级别中间件。

- app.js

```
const express = require('express')
const app = new express()

const userRouter = require('./userRouter')

// 挂载路由（userRouter 里的路由前缀为 /user）
app.use('/user', userRouter)

app.listen(3000, () => {
    console.log('Server run at 3000')
})
```

- userRouter.js

```
const express = require('express')

// 1.创建路由实例
// 路由实例其实就相当于一个mini Express 实例

const router = express.Router()

// 2.配置路由
router.get('', (req, res) => {
    res.send('user list')
})

router.get('/:id', (req, res) => {
    res.send(req.params.id)
})

// 3.导出路由实例
module.exports = router
```

![image-20220312000020117](5_express.assets/image-20220312000020117.png)

#### 2.3.3 错误处理中间件

```
app.delete('/articles/:id', async (req, res, next) => {
    try {
        await dbClient.connect()
        const collection = dbClient.db('test').collection('articles')
        await collection.deleteOne({
          _id: ObjectId(req.params.id)
        })
        res.status(204).json({})
    } catch (error) {
        next(error) // 跳过所有的无错误处理路由喝中间件函数
    }
})
.......

// 统一错误处理中间件
// 它之前的所有路由中调用 next(error) 就会进入这里
// 注意：四个参数齐全才是错误处理中间件，如果不是会被当作路由处理
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    })
})
```

#### 2.3.4 处理404

- 在所有路由之后配置处理 404 的内容
- 请求进来从上到下依次匹配

```
app.delete()
app.post()
...

app.use((req, res) => {
	res.status(404).send('404 not Found')
})
```

#### 2.5 内置中间件

- express.json()
  - 解析 Content-Type 为application/json 格式的请求体
- express.urlencoded()
  - 解析 Content-Type 为 www-form-urlencoded 格式的请求体
- express.raw()
  - 解析 Content-Type 为 application/octet-stream 格式的请求体
- express.text()
  - 解析 Content-Type 为 text/plain 格式的请求体
- express.static()
  - 托管静态资源文件

#### 2.6 第三方中间件

https://www.expressjs.com.cn/resources/middleware.html



## 3.接口案例

### 3.1RESTful 接口规范

**路径**

路径又称“终点”，表示 API 的具体网址

在 RESTful 架构中，每个网址代表一种资源，所有网址中不能有动词，只能用名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的集合，所以API 中的名称也应该使用复数。

举例来说，有一个API 提供动物园（Zoo）的信息，还包括各种动物和雇员的信息，则它的路径应该设计成下面这样

- https://api.example.com/v1/zoos

- https://api.example.com/v1/animals

- https://api.example.com/v1/employees

  https://api.example.com/v1/zoos

**HTTP 动词**

对于资源的具体操作类型，由HTTP动词表示

常用的HTTP动词有下面五个（括号对应SQL命令）

- GET(读取)：从服务器取出资源（一项或多项）
- POST(创建)：在服务器新建一个资源
- PUT(完成更新)：在服务器更新资源（客户端提供改变后的完整资源）
- PATCH(部分更新)：在服务器更新资源（客户端提供改变的属性）
- DELETE(删除)：从服务器删除资源

两个不常用的HTTP动词：

- HEAD: 获取资源的元数据
- OPTIONS: 获取信息，关于资源的那些属性是客户端可以改变的

**过滤信息**

如果记录数量很多，服务器不可能都将他们返回给用户。API因该提供参数，过滤返回结果。

- ?limit = 10 指定返回记录的数量
- ?offset= 10 指定返回的开始记录

**状态码**

客户端的每一次请求，服务器都必须给出回应。回应包括 HTTP 状态码和数据两部分

HTTP 状态码就是一个三位数，分成五个类别

- 1**: 相关信息
- 2**:操作成功
- 3**:重定向
- 4**:客户端错误
- 5**:服务器错误

常见的有以下：

- 200 OK [GET]: 服务器成功返回用户请求的数据，该操作是幂等的
- 201 CREATED[POST/PUT/PATCH]: 用户新建或修改数据成功
- 202 Acepted[*]： 表示一个请求已经进入后台排队（后台任务）
- 204 no content[DELETE]: 用户删除数据成功
- 400 INVALID REQUEST[POST/PUT/PATCH]:用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作时幂等的
- 401 Unauthorized[*]: 表示用户没有权限（令牌、用户名、密码错误）
- 403 Forbidden[*]：表示用户得到授权（与401错误相等），但是访问被禁止
- 404 NOT FOUND[*]:用户发出的请求针对是不存在的记录，服务器没有该操作，该操作是幂等的
- 406 Not Acceptable[GET]: 用户的请求格式不可得（必去用户请求json格式，但是只有xml格式）
- 410 Gone[Get]:用户请求资源被永久删除，且不会再得到
- 422 Unprocesable entity[POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误
- 500 INTERNAL SERVER ERROR[*] 服务器发生错误，用户将无法判断发出的请求是否成功

**返回结果**

- HTTP 的 Content-type 属性设为 application/json
- 返回json 数据

针对不同操作，服务器向用户返回的结果应该符合以下规范

- GET/ collection：返回资源对象的列表（数组）
- GET/ collection/resource：返回单个资源对象
- POST/ collection：返回新生成的资源对象
- PUT/ collection/resource：返回完整的资源对象
- PATCH/ collection/resource：返回完整的资源对象
- DELETE/ collection/resource：返回一个空文档

**错误处理**

```
HTTP /1.1 400 Bad Request
Content-type: application/json
{
	"error": "Invalid payoad",
	"detail": {
		"surname": "This field is required"
	}
}
```

**身份认证**

基于 JWT 的接口权限认证：

- 字段名：Authorization
- 字段值：Bearer token 数据

**跨域处理**

可以在服务端设置 CORS 设置客户端跨域资源请求

### 3.2 目录结构

- config 配置文件
  - config.default.js
- controller 用于解析用户的输入，处理后返回相应的结果
- model 数据持久层
- middleware 用于编写中间件
- router 用于配置 url 路由
- util 工具模块
- app.js  用于自定义启动

### 3.2 配置常用中间件

- 解析请求体

  - express.json()
  - express.urlencoded()

- 日志输出

  - morgan()

  ```
  npm i morgan
  ```

- 为客户端提供跨域资源请求

  - cors()

  ```
  npm i cors
  ```

```
// app.js

const express = require('express')

// 日志中间件
const morgan = require('morgan')
// cors 中间件
const cors = require('cors')

const app = new express()

// 日志收集
app.use(morgan('dev'))

//  解析请求体
app.use(express.json())
app.use(express.urlencoded())

// 为客户端提供跨域资源请求
app.use(cors())

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/', (req, res) => {
    res.send(req.body)
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
```

![image-20220325234131054](5_express.assets/image-20220325234131054.png)

### 3.3 路由设计

- 在 app.js 中挂载路由

```
// 挂载路由
app.use('/api', router)
```

- router文件夹 index.js 中引入路由

```
const express = require('express')
const router = express.Router()

// 用户相关模块
router.use(require('./user'))
// 用户资料相关模块
router.use('/profiles', require('./profile'))
// 文章相关路由
router.use('/articles', require('./article'))
// 标签相关路由
router.use('/tag', require('./tag'))

module.exports = router
```

- user.js

```
const express = require('express')
const router = express.Router()

// 用户登录
router.post('/users/login', async (req, res, next) => {
    try {
        // 处理请求
        res.send('post /users/login')
    } catch (error) {
        next(error)
    }
})

...

module.exports = router
```

### 3.4 提取控制器模块

```
// router/user.js

const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/user')

// 用户登录
router.post('/users/login', userCtrl.login)
...
module.exports = router
```

```
// controller/user.js

//  用户登录
exports.login = async (req, res, next) => {
    try {
        // 处理请求
        res.send('login')
    } catch (error) {
        next(error)
    }
}
...
```

### 3.5 配置统一错误处理

暴露一个方法，然后use执行此方法。

```
// middleware/error-handler.js

const util = require('util')

module.exports = () => {
    return (err, req, res, next) => {
        res.status(500).json({
            error: util.format(err)
        })
    }
}
```

```
// app.js

// 挂载路由
app.use('/api', router)

// 挂载统一处理服务端错误中间件
app.use(errorHandler())
```

### 3.6 用户注册—将数据保存

```
npm i mongoose
```

- model/index.js ——连接数据库

  ```
  const mongoose = require('mongoose')
  const { dbUri } = require('../config/config.default')
  
  // 连接 MongoDB 数据库
  mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  
  const db = mongoose.connection
  
  // 当连接失败的时候
  db.on('error', err => {
    console.log('MongoDB 数据库连接失败', err)
  })
  
  // 当连接成功的时候
  db.once('open', function () {
    console.log('MongoDB 数据库连接成功')
  })
  
  // 组织导出模型类
  module.exports = {
    User: mongoose.model('User', require('./user')),
    Article: mongoose.model('Article', require('./article'))
  }
  ```

- model/user.js

  ```
  const mongoose = require('mongoose')
  const baseModel = require('./base-model')
  const md5 = require('../util/md5')
  
  const userSchema = new mongoose.Schema({
    ...baseModel,
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      set: value => md5(value),
      select: false
    },
    bio: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    }
  })
  
  module.exports = userSchema
  ```

- controller/user.js

  ```
  // 引入 user model
  const { User } = require('../model')
  ...
  //  用户注册
  exports.register = async (req, res, next) => {
      try {
          // 1. 获取请求体数据
          // 2 数据验证
          // 2.1 基本数据验证
          // 2.2 业务数据验证
          // 3.验证通过，将数据保存到数据库
          const user = new User(req.body.user)
          await user.save()
          // 4.发送成功响应
          res.status(201).json({
              user
          })
      } catch (error) {
          next(error)
      }
  }
  ```

### 3.7 数据验证 express-validator

https://express-validator.github.io/docs/

```
npm install --save express-validator
```

```
const { body, validationResult } = require('express-validator');
const { User } = require('../model');
...
// 用户注册
router.post('/users',[ // 1.配置验证规则
    body('user.username')
        .notEmpty().withMessage('用户名不能为空')
        .custom(async username => {
            const user = await User.findOne({ username })
            if (user) {
                return Promise.reject('用户名已存在')
            }
        }),
    body('user.password').notEmpty().withMessage('密码不能为空'),
    body('user.email')
        .notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式不正确')
        .bail() // 前面两者都通过
        .custom(async email => {
            const user = await User.findOne({ email })
            if (user) {
                return Promise.reject('邮箱已存在')
            }
        })
], (req, res, next) => { // 2. 判断验证结果
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
},userCtrl.register)
```

### 3.8 提取验证中间件

- middleware/validate.js

  ```
  const { validationResult } = require('express-validator')
  
  module.exports = validations => {
      return async (req, res, next) => {
          await Promise.all(validations.map(validation => validation.run(req)))
  
          const errors = validationResult(req)
          if (errors.isEmpty()) {
              return next()
          }
  
          res.status(400).json({ errors: errors.array() })
      }
  }
  ```

- validator/user.js

  ```
  const validate = require('../middleware/validate')
  const { body } = require('express-validator')
  const { User } = require('../model')
  
  exports.register = validate([
      body('user.username')
          .notEmpty().withMessage('用户名不能为空')
          .custom(async username => {
              const user = await User.findOne({ username })
              if (user) {
                  return Promise.reject('用户名已存在')
              }
          }),
      body('user.password').notEmpty().withMessage('密码不能为空'),
      body('user.email')
          .notEmpty().withMessage('邮箱不能为空')
          .isEmail().withMessage('邮箱格式不正确')
          .bail() // 前面两者都通过
          .custom(async email => {
              const user = await User.findOne({ email })
              if (user) {
                  return Promise.reject('邮箱已存在')
              }
          })
  ])
  ```

- router/user.js

  ```
  const express = require('express')
  const router = express.Router()
  const userCtrl = require('../controller/user')
  const userValidator = require('../validator/user')
  
  // 用户注册
  router.post('/users', userValidator.register, userCtrl.register)
  
  module.exports = router
  ```

### 3.10 使用md5加密密码

- util/md5.js

  ```
  const crypto = require('crypto')
  
  module.exports = str => {
      return crypto.createHash('md5')
          .update('lagou' + str)
          .digest('hex')
  }
  ```

- model/user.js

  - 使用 select: false 保证了密码不会被查询返回

  ```
  const mongoose = require('mongoose')
  const baseModel = require('./base-model')
  const md5 = require('../util/md5')
  
  const userSchema = new mongoose.Schema({
    ...
    password: {
      type: String,
      required: true,
      set: value => md5(value),
      select: false
    }
    ...
  })
  
  module.exports = userSchema
  ```


### 3.11 登录数据验证

```
exports.login = [
  validate([
    body('user.email').notEmpty().withMessage('邮箱不能为空'),
    body('user.password').notEmpty().withMessage('密码不能为空')
  ]),
  validate([
    body('user.email').custom(async (email, { req }) => {
      const user = await User.findOne({ email })
        .select(['email', 'username', 'bio', 'image', 'password'])
      if (!user) {
        return Promise.reject('用户不存在')
      }

      // 将数据挂载到请求对象中，后续的中间件也可以使用了
      req.user = user
    })
  ]),
  validate([
    body('user.password').custom(async (password, { req }) => {
      if (md5(password) !== req.user.password) {
        return Promise.reject('密码错误')
      }
    })
  ])
]
```

### 3.12 基于JWT的身份认证

**JSON Web Token(缩写JWT)是目前最流行的跨域认证解决方案。**

- 跨域认证的问题

  互联网服务离不开用户认证。一般流程是下面这样。

  1. 用户向服务器发送用户名和密码。

  2. 服务器验证通过后，在当前对话(session)里面保存相关数据，比如用户角色、登录时间等等。

  3. 服务器向用户返回一个session_id，写入用户的Cookie。

  4. 用户随后的每一次请求，都会通过Cookie，将session_id 传回服务器。

  5. 服务器收到session_id，找到前期保存的数据，由此得知用户的身份。

  6. 这种模式的问题在于，扩展性(scaling）不好。单机当然没有问题，如果是服务器集群，或者是跨域的服务导向架构，就要求session数据共享，每台服务器都能够读取session。

     举例来说，A网站和B网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现?

     一种解决方案是session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。

     另一种方案是服务器索性不保存session 数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。

- JWT 原理

  JWT的原理是，服务器认证以后，生成一个JSON对象，发回给用户，就像下面这样。

  ```
  {
  	“姓名”: "张三",
  	"角色": "管理员",
  	"到期时间": "2018年7月1日0点0分"
  }
  ```

  以后，用户与服务端通信的时候，都要发回这个JSON对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名（详见后文)。

  服务器就不保存任何session数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。

- JWT 的数据结构

  实际的 JWT 大概就像下面这样

  ```
  eyJhbGci0iJIUzI1NiIsInR5cCT6IkpXvCJ9.
  eyJzdWIi0iIxMjMNTY30DkwIiwibmFtZSI6IkpvaG4gRG91IiwiaXNTb2NpYWwiOnRydwV9.
  eyJhbGci0iJIUzI1NiIsInR5cCT6IkpXvCJ9.
  eyJzdWIi0iIxMjMNTY30DkwIiwibmFtZSI6IkpvaG4gRG91IiwiaXNTb2NpYWwiOnRydwV9.
  4pcPyMD89o1PSyXnrXCjTwXyr4BsezdI1AVTmud2fU4
  ```

  它是一个很长的字符串，中间用点（.）分隔成三个部分。注意，JWT内部是没有换行的，这里只是为了便于展示，将它写成了几行。

  JWT 的三部分依次如下

  - Header(头部)
  -  Payload(负载)
  - Signature(签名)

- Header

  Header 部分是一个JSON对象，描述JWT 的元数据，通常是下面的样子。

  ```
  {
  	" alg":“HS256,
  	"type": "JWT"
  }
  ```

  上面代码中，alg属性表示签名的算法（algorithm)，默认是HMAC SHA256(写成HS256) ; typ属性表示这个令牌(token)的类型(type),JWT令牌统一写为JWT。

  最后，将上面的JSON对象使用Base64URL算法（详见后文）转成字符串。

- pAyload

  Payload 部分也是一个JSON对象，用来存放实际需要传递的数据。JWT规定了7个官方字段，供选用。

  - iss (issuer):签发人
  - exp (expiration time):过期时间
  - sub (subject):主题
  - aud (audience):受众
  - nbf (Not Before):生效时间
  - iat (lssued At):签发时间
  - jti (JWT ID):编号

  除了官方字段，你还可以在这个部分定义私有字段，下面就是例子。

  ```
  {
  	"sub" : "123450/o,
  	"name" : "Jonn voe,
  	"admin" : true
  }
  ```

  注意，JWT默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。

  这个JSON对象也要使用Base64URL 算法转成字符串。

- Signature

  Signature部分是对前两部分的签名，防止数据篡改。

- jwt.io https://jwt.io/

  ![image-20220426233420925](5_express.assets/image-20220426233420925.png)

- Signature

  Signature部分是对前两部分的签名，防止数据篡改。

  首先，需要指定一个密钥(secret)。这个密钥只有服务器才知道,不能泄露给用户。然后，使用Header里面指定的签名算法（默认是HMAC SHA256)，按照下面的公式产生签名。

  ```
  1 HMACSHA256(
  	base64UrlEncode ( header)+"."+
  	base64UrlEncode( payload ),
  	secret)
  ```

  算出签名以后，把Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点”(）分隔，就可以返回给用户。

  **在JWT中，消息体是透明的，使用签名可以保证消息不被篡改。但不能实现数据加密功能。**

- Base64URL

  前面提到，Header和 Payload 串型化的算法是Base64URL。这个算法跟 Base64算法基本类似，但有一些小的不同。

  JWT作为一个令牌(token)，有些场合可能会放到URL （比如api.example.com/?token=xxx)。Base64有三个字符+、/和=，在URL里面有特殊含义，所以要被替换掉:=被省略、+替换成-，/替换成_。这就是

- JWT 的使用方式

  客户端收到服务器返回的JWT，可以储存在Cookie 里面，也可以储存在localStorage。

  此后，客户端每次与服务器通信，都要带上这个JWT。你可以把它放在Cookie里面自动发送，但是这样不能跨域，所以更好的做法是放在HTTP请求的头信息Authorization字段里面（也可以自定义字段入abc）。

  ```
  Authorization: Bearer <token>
  ```

  另一种做法是，跨域的时候，JWT就放在POST 请求的数据体里面。

- JWT 的几个特点

  ( 1) JWT 默认是不加密，但也是可以加密的。生成原始Token 以后，可以用密钥再加密一次。

  (2)JWT不加密的情况下，不能将秘密数据写入JWT。

  (3)JWT不仅可以用于认证，也可以用于交换信息。有效使用JWT,可以降低服务器查询数据库的次数。

  (4)JWT的最大缺点是，由于服务器不保存session状态，因此无法在使用过程中废止某个token，或者更改token 的权限。也就是说，一旦JWT签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

  (5)JWT本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

  (5)JWT本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

- JWT 的解决方案 

  - https://jwt.io

- 在 Node.js 中使用 JWT

  推荐： https://github.com/auth0/node-jsonwebtoken

### 3.13 使用 jsonwebtoken

```
npm install jsonwebtoken
```

```
const jwt = require('jsonwebtoken')

/* jwt.sign({
    foo: 'bar'
}, 'abcdefghijklmn', (err, token) => {
    if (err) {
        return console.log('生成tocken 失败')
    }
    console.log(token) // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2NTEwNzExNjZ9.DldZl60SJEanxZaNm30A80Sz9VF1Y9So9NZKIa48jtU
}) */

// 验证 jwt
const ret = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2NTEwNzExNjZ9.DldZl60SJEanxZaNm30A80Sz9VF1Y9So9NZKIa48jtU',
    'abcdefghijklmn',
    (err, ret) => {
        if (err) {
            return console.log('token 认证失败')
        }
        console.log(ret) // { foo: 'bar', iat: 1651071166 }
    }
)
```

### 3.14 用户登录—生成token

- utils/jwt.js

  ```
  const jwt = require('jsonwebtoken')
  
  const { promisify } = require('util')
  
  exports.sign = promisify(jwt.sign)
  
  exports.verify = promisify(jwt.verify)
  
  exports.decode = promisify(jwt.decode)
  
  ```

- controller/user.js

  ```
  const { User } = require('../model')
  const jwt = require('../util/jwt')
  const { jwtSecret } = require('../config/config.default')
  
  //  用户登录
  exports.login = async (req, res, next) => {
      try {
          // 1.数据验证
          // 2. 生成 token
          const user = req.user.toJSON()
          const token = await jwt.sign({
              userId: user._id
          }, jwtSecret)
          // 3. 发送成功响应（包含 token 的用户信息）
          delete user.password
          res.status(200).json({
              ...user,
              token
          })
      } catch (error) {
          next(error)
      }
  }
  ```

  ![image-20220428231503791](5_express.assets/image-20220428231503791.png)

### 3.15 使用中间件统一处理jwt身份认证

- middleware/jwt.js

  ```
  const { verify } = require('../util/jwt')
  const { jwtSecret } = require('../config/config.default')
  const { User } = require('../model')
  
  module.exports = async (req, res, next) => {
    // 从请求头获取 token 数据
    let token = req.headers['authorization']
    token = token
      ? token.split('Bearer ')[1]
      : null
  
    if (!token) {
      return res.status(401).end()
    }
  
    try {
      const decodedToken = await verify(token, jwtSecret)
      req.user = await User.findById(decodedToken.userId)
      next()
    } catch (err) {
      return res.status(401).end()
    }
  
    // 验证 token 是否有效
    // 无效 -> 响应 401 状态码
    // 有效 -> 把用户信息读取出来挂载到 req 请求对象上
    //        继续往后执行
  }
  ```

- router/user.js

  ```
  ...
  const auth = require('../middleware/auth')
  
  // 获取当前登录用户
  router.get('/user', auth, userCtrl.getCurrentUser)
  
  // 更新当前登录用户
  router.put('/user', auth, userCtrl.updateCurrentUser)
  ```

  ![image-20220428234516060](5_express.assets/image-20220428234516060.png)

### 3.16 jwt 过期时间与postman统一设置token

- controller/user.js

  - expiresIn: '24h'

  ```
  //  用户登录
  exports.login = async (req, res, next) => {
      try {
          // 1.数据验证
          // 2. 生成 token
          const user = req.user.toJSON()
          const token = await jwt.sign({
              userId: user._id
          }, jwtSecret, {
              expiresIn: '24h'
          })
          // 3. 发送成功响应（包含 token 的用户信息）
          delete user.password
          res.status(200).json({
              ...user,
              token
          })
      } catch (error) {
          next(error)
      }
  }
  ```

- 统一设置

  ![image-20220505224409376](5_express.assets/image-20220505224409376.png)

## 4. express 实现原理

### 4.1 源码结构

![image-20220508114908437](5_express.assets/image-20220508114908437.png)

常规入口文件为package.json 中 main 字段对应文件，由于此package.json 中没有此字段，默认入口文件为 index.js。

- index.js

  暴露lib/express

  ```
  'use strict';
  module.exports = require('./lib/express');
  ```

- express.js

  - const express = require('express') 引入的即是此app
  - 通过 mixin 混合了其它， 关键在于 application.js

  ```
  ...
  var mixin = require('merge-descriptors');
  var proto = require('./application');
  
  function createApplication() {
    var app = function(req, res, next) {
      app.handle(req, res, next);
    };
    mixin(app, EventEmitter.prototype, false);
    mixin(app, proto, false);
  
    // expose the prototype that will get set on requests
    app.request = Object.create(req, {
      app: { configurable: true, enumerable: true, writable: true, value: app }
    })
  
    // expose the prototype that will get set on responses
    app.response = Object.create(res, {
      app: { configurable: true, enumerable: true, writable: true, value: app }
    })
  
    app.init();
    return app;
  }
  ...
  ```

- request.js

  对 request进行了扩展

- response.js

  对 response 进行了扩展

- router 文件夹

  对 router 进行了处理

- middleware 文件夹

  内置中间件

- utils.js

  工具函数

### 4.2 快速体验
