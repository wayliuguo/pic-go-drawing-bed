## 1.NoSQL 简介

### 1.1 传统关系型数据库受到的挑战

- 难以应付每秒上万次的高并发数据写入 。
- 查询上亿量级数据的速度极其缓慢 。

- 分库、分表形成的子库到达一定规模后难以进一步扩展 。
- 分库、分表 的规则可能会因为需求变更而发生变更。

- 修改表结构困难 。

### 1.2 NoSQL 数据库有哪些种类

#### 1.2.1 键值数据库

这类数据库主要是使用数据结构中的键 Key 来查找特定的数据Value。

- 优点：在存储时不采用任何模式，因此极易添加数据

这类数据库具有极高的读写性能，用于处理大量数据的高访问负载比较合适。键值对数据库适合大量数据的高访问及写入负载场景，例如日志系统。主要代表是 Redis、Flare。

#### 1.2.2 文档型数据库

这类数据库满足了海量数据的存储和访问需求，同时对字段要求不严格，可以随意增加、删除、修改字段，且不需要预先定义表结构，所以适用于各种网络应用。

主要代表是 MongoDB、CouchDB。

#### 1.2.3 列存储型数据库

主要代表是 Cassandra 、Hbase。

这类数据库查找速度快，可扩展性强，适合用作分布式文件存储系统。

#### 1.2.4 图数据库

这类数据库具有极高的读写性能，用于处理大量数据的高访问负载比较合适。键值对数据库适合大量数据的高访问及写入负载场景，例如日志系统。主要代表是 Redis、Flare。

## 2. MongoDB简介

- 官方文档：https://www.mongodb.com/
- MongoDB 是由 C++ 语言编写的，是一个基于分布式文件存储的开源 NoSQL 数据库系统。

- MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

- - 这会让曾经使用过关系型数据库的人比较容易上手

- MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

