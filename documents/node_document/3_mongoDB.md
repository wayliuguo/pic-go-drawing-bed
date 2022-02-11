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