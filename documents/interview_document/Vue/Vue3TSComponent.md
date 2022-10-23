# 一、搭建monorepo环境

## 1.pnpm 与 初始化

使⽤pnpm安装包速度快，磁盘空间利⽤率⾼效，使⽤pnpm 可以快速建⽴monorepo，so ~ 这⾥我们使⽤pnpm workspace来实现monorepo

```
npm i pnpm -g // 全局安装pnpm
pnpm init // 初始化package.json配置⽂件 私有库
pnpm install vue typescript -D // 全局下添加依赖
```

只有package.json 中依赖声明了的vue与typescript会在node_modules的根目录下，其余的在 .pnpm目录下。

![image-20221020235626892](Vue3TSComponent.assets/image-20221020235626892.png)

使⽤pnpm必须要建⽴.npmrc⽂件，shamefully-hoist = true，否则安装的模块⽆法放置到node_modules⽬录下

**.npmrc**

```
shamefully-hoist = true
```

![image-20221021000700559](Vue3TSComponent.assets/image-20221021000700559.png)

**初始化typescript**

```
pnpm tsc --init
```

```
{
  "compilerOptions": {
    "module": "ESNext", // 打包模块类型ESNext
    "declaration": false, // 默认不要声明文件 
    "noImplicitAny": true, // 支持类型不标注可以默认any
    "removeComments": true, // 删除注释
    "moduleResolution": "node", // 按照node模块来解析
    "esModuleInterop": true, // 支持es6,commonjs模块
    "jsx": "preserve", // jsx 不转
    "noLib": false, // 不处理类库
    "target": "es6", // 遵循es6版本
    "sourceMap": true,
    "lib": [ // 编译时用的库
      "ESNext",
      "DOM"
    ],
    "allowSyntheticDefaultImports": true, // 允许没有导出的模块中导入
    "experimentalDecorators": true, // 装饰器语法
    "forceConsistentCasingInFileNames": true, // 强制区分大小写
    "resolveJsonModule": true, // 解析json模块
    "strict": true, // 是否启动严格模式
    "skipLibCheck": true // 跳过类库检测
  },
  "exclude": [ // 排除掉哪些类库
    "node_modules",
    "**/__tests__",
    "dist/**"
  ]
}
```

## 2.pnpm monorepo 配置

### **pnpm-workspace.yaml**

通过创建workspace 将多个项目合并要一个仓库中，每个仓库的根目录需要配置**package.json**

```
packages:
  - play # 存放我们组件测试的时候的代码
  - docs # 存放我们组件文档的
  - "packages/**"
```

![image-20221021004758572](Vue3TSComponent.assets/image-20221021004758572.png)

- components/package.json

  ```json
  {
    "name": "@zi-shui/components",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  ```

- theme-chalk/package.json

  ```json
  {
    "name": "@zi-shui/theme-chalk",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  ```

- utils/package.json

  ```json
  {
    "name": "@zi-shui/utils",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  ```

### 安装到根目录

```
npm install @zi-shui/components -w
pnpm install @zi-shui/theme-chalk -w
pnpm install @zi-shui/utils -w 
```

- -w: 代表安装到工作区根目录

- vue3-component

  ```
  {
    "name": "vue3-component",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "typescript": "^4.8.4",
      "vue": "^3.2.41"
    },
    "dependencies": {
      "@zi-shui/components": "workspace:^1.0.0",
      "@zi-shui/theme-chalk": "workspace:^1.0.0",
      "@zi-shui/utils": "workspace:^1.0.0"
    }
  }
  ```

  依赖中成功引入了进来

### 总结

- vue3-componet 下管理了三个项目
  - docs
  - play
  - packages
- packages 下管理了三个项目
  - components
  - theme-chalk
  - utils

# 二、实现组件play环境

- vue3-component

  ```
  pnpm create vite play --template vue-ts
  ```

- vue3-component/play/vite-env.d.ts

  ```
  /// <reference types="vite/client" />
  
  declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  ```

  - /// + reference 引入外部依赖的声明
  - .vue 文件智能提示

- vue3-component/typings/vue-shim.d.ts

  ```
  declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  ```

