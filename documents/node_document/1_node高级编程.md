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

