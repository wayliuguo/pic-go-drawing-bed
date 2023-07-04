## vue

### 1.vue2运行机制

![mini-vue2 运行机制](Vue.assets/mini-vue2 运行机制.png)



1. initData: 遍历data属性，如果是数组或对象则递归遍历，对每个属性使用Object.defineProperty，同时生成一个dep实例，用于收集依赖与触发更新。
2. initWatcher: 遍历new Watcher,pushTarget(Dep.target 记录当前watcher，state记录watcher栈)，call 被监听属性，触发getter。
   1. dep depend: dep.depend =》Dep.target.addDep(this) 调用当前watcher的addDep
   2.  watcher addDep: this.deps.push(dep) 往deps 存储dep，调用dep.addSub(this) 
   3. dep addSub: 往subs 存储 watcher
3. 模板解析：解析html模板，生成AST语法树=》生成渲染函数。
4. 组件挂载：new Watcher, 记录渲染watcher，执行渲染函数生成vnode,通过vnode的patch生成元素并挂载。
5. 当第一次渲染后，如果修改了值，则会触发setter=》dep.notify => 把subs 中的每一个watcher 执行 update =》收集watcher 队列，nextTick 中 执行watcher.run 触发重新render与patch。

## 2.双向绑定原理
