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

- 集合类似于关系数据库中的表，MongoDB 将文档存储在集合中![image-20220213225759618](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220213225759618.png)

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

### 7.4 文档

- MongoDB 将数据记录存储为 BSON 文档
- BSON（Binary JSON）是 JSON 文档的二进制表示形式，它比 JSON 包含更多的数据类型
- [BSON 规范](http://bsonspec.org/)
- [BSON 支持的数据类型](https://docs.mongodb.com/manual/reference/bson-types/)

![image-20220215224757850](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20220215224757850.png)

#### 7.4.1 文档结构

MongoDB 文档由字段和值对组成，并具有以下结构： 

```
{
   field1: value1,
   field2: value2,
   field3: value3,
   ...
   fieldN: valueN
}
```

#### 7.4.2 字段名称

文档对字段名称有以下限制：

- 字段名称 `_id` 保留用作主键；它的值在集合中必须是唯一的，不可变的，并且可以是数组以外的任何类型。
- 字段名称不能包含空字符。
- 顶级字段名称不能以美元符号 `$` 开头。
- 从 MongoDB 3.6 开始，服务器允许存储包含点 `.` 和美元符号 `$` 的字段名称

#### 7.4.3 MongoDB 中的数据类型

字段的值可以是任何 BSON 数据类型，包括其他文档，数组和文档数组。例如，以下文档包含各种类型的值：

```
var mydoc = {
    _id: ObjectId("5099803df3f4948bd2f98391"),
    name: { first: "Alan", last: "Turing" },
    birth: new Date('Jun 23, 1912'),
    death: new Date('Jun 07, 1954'),
    contribs: [ "Turing machine", "Turing test", "Turingery" ],
    views : NumberLong(1250000)
}
```

上面的字段具有以下数据类型：

- _id 保存一个 [ObjectId](https://docs.mongodb.com/manual/reference/bson-types/#objectid) 类型
- name 包含一个嵌入式文档，该文档包含 first 和 last 字段

- birth 和 death 持有 Date 类型的值
- contribs 保存一个字符串数组

- views 拥有 NumberLong 类型的值

下面是 MongoDB 支持的常用数据类型。

| 类型               | 整数标识符 | 别名（字符串标识符） |
| ------------------ | ---------- | -------------------- |
| Double             | 1          | “double”             |
| String             | 2          | “string”             |
| Object             | 3          | “object”             |
| Array              | 4          | “array”              |
| Binary data        | 5          | “binData”            |
| ObjectId           | 7          | “objectId”           |
| Boolean            | 8          | “bool”               |
| Date               | 9          | “date”               |
| Null               | 10         | “null”               |
| Regular Expression | 11         | “regex”              |
| 32-bit integer     | 16         | “int”                |
| Timestamp          | 17         | “timestamp”          |
| 64-bit integer     | 18         | “long”               |
| Decimal128         | 19         | “decimal”            |

#### 7.4.4 _id 字段

在 MongoDB 中，存储在集合中的每个文档都需要一个唯一的 `_id` 字段作为主键。如果插入的文档省略 。

`_id` 字段，则 MongoDB 驱动程序会自动为 `_id` 字段生成 `ObjectId`。

`_id` 字段具有以下行为和约束：

- 默认情况下，MongoDB 在创建集合时会在 `_id` 字段上创建唯一索引。
- `_id` 字段始终是文档中的第一个字段

- `_id` 字段可以包含任何 BSON 数据类型的值，而不是数组。

#### 7.4.5 案例说明

```
> db.users.find()
{ "_id" : ObjectId("620bc26d1f6c42ee85607a9e"), "name" : "liuguowei", "age" : 18 }
> db.users.insert({_id: 123, a: 100})
WriteResult({ "nInserted" : 1 })
> db.users.find()
{ "_id" : ObjectId("620bc26d1f6c42ee85607a9e"), "name" : "liuguowei", "age" : 18 }
{ "_id" : 123, "a" : 100 }
```

- 可以指定_id，不指定默认生成
- 不同文档的数据结构不必相同

## 8. 基础操作

### 8.1 创建文档

| `db.collection.insertOne()` | 插入单个文档到集合中        |
| --------------------------- | --------------------------- |
| `db.collection.insertOne()` | 插入多个文档到集合中        |
| `db.collection.insert()`    | 将1个或多个文档插入到集合中 |

- db.collection.insertOne()

  ```
  db.inventory.insertOne(
     { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
  )
  ```

  ```
  {
      "acknowledged": true,
      "insertedId": ObjectId("620d0276f83d000003005123")
  }
  ```

- db.collection.insertOne()

  ```
  db.inventory.insertMany(
  	[
     		{ item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
     		{ item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
     		{ item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
  	]
  )
  ```

  ```
  {
      "acknowledged": true,
      "insertedIds": [
          ObjectId("620d02c7f83d000003005124"),
          ObjectId("620d02c7f83d000003005125"),
          ObjectId("620d02c7f83d000003005126")
      ]
  }
  ```

- db.collection.insert()

  ```
  db.inventory.insert(
  	[
         { item: "javascript", qty: 100, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
         { item: "css", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
         { item: "html", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
  	]
  )
  ```

  ```
  BulkWriteResult({
  	"nRemoved" : 0,
  	"nInserted" : 3,
  	"nUpserted" : 0,
  	"nMatched" : 0,
  	"nModified" : 0,
  	"writeErrors" : [ ]
  })
  ```

  

### 8.2 查询文档

#### 8.2.1 基本查询

##### 8.2.1.1 准备数据

```
db.inventory.insertMany(
	[
		 { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
		 { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
		 { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
		 { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
		 { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
	]
);
```

##### 8.2.1.2 查询所有文档

**语法**

- db.collection.find(query, projection)

  - query: 可选，使用查询操作符指定查询条件

- - projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。

- db.collection.findOne()

```
db.inventory.find()

// SELECT * FROM inventory
```

```
// 1
{
    "_id": ObjectId("620d0829f83d00000300512f"),
    "item": "journal",
    "qty": 25,
    "size": {
        "h": 14,
        "w": 21,
        "uom": "cm"
    },
    "status": "A"
}

// 2
{
    "_id": ObjectId("620d0829f83d000003005130"),
    "item": "notebook",
    "qty": 50,
    "size": {
        "h": 8.5,
        "w": 11,
        "uom": "in"
    },
    "status": "A"
}

// 3
{
    "_id": ObjectId("620d0829f83d000003005131"),
    "item": "paper",
    "qty": 100,
    "size": {
        "h": 8.5,
        "w": 11,
        "uom": "in"
    },
    "status": "D"
}

// 4
{
    "_id": ObjectId("620d0829f83d000003005132"),
    "item": "planner",
    "qty": 75,
    "size": {
        "h": 22.85,
        "w": 30,
        "uom": "cm"
    },
    "status": "D"
}

// 5
{
    "_id": ObjectId("620d0829f83d000003005133"),
    "item": "postcard",
    "qty": 45,
    "size": {
        "h": 10,
        "w": 15.25,
        "uom": "cm"
    },
    "status": "A"
}

```

##### 8.2.1.3 指定返回的文档字段

```
db.inventory.find({}, {
	item: 1,
  	qty: 1
})

// SELECT item, qty FROM inventory
```

- 1：需要展示的字段，0：不需要展示的字段

```
// 1
{
    "_id": ObjectId("620d0829f83d00000300512f"),
    "item": "journal",
    "qty": 25
}

// 2
{
    "_id": ObjectId("620d0829f83d000003005130"),
    "item": "notebook",
    "qty": 50
}

// 3
{
    "_id": ObjectId("620d0829f83d000003005131"),
    "item": "paper",
    "qty": 100
}

// 4
{
    "_id": ObjectId("620d0829f83d000003005132"),
    "item": "planner",
    "qty": 75
}

// 5
{
    "_id": ObjectId("620d0829f83d000003005133"),
    "item": "postcard",
    "qty": 45
}
```

##### 8.2.1.4 相等条件查询

```
db.inventory.find( { status: "D" } )

// SELECT * FROM inventory WHERE status = "D"
```

- 找出 status 为 D 的文档

```
// 1
{
    "_id": ObjectId("620d0829f83d000003005131"),
    "item": "paper",
    "qty": 100,
    "size": {
        "h": 8.5,
        "w": 11,
        "uom": "in"
    },
    "status": "D"
}

// 2
{
    "_id": ObjectId("620d0829f83d000003005132"),
    "item": "planner",
    "qty": 75,
    "size": {
        "h": 22.85,
        "w": 30,
        "uom": "cm"
    },
    "status": "D"
}
```

##### 8.2.1.5 指定 AND 条件

```
db.inventory.find( { status: "A", qty: { $lt: 30 } } )

// SELECT * FROM inventory WHERE status = "A" AND qty < 30
```

```
// 1
{
    "_id": ObjectId("620d0829f83d00000300512f"),
    "item": "journal",
    "qty": 25,
    "size": {
        "h": 14,
        "w": 21,
        "uom": "cm"
    },
    "status": "A"
}

```

- AND:  在第一个对象中添加其它条件
- $lt：小于

##### 8.2.1.6 指定 OR 条件

使用 `$or` 运算符，您可以指定一个复合查询，该查询将每个子句与一个逻辑或连接相连接，以便该查询选择集合中至少匹配一个条件的文档。

```
db.inventory.find({
  $or: [
    { status: "A" },
    { qty: { $lt: 30 } }
  ]
})

// SELECT * FROM inventory WHERE status = "A" OR qty < 30
```

- 查询状态为 `A` 或数量小于 `$lt30` 的集合中的所有文档

```
// 1
{
    "_id": ObjectId("620d0829f83d00000300512f"),
    "item": "journal",
    "qty": 25,
    "size": {
        "h": 14,
        "w": 21,
        "uom": "cm"
    },
    "status": "A"
}

// 2
{
    "_id": ObjectId("620d0829f83d000003005130"),
    "item": "notebook",
    "qty": 50,
    "size": {
        "h": 8.5,
        "w": 11,
        "uom": "in"
    },
    "status": "A"
}

// 3
{
    "_id": ObjectId("620d0829f83d000003005133"),
    "item": "postcard",
    "qty": 45,
    "size": {
        "h": 10,
        "w": 15.25,
        "uom": "cm"
    },
    "status": "A"
}
```

##### 8.2.1.7 指定 AND 和 OR 条件

```
db.inventory.find({
  status: "A",
  $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
})

// SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
```

- 复合查询文档选择状态为“ A”且qty小于（$ lt）30或item以字符p开头的所有文档

```
// 1
{
    "_id": ObjectId("620d0829f83d00000300512f"),
    "item": "journal",
    "qty": 25,
    "size": {
        "h": 14,
        "w": 21,
        "uom": "cm"
    },
    "status": "A"
}

// 2
{
    "_id": ObjectId("620d0829f83d000003005133"),
    "item": "postcard",
    "qty": 45,
    "size": {
        "h": 10,
        "w": 15.25,
        "uom": "cm"
    },
    "status": "A"
}
```

##### 8.2.1.8 使用查询运算符指定条件

```
db.inventory.find( { status: { $in: [ "A", "D" ] } } )

// SELECT * FROM inventory WHERE status in ("A", "D")
```



##### 8.2.1.9 查询运算符

https://docs.mongodb.com/manual/reference/operator/query/

- 比较运算符

  | 名称   | 描述                       |
  | ------ | -------------------------- |
  | `$eq`  | 匹配等于指定值的值。       |
  | `$gt`  | 匹配大于指定值的值。       |
  | `$gte` | 匹配大于或等于指定值的值。 |
  | `$in`  | 匹配数组中指定的任何值。   |
  | `$lt`  | 匹配小于指定值的值。       |
  | `$lte` | 匹配小于或等于指定值的值。 |
  | `$ne`  | 匹配所有不等于指定值的值。 |
  | `$nin` | 不匹配数组中指定的任何值。 |

- 逻辑运算符

  | `$and` | 将查询子句与逻辑连接，并返回与这两个子句条件匹配的所有文档。 |
  | ------ | ------------------------------------------------------------ |
  | `$not` | 反转查询表达式的效果，并返回与查询表达式不匹配的文档。       |
  | `$nor` | 用逻辑NOR连接查询子句，返回所有不能匹配这两个子句的文档。    |
  | `$or`  | 用逻辑连接查询子句，或返回与任一子句条件匹配的所有文档。     |

#### 8.2.2 查询嵌套文档

##### 8.2.2.1 匹配嵌套文档

- 要在作为嵌入/嵌套文档的字段上指定相等条件，请使用查询过滤器文档 `{<field>: <value>}`，其中 `<value>` 是要匹配的文档。
- 整个嵌入式文档上的相等匹配要求与指定的 `<value>` 文档**完全匹配**，包括字段**顺序**。

```
db.inventory.find({
  size: { h: 14, w: 21, uom: "cm" }
})
```

##### 8.2.2.2 查询嵌套字段

1. 在嵌套字段上指定相等匹配

   ```
   db.inventory.find({
     "size.uom": "in"
   })
   ```

   - 择嵌套在 size 字段中的 uom 字段等于 `"in"`  的所有文档

2. 使用查询运算符指定匹配项

   ```
   db.inventory.find({
     "size.h": { $lt: 15 }
   })
   ```

   - 查询在 `size` 字段中嵌入的字段 `h` 上使用小于运算符 `$lt`

3. 指定 AND 条件

   ```
   db.inventory.find({
     "size.h": { $lt: 15 },
     "size.uom": "in",
     status: "D"
   })
   ```

   - 查询选择嵌套字段 `h` 小于 15，嵌套字段 `uom` 等于 `"in"`，状态字段等于 `"D"` 的所有文档

#### 8.2.3 查询数组

##### 8.2.3.1 数据准备

```
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
   { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
   { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
   { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
   { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] }
]);
```

##### 8.2.3.2 匹配一个数组

```
db.inventory.find({
  tags: ["red", "blank"]
})
```

```
// 1
{
    "_id": ObjectId("620e5bd262150000200041a3"),
    "item": "notebook",
    "qty": 50,
    "tags": [
        "red",
        "blank"
    ],
    "dim_cm": [
        14,
        21
    ]
}
```

- 字段标签值是按指定顺序恰好具有两个元素 `"red"` 和 `"blank"` 的数组

```
db.inventory.find({
  tags: { $all: ["red", "blank"] }
})
```

```
// 1
{
    "_id": ObjectId("620e5bd262150000200041a2"),
    "item": "journal",
    "qty": 25,
    "tags": [
        "blank",
        "red"
    ],
    "dim_cm": [
        14,
        21
    ]
}

// 2
{
    "_id": ObjectId("620e5bd262150000200041a3"),
    "item": "notebook",
    "qty": 50,
    "tags": [
        "red",
        "blank"
    ],
    "dim_cm": [
        14,
        21
    ]
}

// 3
{
    "_id": ObjectId("620e5bd262150000200041a4"),
    "item": "paper",
    "qty": 100,
    "tags": [
        "red",
        "blank",
        "plain"
    ],
    "dim_cm": [
        14,
        21
    ]
}

// 4
{
    "_id": ObjectId("620e5bd262150000200041a5"),
    "item": "planner",
    "qty": 75,
    "tags": [
        "blank",
        "red"
    ],
    "dim_cm": [
        22.85,
        30
    ]
}

```

- 不考虑顺序或数组中的其它元素，使用 $all

##### 8.2.3.3 查询数组中的元素

1. 查询数组字段是否包含至少一个具有指定值的元素：{<field>: <value>}

   ```
   db.inventory.find({
     tags: "red"
   })
   ```

   - 查询 tags 数组包含 red 的所有文档

   ```
   // 1
   {
       "_id": ObjectId("620e5bd262150000200041a2"),
       "item": "journal",
       "qty": 25,
       "tags": [
           "blank",
           "red"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   
   // 2
   {
       "_id": ObjectId("620e5bd262150000200041a3"),
       "item": "notebook",
       "qty": 50,
       "tags": [
           "red",
           "blank"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   
   // 3
   {
       "_id": ObjectId("620e5bd262150000200041a4"),
       "item": "paper",
       "qty": 100,
       "tags": [
           "red",
           "blank",
           "plain"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   
   // 4
   {
       "_id": ObjectId("620e5bd262150000200041a5"),
       "item": "planner",
       "qty": 75,
       "tags": [
           "blank",
           "red"
       ],
       "dim_cm": [
           22.85,
           30
       ]
   }
   
   ```

2. 在数组字段中的元素指定条件，在查询过滤器文档中使用查询运算符

   ```
   { <array field>: { <operator1>: <value1>, ... } }
   ```

   ```
   db.inventory.find({
     dim_cm: { $gt: 25 }
   })
   ```

##### 8.2.3.4 为数组元素指定多个条件

1. 使用数组元素上的复合过滤条件查询数组

   ```
   db.inventory.find( { dim_cm: { $gt: 15, $lt: 20 } } )
   ```

   -  一个元素可以满足大于 15 的条件，而另一个元素可以满足小于 20 的条件；或者单个元素可以满足以下两个条件
   - 14 < 20 , 21>15
   - 10<20, 15.5>15

   ```
   // 1
   {
       "_id": ObjectId("620e5bd262150000200041a2"),
       "item": "journal",
       "qty": 25,
       "tags": [
           "blank",
           "red"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   
   // 2
   {
       "_id": ObjectId("620e5bd262150000200041a3"),
       "item": "notebook",
       "qty": 50,
       "tags": [
           "red",
           "blank"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   
   // 3
   {
       "_id": ObjectId("620e5bd262150000200041a4"),
       "item": "paper",
       "qty": 100,
       "tags": [
           "red",
           "blank",
           "plain"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   
   // 4
   {
       "_id": ObjectId("620e5bd262150000200041a6"),
       "item": "postcard",
       "qty": 45,
       "tags": [
           "blue"
       ],
       "dim_cm": [
           10,
           15.25
       ]
   }
   
   ```

2. 查询满足多个条件的数组元素

   ```
   db.inventory.find({
     dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } }
   })
   ```

   - `dim_cm` 数组中包含至少一个同时 大于22  和 小于30 的元素的文档
   - 22.85 符合

   ```
   // 1
   {
       "_id": ObjectId("620e5bd262150000200041a5"),
       "item": "planner",
       "qty": 75,
       "tags": [
           "blank",
           "red"
       ],
       "dim_cm": [
           22.85,
           30
       ]
   }
   
   ```

   

3. 通过数组索引位置查询元素

   ```
   db.inventory.find( { "dim_cm.1": { $gt: 25 } } )
   ```

   -  查询数组 `dim_cm` 中第二个元素大于 25 的所有文档

   ```
   // 1
   {
       "_id": ObjectId("620e5bd262150000200041a5"),
       "item": "planner",
       "qty": 75,
       "tags": [
           "blank",
           "red"
       ],
       "dim_cm": [
           22.85,
           30
       ]
   }
   ```

4. 通过数组长度查询数组

   ```
   db.inventory.find( { "tags": { $size: 3 } } )
   ```

   - 选择数组标签具有3个元素的文档

   ```
   // 1
   {
       "_id": ObjectId("620e5bd262150000200041a4"),
       "item": "paper",
       "qty": 100,
       "tags": [
           "red",
           "blank",
           "plain"
       ],
       "dim_cm": [
           14,
           21
       ]
   }
   ```

   

#### 8.2.4 查询嵌入文档的数组

##### 8.2.4.1 数据准备

```
db.inventory.insertMany( [
   { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
   { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
   { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
   { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);
```

```
// 1
{
    "_id": ObjectId("620f433a72350000b4003a88"),
    "item": "journal",
    "instock": [
        {
            "warehouse": "A",
            "qty": 5
        },
        {
            "warehouse": "C",
            "qty": 15
        }
    ]
}

// 2
{
    "_id": ObjectId("620f433a72350000b4003a89"),
    "item": "notebook",
    "instock": [
        {
            "warehouse": "C",
            "qty": 5
        }
    ]
}

// 3
{
    "_id": ObjectId("620f433a72350000b4003a8a"),
    "item": "paper",
    "instock": [
        {
            "warehouse": "A",
            "qty": 60
        },
        {
            "warehouse": "B",
            "qty": 15
        }
    ]
}

// 4
{
    "_id": ObjectId("620f433a72350000b4003a8b"),
    "item": "planner",
    "instock": [
        {
            "warehouse": "A",
            "qty": 40
        },
        {
            "warehouse": "B",
            "qty": 5
        }
    ]
}

// 5
{
    "_id": ObjectId("620f433a72350000b4003a8c"),
    "item": "postcard",
    "instock": [
        {
            "warehouse": "B",
            "qty": 15
        },
        {
            "warehouse": "C",
            "qty": 35
        }
    ]
}
```

##### 8.2.4.2 查询嵌套在数组中的文档

```
db.inventory.find({
  "instock": { warehouse: "A", qty: 5 }
})
```

- 整个嵌入式/嵌套文档上的相等匹配要求与指定文档（包括字段顺序）完全匹配

```
// 1
{
    "_id": ObjectId("620f433a72350000b4003a88"),
    "item": "journal",
    "instock": [
        {
            "warehouse": "A",
            "qty": 5
        },
        {
            "warehouse": "C",
            "qty": 15
        }
    ]
}

```

##### 8.2.4.3 在文档中的字段上指定查询条件

- 在嵌入文档数组中的字段上指定查询条件
- 使用数组索引在嵌入式文档中查询字段



1. 在嵌入文档数组中的字段上指定查询条件

   ```
   db.inventory.find( { 'instock.qty': { $gte: 50 } } )
   ```

   - 如果不知道嵌套在数组中的文档的索引位置，使用（.）和嵌套文档中的字段名来链接数组字段的名称

   ```
   // 1
   {
       "_id": ObjectId("620f433a72350000b4003a8a"),
       "item": "paper",
       "instock": [
           {
               "warehouse": "A",
               "qty": 60
           },
           {
               "warehouse": "B",
               "qty": 15
           }
       ]
   }
   ```

2. 使用数组索引在嵌入式文档中查询字段

   ```
   db.inventory.find( { 'instock.1.qty': { $gte: 30 } } )
   ```

   ```
   // 1
   {
       "_id": ObjectId("620f433a72350000b4003a8c"),
       "item": "postcard",
       "instock": [
           {
               "warehouse": "B",
               "qty": 15
           },
           {
               "warehouse": "C",
               "qty": 35
           }
       ]
   }
   ```

##### 8.2.4.4 为文档数组指定多个条件

- 单个嵌套文档在嵌套字段上满足多个查询条件
- 元素组合满足标准



1. 单个嵌套文档在嵌套字段上满足多个查询条件

   ```
   db.inventory.find( { 'instock': { $elemMatch: {qty: 5, warehouse: "A"} } } )
   ```

   - instock 字段至少存在一项满足：{qty: 5, warehouse: "A"}, 即同时qty为5且warehouse为 A

   ```
   // 1
   {
       "_id": ObjectId("620f433a72350000b4003a88"),
       "item": "journal",
       "instock": [
           {
               "warehouse": "A",
               "qty": 5
           },
           {
               "warehouse": "C",
               "qty": 15
           }
       ]
   }
   ```

   ```
   db.inventory.find( { "instock": { $elemMatch: { qty: { $gt: 10, $lte: 20 } } } } )
   ```

   - 继续匹配使用 {},即存在一项满足qty大于10且小于等于20

   ```
   // 1
   {
       "_id": ObjectId("620f433a72350000b4003a88"),
       "item": "journal",
       "instock": [
           {
               "warehouse": "A",
               "qty": 5
           },
           {
               "warehouse": "C",
               "qty": 15
           }
       ]
   }
   
   // 2
   {
       "_id": ObjectId("620f433a72350000b4003a8a"),
       "item": "paper",
       "instock": [
           {
               "warehouse": "A",
               "qty": 60
           },
           {
               "warehouse": "B",
               "qty": 15
           }
       ]
   }
   
   // 3
   {
       "_id": ObjectId("620f433a72350000b4003a8c"),
       "item": "postcard",
       "instock": [
           {
               "warehouse": "B",
               "qty": 15
           },
           {
               "warehouse": "C",
               "qty": 35
           }
       ]
   }
   ```

2. 元素组合满足标准

   如果数组字段上的复合查询条件未使用$elemMath运算符，则查询将选择其数组包含满足条件的元素的任意组合的那些文档。

   ```
   db.inventory.find( { "instock.qty": {$gt: 30,  $lte: 10 } } )
   ```

   - 任意存在满足一个qty大于30另一个小于10或同时满足两个条件

   ```
   // 1
   {
       "_id": ObjectId("620f433a72350000b4003a8b"),
       "item": "planner",
       "instock": [
           {
               "warehouse": "A",
               "qty": 40
           },
           {
               "warehouse": "B",
               "qty": 5
           }
       ]
   }
   
   ```

#### 8.2.5 指定从查询返回的项目字段

##### 8.2.5.1 数据准备

```
db.inventory.insertMany( [
  { item: "journal", status: "A", size: { h: 14, w: 21, uom: "cm" }, instock: [ { warehouse: "A", qty: 5 } ] },
  { item: "notebook", status: "A",  size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "C", qty: 5 } ] },
  { item: "paper", status: "D", size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "A", qty: 60 } ] },
  { item: "planner", status: "D", size: { h: 22.85, w: 30, uom: "cm" }, instock: [ { warehouse: "A", qty: 40 } ] },
  { item: "postcard", status: "A", size: { h: 10, w: 15.25, uom: "cm" }, instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);
```

```
// 1
{
    "_id": ObjectId("620f550e72350000b4003a92"),
    "item": "journal",
    "status": "A",
    "size": {
        "h": 14,
        "w": 21,
        "uom": "cm"
    },
    "instock": [
        {
            "warehouse": "A",
            "qty": 5
        }
    ]
}

// 2
{
    "_id": ObjectId("620f550e72350000b4003a93"),
    "item": "notebook",
    "status": "A",
    "size": {
        "h": 8.5,
        "w": 11,
        "uom": "in"
    },
    "instock": [
        {
            "warehouse": "C",
            "qty": 5
        }
    ]
}

// 3
{
    "_id": ObjectId("620f550e72350000b4003a94"),
    "item": "paper",
    "status": "D",
    "size": {
        "h": 8.5,
        "w": 11,
        "uom": "in"
    },
    "instock": [
        {
            "warehouse": "A",
            "qty": 60
        }
    ]
}

// 4
{
    "_id": ObjectId("620f550e72350000b4003a95"),
    "item": "planner",
    "status": "D",
    "size": {
        "h": 22.85,
        "w": 30,
        "uom": "cm"
    },
    "instock": [
        {
            "warehouse": "A",
            "qty": 40
        }
    ]
}

// 5
{
    "_id": ObjectId("620f550e72350000b4003a96"),
    "item": "postcard",
    "status": "A",
    "size": {
        "h": 10,
        "w": 15.25,
        "uom": "cm"
    },
    "instock": [
        {
            "warehouse": "B",
            "qty": 15
        },
        {
            "warehouse": "C",
            "qty": 35
        }
    ]
}
```

##### 8.2.5.2 返回匹配文档中的所有字段

```
db.inventory.find( { status: "A" } )
```

##### 8.2.5.3 仅返回指定字段和_id字段

```
db.inventory.find({status: "D"}, {status: 1})
```

```
// 1
{
    "_id": ObjectId("620f550e72350000b4003a94"),
    "status": "D"
}

// 2
{
    "_id": ObjectId("620f550e72350000b4003a95"),
    "status": "D"
}
```

##### 8.2.5.4 禁止id字段

```
db.inventory.find({status: "D"}, {status: 1, _id: 0})
```

##### 8.2.5.5 返回所有但排除的字段

```
db.inventory.find( { status: "D" }, { status: 0, instock: 0 } )
```

##### 8.2.5.6 返回嵌入式文档中的特定字段

```
db.inventory.find(
   { status: "D" },
   { item: 1, status: 1, "size.uom": 1 }
)
```

```
// 1
{
    "_id": ObjectId("620f550e72350000b4003a94"),
    "item": "paper",
    "status": "D",
    "size": {
        "uom": "in"
    }
}

// 2
{
    "_id": ObjectId("620f550e72350000b4003a95"),
    "item": "planner",
    "status": "D",
    "size": {
        "uom": "cm"
    }
}

```

##### 8.2.5.7 禁止嵌入文档中的特定字段

```
db.inventory.find(
   { status: "D" },
   { "size.uom": 0,"instock.qty": 0 }
)
```

- 禁止size的uom
- 禁止instock的qty

##### 8.2.5.8 返回数组中的项目特定元素

```
db.inventory.find( { status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } } )
```

- 使用 $slice 投影运算符返回库存数组中的最后一个元素

```
// 1
{
    "_id": ObjectId("620f550e72350000b4003a92"),
    "item": "journal",
    "status": "A",
    "instock": [
        {
            "warehouse": "A",
            "qty": 5
        }
    ]
}

// 2
{
    "_id": ObjectId("620f550e72350000b4003a93"),
    "item": "notebook",
    "status": "A",
    "instock": [
        {
            "warehouse": "C",
            "qty": 5
        }
    ]
}

// 3
{
    "_id": ObjectId("620f550e72350000b4003a96"),
    "item": "postcard",
    "status": "A",
    "instock": [
        {
            "warehouse": "C",
            "qty": 35
        }
    ]
}
```

#### 8.2.6 查询空字段或缺少字段

##### 8.2.6.1 数据准备

```
db.inventory.insertMany([
   { _id: 1, item: null },
   { _id: 2 }
])
```

##### 8.2.6.2 查询空字段或缺少字段

- 相等过滤器
- 类型检查
- 存在检查



1. 相等过滤器

   ```
   db.inventory.find( { item: null } )
   ```

   - `{item: null}` 查询将匹配包含其值为 `null` 的 `item` 字段或不包含 `item` 字段的文档。

   ```
   // 1
   {
       "_id": 1,
       "item": null
   }
   
   // 2
   {
       "_id": 2
   }
   ```

   

2. 类型检查

   ```
   db.inventory.find( { item : { $type: 10 } } )
   ```

   - `{ item: { $type: 10 } }` 查询仅匹配包含 `item` 字段，其值为 `null` 的文档；
   - 即 `item` 字段的值为 BSON 类型为 Null（类型编号10）

   ```
   // 1
   {
       "_id": 1,
       "item": null
   }
   ```

3. 存在检查

   ```
   db.inventory.find( { item : { $exists: false } } )
   ```

   - 查询不包含字段的文档

   ```
   // 1
   {
       "_id": 2
   }
   ```

### 8.3 更新文档

- `db.collection.updateOne(<filter>, <update>, <options>)`
- `db.collection.updateMany(<filter>, <update>, <options>)`

- `db.collection.replaceOne(<filter>, <update>, <options>)`
- https://docs.mongodb.com/manual/reference/method/js-collection/

![image-20220213220847809](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-18_17-37-56.png)

#### 8.3.1 数据准备

```
db.inventory.insertMany( [
   { item: "canvas", qty: 100, size: { h: 28, w: 35.5, uom: "cm" }, status: "A" },
   { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
   { item: "mat", qty: 85, size: { h: 27.9, w: 35.5, uom: "cm" }, status: "A" },
   { item: "mousepad", qty: 25, size: { h: 19, w: 22.85, uom: "cm" }, status: "P" },
   { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
   { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
   { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
   { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
   { item: "sketchbook", qty: 80, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
   { item: "sketch pad", qty: 95, size: { h: 22.85, w: 30.5, uom: "cm" }, status: "A" }
] );
```

#### 8.3.2 语法

为了更新文档，MongoDB 提供了更新操作符（例如 `$set`）来修改字段值

```
{
  <update operator>: { <field1>: <value1>, ... },
  <update operator>: { <field2>: <value2>, ... },
  ...
}
```

#### 8.3.3 更新单个文档

```
db.inventory.updateOne(
   { item: "paper" },
   {
     $set: { "size.uom": "cm", status: "P" },
     $currentDate: { lastModified: true }
   }
)
```

- 更新item字段为paper 的第一个文档
- 更新操作
  - 使用 `$set` 运算符将 `size.uom` 字段的值更新为 `cm`，将状态字段的值更新为 `P`
  - 使用 `$currentDate` 运算符将 `lastModified` 字段的值更新为当前日期。如果 `lastModified` 字段不存在，则 `$currentDate` 将创建该字段。

#### 8.3.4 更新多个文档

```
db.inventory.updateMany(
   { "qty": { $lt: 50 } },
   {
     $set: { "size.uom": "in", status: "P" },
     $currentDate: { lastModified: true }
   }
)
```

- 使用 `db.collection.updateMany()` 方法来更新数量小于50的所有文档
- 更新操作
  - 使用 $set 运算符将 size.uom 字段的值更新为 `"in"`，将状态字段的值更新为 `"p"`
  - 使用 `$currentDate` 运算符将 `lastModified` 字段的值更新为当前日期。如果 `lastModified` 字段不存在，则 `$currentDate` 将创建该字段。

#### 8.3.5 替换文档

```
db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
```

- 替换文档时，替换文档必须仅由字段/值对组成；即不包含更新运算符表达式。
- 替换文档可以具有与原始文档不同的字段。
- 在替换文档中，由于 `_id` 字段是不可变的，因此可以省略 `_id` 字段；但是，如果您确实包含 `_id` 字段，则它必须与当前值具有相同的值。

### 8.4 删除文档

- `db.collection.deleteMany()`
- `db.collection.deleteOne()`

![image-20220213220847809](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-18_19-16-00.png))

#### 8.4.1 数据准备

```
db.inventory.insertMany( [
   { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
   { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
   { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
   { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
   { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
] );
```

#### 8.4.2 删除所有符合条件的文档

```
db.inventory.deleteMany({ status : "A" })
```

```
// 1
{
    "acknowledged": true,
    "deletedCount": 2
}
```

#### 8.4.3 仅删除1个符合条件的文档

```
db.inventory.deleteOne( { status: "D" } )
```