- vue3-component/package.json

  ```
  "scripts": {
    "dev": "pnpm -C play dev"
  }
  ```

  - 运行 play 目录下的  dev 脚本

# 三、通过JS实现BEM规范

## 什么是BEM规范

即Block(块) Element(元素) Modifier(修饰器)，用来规范css命名

命名约定模式如下：

```
.block{}
.block__element{}
.block__element--modifier{}
```

对于块，若多个单词，则用 - 连接，如search-form

具体例子：

- 块即模块，如搜索表单 search-form,可以看做一个块
- 这个块内的按钮button、输入框input，为元素
- 元素可以由多种状态，如居中按钮，即修饰

```
<form class="search-form">
	<input class="search-form__input" />
	<button class="search-form__button"></button>
	<button class="search-form__button__primary"></button>
</form>
```

## css样式顺序

1. 定位属性：positon display float left top right bottom overflow clear z-index
2. 自身属性：width height margin padding border background
3. 文字样式：font-family font-size font-style font-weight font-varient
4. 文本属性：text-align vertical-align text-wrap text-transform text-indent text-decoration letter-spacing word-spacing white-space text-overflow
5. css3中新增属性：content box-shadow border-radius transform

## BEM

- vue3-component/packages/utils/create.ts

```
// block 代码块   element 元素   modifier 装饰  state 状态
// z-button
// z-button__element
// z-button__element--disabled
// is-checked is-enabeld

// :class=[bem.b()]

// 前缀名字   z-button-box__element--modifier
function _bem(
    prefixName: string,
    blockSuffix: string,
    element: string,
    modifier: string
) {
    if (blockSuffix) {
        prefixName += `-${blockSuffix}`;
    }
    if (element) {
        prefixName += `__${element}`;
    }
    if (modifier) {
        prefixName += `--${modifier}`;
    }
    return prefixName;
}

function createBEM(prefixName: string) {
    const b = (blockSuffix: string = "") => _bem(prefixName, blockSuffix, "", "");
    const e = (element: string = "") =>
        element ? _bem(prefixName, "", element, "") : "";
    const m = (modifier: string = "") =>
        modifier ? _bem(prefixName, "", "", modifier) : "";

    const be = (blockSuffix: string = "", element: string = "") =>
        blockSuffix && element ? _bem(prefixName, blockSuffix, element, "") : "";
    const bm = (blockSuffix: string = "", modifier: string = "") =>
        blockSuffix && modifier ? _bem(prefixName, blockSuffix, "", modifier) : "";
    const em = (element: string = "", modifier: string = "") =>
        element && modifier ? _bem(prefixName, "", element, modifier) : "";
    const bem = (
        blockSuffix: string = "",
        element: string = "",
        modifier: string = ""
    ) =>
        blockSuffix && element && modifier
            ? _bem(prefixName, blockSuffix, element, modifier)
            : "";

    const is = (name: string, state: string | boolean) => (state ? `is-${name}` : "");
    return {
        b,
        e,
        m,
        be,
        bm,
        em,
        bem,
        is
    };
}

export function createNamespace(name: string) {
    const prefixName = `z-${name}`;
    return createBEM(prefixName);
}

/* const bem = createNamespace("icon");
console.log(bem.b("box"));
console.log(bem.e('element'));
console.log(bem.m('modifier'));
console.log(bem.bem('box', 'element', 'modifier'));
console.log(bem.is('checked', true));
console.log(bem.be('box', 'element'));
console.log(bem.bm('box', 'modifier'));
console.log(bem.em('element', 'modifier')); */
```

# 四、实现icon组件

## 初步实现

- packages/components/icon/src/icon.ts

  ```
  // 这里面准备组件相关的属性 和 ts的类型
  
  import {ExtractPropTypes, PropType} from 'vue'
  
  export const iconProps = {
      color:String,
      size: [Number, String] as PropType<number | string>
  } as const;
  
  export type IconProps = ExtractPropTypes<typeof iconProps>;
  ```

