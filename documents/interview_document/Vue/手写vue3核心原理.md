## vue3整体架构

![introduce.bc2c2816](手写vue3核心原理.assets/introduce.bc2c2816.png)

## 环境搭建

### 安装依赖

```
yarn add typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-json @rollup/plugin-commonjs minimist execa@4 --ignore-workspace-root-check
```

|            依赖             |           作用            |
| :-------------------------: | :-----------------------: |
|         typescript          |  在项目中支持Typescript   |
|           rollup            |         打包工具          |
|  rollup-plugin-typescript2  |    rollup 和 ts的 桥梁    |
|     @rollup/plugin-json     |       支持引入json        |
| @rollup/plugin-node-resolve |    解析node第三方模块     |
|   @rollup/plugin-commonjs   | 将CommonJS转化为ES6Module |
|          minimist           |      命令行参数解析       |
|           execa@4           |        开启子进程         |

### monorepo

```
yarn workspace @vue/reactivity add @vue/shared@1.0.0
```

