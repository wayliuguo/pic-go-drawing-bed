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