![img](https://cdn.nlark.com/yuque/0/2020/png/152778/1604459344700-418329ca-3c73-4aa7-8ecf-c6cf93eb625d.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_16%2Ctext_5ouJ5Yu-5pWZ6IKy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

- MongoDB 的查询功能非常强大

- - 不仅支持大部分关系型数据库中的单表查询，还支持范围查询、排序、聚合、MapReduce 等
  - MongoDB 的查询语法类似于面相对象的程序语言

## 3. MongoDB 安装

- 下载网址：https://www.mongodb.com/try/download/community
- 解压zip包，放到一个文件夹，复制其到bin文件夹下的路径
- 把复制的路径用于编辑系统环境变量

![image-20220211230626314](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220211230626314.png)

```
PS C:\Users\way liu> mongod -version
db version v5.0.6
Build Info: {
    "version": "5.0.6",
    "gitVersion": "212a8dbb47f07427dae194a9c75baec1d81d9259",
    "modules": [],
    "allocator": "tcmalloc",
    "environment": {
        "distmod": "windows",
        "distarch": "x86_64",
        "target_arch": "x86_64"
    }
}
```



## 4.启动与停止MongoDB

- 启动

  ```
  mongod --dbpath="D:\Program Files (x86)\mongodb-win32-x86_64-windows-5.0.6\data"
   
  mongod --dbpath="数据存放目录"
  ```

  - mongodb 默认会占用本地端口 localhost:27017
  - 如果单独执行 mongod，它会默认使用执行 mongod 命令所处磁盘根目录/data/db 作为数据存储目录

  ```
  mongo
  ```

  - 不要关闭之前的powershell，新开一个，运行 mongo

- 快捷启动

  - 先在所处磁盘根目录创建 data/db
  - mongod: 在一个powershell 输入
  - mongo：在另一个powershell 输入
  - 默认使用执行 mongod 命令所处磁盘根目录/data/db 作为数据存储目录

- 关闭
  - ctrl + c 或关闭命令窗口

## 5. Mongo Shell 连接 MongoDB

- 上面的启动过程就是使用 mongo shell 连接 mongoDB

- 连接非默认端口上的本地 MongoDB

  ```
  mongo --port 2015
  ```

- 连接远程主机上的 MongoDB 服务

  ```
  mongo "mongodb://mongodb0.example.com:28015"
  
  mongo --host mongodb0.example.com:28015
  
  mongo --host mongodb0.example.com --port 28015
  ```

- 连接具有身份认证的 MongoDB 服务

  ```
  mongo "mongodb://alice@mongodb0.examples.com:28015/?authSource=admin"
  
  mongo --username alice --password --authenticationDatabase admin --host mongodb0.examples.com --port 28015
  ```

## 6. Mongo Shell 执行环境

- 提供了 JavaScript 执行环境
- 内置了一些数据库操作命令

- - show dbs 展示已创建并有数据的数据库
  - db  当前操作的数据库

- - use database 使用/创建 数据库
  - show collections 展示集合

- - ...

- 提供了一大堆的内置 API 用来操作数据库

- - db.users.insert({ name: 'Jack', age: 18 })

![image-20220213220847809](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220213220847809.png)

- 退出连接的三种方式
  - exit
  - quit()
  - Ctrl + C

## 7. MongoDB 基础概念

- 数据存储结构
- 数据库

- 集合
- 文档

### 7.1 数据存储结构

- 你可以把 MongoDB 数据库想象为一个超级大对象
- 对象里面有不同的集合

- 集合中有不同的文档

```
{
  // 数据库 Database
  "京东": {
    // 集合 Collection，对应关系型数据库中的 Table
    "用户": [
      // 文档 Document，对应关系型数据库中的 Row
      {
        // 数据字段 Field，对应关系数据库中的 Column
        "id": 1,
        "username": "张三",
        "password": "123"
      },
      {
        "id": 2,
        "username": "李四",
        "password": "456"
      }
      // ...
    ],
    "商品": [
      {
        "id": 1,
        "name": "iPhone Pro Max",
        "price": 100
      },
      {
        "id": 2,
        "name": "iPad Pro",
        "price": 80
      }
    ],
    "订单": []
    // ...
  },

  // 数据库
  "淘宝": {}

  // ...
}
```

- Database

  - 集合：Collection ==> 对应关系型数据库 Table
    - 文档：Document ==> 对应关系型数据库 Row（行）
      - 数据字段：Field ==> 对应关系型数据库中的 Column（列）

  ```
  姓名  身高  体重
  张三  178   60
  李四  178   70
  ```

  - 一行由多个列组成，一列有多个字段

### 7.2 数据库操作

- 创建数据

  ```
  use databaseName
  ```

  - 不区分大小写，但是建议全部小写
  - 不能包含空字符。

  - 数据库名称不能为空，并且必须少于64个字符。
  - Windows 上的命名限制

  - - 不能包括 `/\. "$*<>:|?` 中的任何内容

  - Unix 和 Linux 上的命名限制

  - - 不能包括 `/\. "$` 中的任何字符

- 删除数据库

  ```
  > use person
  switched to db person
  > show dbs
  admin   0.000GB
  config  0.000GB
  local   0.000GB
  test    0.000GB
  > db.users.insert({name:"liuguowei", age: 18})
  WriteResult({ "nInserted" : 1 })
  > show dbs
  admin   0.000GB
  config  0.000GB
  local   0.000GB
  person  0.000GB
  test    0.000GB
  > show collections
  users
  > db.users.find()
  { "_id" : ObjectId("6209190e35030ca8a7475f37"), "name" : "liuguowei", "age" : 18 }
  > db.dropDatabase()
  { "ok" : 1 }
  > show dbs
  admin   0.000GB
  config  0.000GB
  local   0.000GB
  test    0.000GB
  ```

  ### 7.3 集合

  集合类似于关系数据库中的表，MongoDB 将文档存储在集合中![image-20220213225759618](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220213225759618.png)

**创建集合**

如果不存在集合，则在您第一次为该集合存储数据时，MongoDB 会创建该集合。

```
db.myNewCollection2.insert( { x: 1 } )
```

MongoDB提供 `db.createCollection()` 方法来显式创建具有各种选项的集合，例如设置最大大小或文档验证规则。如果未指定这些选项，则无需显式创建集合，因为在首次存储集合数据时，MongoDB 会创建新集合。

**集合名称规则**

集合名称应以下划线或字母字符开头，并且：

- 不能包含 `$`
- 不能为空字符串

- 不能包含空字符
- 不能以 `.` 开头

- 长度限制

- - 版本 4.2 最大 120 个字节
  - 版本 4.4 最大 255 个字节

**查看集合**

```
show collections
```

**删除集合**

```
db.集合名称.drop()
```

```
> db.users.insert({name: "liuguowei", age: 18})
WriteResult({ "nInserted" : 1 })
> show collections
users
> db.users.drop()
true
> show collections
```

