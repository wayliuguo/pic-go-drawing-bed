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