- packages/components/icon/src/icon.vue

  ```
  <template>
      <i :class="bem.b()" :style="style">
          <slot></slot>
      </i>
  </template>
  
  <script setup lang="ts">
  import { computed } from '@vue/reactivity';
  import { createNamespace } from '@zi-shui/utils/create'
  import { iconProps } from './icon';
  
  const bem = createNamespace('icon')
  //  使用defineProps获取 props
  const props = defineProps(iconProps)
  
  // 计算属性 来计算一个样式处理
  const style = computed(() => {
      if (!props.size && !props.color) return {}
      return {
          ...(props.size ? { "font-size": props.size + "px" } : {}),
          ...(props.color ? { "color": props.color } : {})
      }
  })
  
  </script>
  ```

## 初步使用

- packages/play/src/App.vue

  ```
  <script setup lang="ts">
  import Icon from '@zi-shui/components/icon/src/icon.vue'
  
  console.log(Icon)
  </script>
  
  <template>
      <Icon :size="12" color="red"></Icon>
  </template>
  
  <style scoped>
  </style>
  ```

![image-20221023212553704](Vue3TSComponent.assets/image-20221023212553704.png)

**缺点：**

- 这里是引入文件，如果需要全部注册呢？
- 通过打印发现，由于在组件里setup语法糖的形式，没有组件名称

## 生成组件名称

1. 非插件方式（packages/components/icon/src/icon.vue）

   ```
   ...
   <script lang="ts">
   export default {
       name: 'ZIcon'
   }
   </script>
   ...
   ```

   ![image-20221023213343758](Vue3TSComponent.assets/image-20221023213343758.png)

2. 插件方式

   ```
   pnpm install unplugin-vue-define-options -D -w
   ```

   - 开发依赖
   - -w: 整个工作区都可以用
   - 通过这个插件，可以在<script setup> 中使用 Options API，尤其能够在一个函数中设置 `name`、`props`、`emit` 和 `render` 属性
   - https://github.com/sxzz/unplugin-vue-macros/blob/HEAD/packages/define-options/README-zh-CN.md

   - vite.config.ts

     ```
     import { defineConfig } from 'vite'
     import vue from '@vitejs/plugin-vue'
     import DefineOptions from 'unplugin-vue-define-options/vite'
     
     // https://vitejs.dev/config/
     export default defineConfig({
       plugins: [vue(), DefineOptions()]
     })
     ```

   - packages/components/icon/src/icon.vue

     ```
     ...
     // 定义组件名称
     defineOptions({
         name: 'z-icon'
     })
     ...
     ```

   - packages/utils/with-install.ts

     ```
     import { Plugin } from 'vue'
     export type SFCWithInstall<T> = T & Plugin;
     export function withInstall<T>(comp: T) {
         (comp as SFCWithInstall<T>).install = function (app) {
             const { name } = comp as unknown as { name: string }
             app.component(name, comp); // 将组件注册成全局的组件
         }
         return comp as SFCWithInstall<T>
     }
     ```

     - 导出一个 widthInstall
     - widthInstall 里有一个 install 方法（配合 Plugin use 的时候执行），在这个方法里进行组件的全局注册

   - packages/components/icon/index.ts

     ```
     // 用来整合组件的 最终实现导出组件
     
     import _Icon from "./src/icon.vue";
     import { withInstall } from "@zi-shui/utils/with-install"
     
     const Icon = withInstall(_Icon);
     
     export default Icon; // 可以通过app.use来使用 也可以通过 import方式单独使用
     
     export * from "./src/icon";
     
     
     // 这里添加的类型 可以再模版中被解析
     declare module 'vue'{
         export interface GlobalComponents { // 我们的接口可以自动合并
             ZIcon:typeof Icon
         }
     }
     ```

     - 导入 icon.vue, 通过 withInstall给 icon 组件添加 install 方法，配合 Plugin.use() 使用
     - 配合volar声明以给组件类型标注

   - packages/play/src/main.ts

     ```
     import { createApp } from 'vue'
     import './style.css'
     import App from './App.vue'
     import Icon from '@zi-shui/components/icon'
     
     const plugins = [
         Icon
     ]
     const app = createApp(App)
     plugins.forEach(plugin => app.use(plugin)) // 将组件注册成了全局组件，可以直接使用了
     
     app.mount('#app')
     ```

     - 引入 Icon，此时的 Icon 有 install 方法
     - 将组件注册成全局组件 
