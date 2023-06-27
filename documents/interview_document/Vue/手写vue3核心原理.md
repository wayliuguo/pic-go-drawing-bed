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

## Reactive

- reactive: 深层响应式代理。
- shallowReactive：浅层响应式代理，只有根属性具有响应式。
- readonly: 深层只读代理。
- shallowReadonly：浅层只读代理，只有根属性只读。

### shared

- isObject
- extend

```
export const isObject = (value: unknown):boolean => typeof value === "object" && value !== null;

export const extend = Object.assign
```

### reactive

#### index.ts

- 导出 reactive、shallowReactive、readonly、shallowReadonly

```
export {
    reactive,
    shallowReactive,
    readonly,
    shallowReadonly
} from './reactive'
```

#### reactive.ts

- 通过`createReactiveObject` 柯里化通过配置结合Proxy生成代理对象并返回代理对象。
  - target：目标对象。
  - isReadonly：通过这个区分使用不同的缓存对象。
  - baseHandlers：配置 Proxy 的 getter setter。
- 使用WeakMap 会自动垃圾回收，不会造成内存泄漏，存储的key只能是对象。
- 剩下的看 baseHandlers，这个在调用 createReactiveObject 时传入，具体看 baseHandlers.ts。

```
import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

// 代理缓存
// WeakMap 会自动垃圾回收，不会造成内存泄漏，存储的key只能是对象
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();

/**
 * 柯里化 new Proxy() 最核心的需要拦截
 * @param target 目标对象
 * @param isReadonly boolean  是不是仅读
 * @param baseHandlers
 */
export function createReactiveObject(
  target: object,
  isReadonly: boolean,
  baseHandlers: object
) {
  // 如果目标不是对象，没法拦截了 reactive 这个 api 只能拦截对象
  if (!isObject(target)) return target;

  // 使用 proxy 代理, 将要代理的对象合对应的结果进行缓存
  // 如果某个对象已经代理过了，就不要再次代理
  // 可能一个对象 被代理是深度的 又被仅读代理了
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existProxy = proxyMap.get(target);
  // 如果已经被代理了直接返回即可
  if (existProxy) return existProxy;
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);

  return proxy;
}
```

####  baseHandlers.ts

- createGetter：通过配置生成不同的`getter`函数。
  - isReadonly: 是否仅读。
  - shallow: 是否浅层代理。
  - 使用`Reflect`反射获取值。
  - 如果是非仅读的，进行依赖收集，等会数据变化后更新对应视图。
  - 如果是浅层的直接返回值。
  - 如果是对象，则进行递归代理（vue2是初始化就直接递归代理，vue3是取值时会进行代理（懒代理））。
- createSetter
  - 使用`Reflect`反射设置值并返回boolean标识是否设置成功。
- Relect 的优点
  - 后续Object的方法属性会往Reflect迁移。
  - 如果用target[key] = value 方式设置值可能会失败，并不会报异常，也没有返回值标识。
  - Reflect 方法具备返回值,判断是否设置成功。
- readonlyObj
  - 用于readonly 的 setter。

```
import { extend, isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";

// Relect 的优点
// 1.后续Object的方法属性会往Reflect迁移
// 2.如果用target[key] = value 方式设置值可能会失败，并不会报异常，也没有返回值标识
// 2.Reflect 方法具备返回值

// 是否是仅读的，是的话set时会报异常
// 是否是深度的
function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
  // target: 目标对象 key: 属性名 receiver: Proxy
  return function get(target, key, receiver) {
    // 使用 reflect获取结果
    // target: 需要取值的目标对象 key: 需要获取的值的键值 receiver: 如果target对象中指定了getter，receiver则为getter调用时的this值
    // 相当于 target[key]
    const res = Reflect.get(target, key, receiver);

    // 如果是非仅读的，进行依赖收集，等会数据变化后更新对应视图
    if (!isReadonly) {
    }

    // 如果是浅层的
    if (shallow) return res;
    // vue2是初始化就直接递归代理，vue3是取值时会进行代理（懒代理）
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter(isShallow: boolean = false) {
  // target: 目标对象 key: 属性名 value: 新属性值 receiver: Proxy
  return function set(target, key, value, receiver) {
    // target: 需要取值的目标对象 key: 需要获取的值的键值 value: 设置的值 receiver: 如果target对象中指定了getter，receiver则为getter调用时的this值
    const result = Reflect.set(target, key, value, receiver);
    return result;
  };
}

// 生成 getter
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 生成 setter
const set = createSetter();
const shallowSet = createSetter(true);

// readonly Setter
const readonlyObj = {
  set: (target, key) => {
    console.warn(`set ${target} on key ${key} failed`);
  },
};

export const mutableHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};
export const readonlyHandlers = extend({
  get: readonlyGet
}, readonlyObj);
export const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet,
}, readonlyObj);

```

#### 1.reactive.html

```
<script>
  let { reactive, shallowReactive, readonly, shallowReadonly } = VueReactivity
  let stateReactive = reactive({
      name: 'well',
      info: {
          age: 18
      }
  })
        
  let stateShallowReactive = shallowReactive({
      name: 'well',
      info: {
          age: 18
      }
  })

  let stateReadonly = readonly({
      name: 'well',
      info: {
          age: 18
      }
  })
        
  let stateShallowReadonly = shallowReadonly({
      name: 'well',
      info: {
          age: 18
      }
  })

  //  reactive
  stateReactive.info.age = 80
  stateReactive.name = 'wellReactive'
  console.log('reactive', stateReactive.info, stateReactive.name)

  //  shallowReactive
  stateShallowReactive.name = 'wellShallowReactive'
  stateShallowReactive.info.age = 80
  console.log('shallowReactive', stateShallowReactive.info, stateShallowReactiname)

  // shallowReadonly
  stateShallowReadonly.name = 'wellShallowReadonly'
  stateShallowReadonly.info.age = 80
  console.log('shallowReadonly', stateShallowReadonly.info, stateShallowReadonname)

  // readonly
  stateReadonly.name = 'wellReadonly'
  stateReadonly.info.age = 80
  console.log('readonly', stateReadonly.info, stateReadonly.name)
</script>
```

