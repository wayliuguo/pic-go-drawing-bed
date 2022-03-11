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
  - ![image-20220303232215250](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220303232215250.png)

- express req
  - http://expressjs.com/en/4x/api.html#req
  - ![image-20220306123719279](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220306123719279.png)

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

  - ![image-20220306125049199](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220306125049199.png)

  

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

![image-20220312000020117](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220312000020117.png)
