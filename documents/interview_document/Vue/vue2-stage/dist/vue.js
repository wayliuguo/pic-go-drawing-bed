(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function isFunction (val) {
        return typeof val === 'function'
    }

    function isObject (val) {
        return typeof val === 'object' && val !== null
    }

    const LIFECYCLE_HOOKS = [
        'beforeCreate',
        'created',
        'beforeMount',
        'mounted',
        'beforeUpdate',
        'updated',
        'beforeDestroy',
        'destroyed'
    ];

    const starts = {};
    function mergeHook(parentVal, childVal) {
        if (childVal) {
            if (parentVal) {
                return parentVal.concat(childVal)
            } else {
                return [childVal]
            }
        } else {
            return parentVal
        }
    }
    LIFECYCLE_HOOKS.forEach(hook => {
        starts[hook] = mergeHook;
    });

    starts.components = function (parentVal, childVal) {
        let options = Object.create(parentVal);
        if (childVal) {
            for (let key in childVal) {
                options[key] = childVal[key];
            }
        }
        return options
    };

    function mergeOptions(parent, child) {
        // 合并后的结果
        const options = {};
        for (let key in parent) {
            mergeFiled(key);
        }
        for (let key in child) {
            if (!parent.hasOwnProperty(key)) {
                mergeFiled(key);
            }
        }
        function mergeFiled(key) {
            // 使用策略模式处理钩子
            if (starts[key]) {
                options[key] = starts[key](parent[key], child[key]);
            } else {
                if (isObject(parent[key]) && isObject(child[key])) {
                    options[key] = {
                        ...parent[key],
                        ...child[key]
                    };
                } else {
                    options[key] = child[key] || parent[key];
                }
            }
        }
        return options
    }


    function makeMap(str) {
        const map = {};
        const list = str.split(',');
        for (let i=0; i<list.length; i++) {
            map[list[i]] = true;
        }
        return (key) => map[key]
    }

    const isReservedTag = makeMap(
        'a,div,img,image,text,span,input,p,button,ul,li'
    );

    function initGlobalApi(Vue) {
        // 用来存放全局的配置，每个组件初始化的时候都会和options选项进行合并
        // 如 Vue.component Vue.filter Vue.directive
        Vue.options = {};
        
        Vue.mixin = function (options) {
            this.options = mergeOptions(this.options, options);
            console.log('>>>options', this.options);
            return this
        };

        Vue.options.components = {};
        Vue.options._base = Vue;
        let cid = 0;
        Vue.component = function(id, definition) {
            definition.name = definition.name || id;
            // 保证组件的隔离，每个组件都会产生一个新的类，去继承父类
            definition = this.options._base.extend(definition);
            this.options['components'][id] = definition;
        };
        // 创建一个子类，继承于Vue，并返回这个类
        Vue.extend = function (extendOptions) {
            const Super = this;
            const Sub = function VueComponent(options) {
                this._init(options);
            };
            Sub.cid = cid++;
            // 原型继承
            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.options = mergeOptions(
                Super.options,
                extendOptions
            );
            return Sub
        };
    }

    // arrayMethods.__proto__ = Array.prototype
    let oldArrayProrotype = Array.prototype;
    let arrayMethods = Object.create(oldArrayProrotype);

    let methods = [
        'push',
        'shift',
        'unshift',
        'pop',
        'reverse',
        'sort',
        'splice'
    ];

    methods.forEach(method => {
        // 用户调用的，如果是以上七个方法，则使用自己重写的，否则用原来的数组方法
        arrayMethods[method] = function (...args) {
            // vm.name.push(×××), 则this表示vm
            oldArrayProrotype[method].call(this, ...args);
            // 新增的内容
            let inserted;
            // 根据当前数组获取到observe实例
            let ob = this.__ob__;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break
                case 'splice':
                    inserted = args.splice(2);
                    break
            }
            // 如果有新增的内容要进行继续劫持
            if (inserted) {
                ob.observeArray(inserted);
            }
            // 数组的observer.dep 数组
            ob.dep.notify();
        };
    });

    // 每个属性都分配一份dep,
    // dep 可以用来存放watcher
    // watcher 中还要存放这个dep

    let id$1 = 0;
    class Dep {
        constructor () {
            this.id = id$1++;
            this.subs = []; // 存放watcher
        }
        // 让Watcher实例存放dep
        depend () {
            // Dep.target 就是Watcher
            if (Dep.target) {
                Dep.target.addDep(this); // 让Watcher 去存放dep
            }
        }
        // dep 实例存放 watcher 实例
        addSub(watcher) {
            this.subs.push(watcher);
        }
        // 通知关联的每一个watcher更新
        notify() {
            this.subs.forEach(watcher => watcher.update());
        }
    }

    Dep.target = null;

    let stack = [];

    function pushTarget(watcher) {
        Dep.target = watcher;
        stack.push(watcher);
        console.log('>>>stack', stack);
    }

    function popTarget() {
        stack.pop();
        Dep.target = stack[stack.length - 1];
    }

    // 如果给对象新增一个属性不会触发视图更新（需要用$set）
    // 给对象本身也增加一个dep进行存储watcher，如果增加一个属性手动的触发watcher的更新
    class Observer {
        // 对对象中的所有属性进行劫持
        constructor (data) {
            // 数据可能使数组或者对象
            this.dep = new Dep();
            // 使__ob__属性不可枚举，如果不这么做，data会一直是一个对象，则溢栈
            // 这里把__ob__挂载在实例上，同时此属性不可枚举
            Object.defineProperty(data, '__ob__', {
                value: this,
                enumerable: false
            });
            // 如果是数组，则进行数组劫持的逻辑
            // 对数组原来的方法进行改写
            if (Array.isArray(data)) {
                data.__proto__ = arrayMethods;
                // 如果数组中的数据是对象类型，需要监控对象的变化
                this.observeArray(data);
            } else {
                this.walk(data);
            }
        }
        observeArray(data) {
            // 对数组中的数组 数组中的对象再次劫持
            data.forEach(item => {
                observe(item);
            });
        }
        walk(data) {
            Object.keys(data).forEach(key => {
                defineReactive(data, key, data[key]);
            });
        }
    }

    function dependArray (value) {
        for (let i=0; i<value.length; i++) {
            let current = value[i];
            // current 是数组里面的数组
            current.__ob__ && current.__ob__.dep.depend();
            if (Array.isArray(current)) {
                // 取外层数组要将数组里面的也进行依赖收集
                dependArray(current);
            }
        }
    }

    // vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
    function defineReactive(data, key, value) {
        // 如果value是一个对象，则继续递归进行劫持
        let childOb = observe(value); 
        // 每个属性都有一个dep属性
        // 创建dep实例，下面的setter和getter可以通过闭包访问到
        let dep = new Dep();
        Object.defineProperty(data, key, {
            get() {
                console.log('>>>dep', dep, key);
                // 取值时将watcher和dep对应起来
                if (Dep.target) {
                    // 收集依赖
                    dep.depend();
                    // childOb 可能是数组或者对象，后续写$set方法需要触发他自己的更新
                    if (childOb) {
                        // 让数组和对象也记录watcher
                        childOb.dep.depend();
                        if (Array.isArray(value)) {
                            dependArray(value);
                        }
                    }
                }
                return value
            },
            set(newV) {
                // 如果用户赋值一个新对象，需要将这个对象进行劫持

                // 如果新旧值相同则return
                if (newV === value) return 
                observe(newV);
                value = newV;
                dep.notify(); // 通知渲染Watcher 去更新
            }
        });
    }

    function observe(data) {
        // 如果是对象才观察（省略对数组进行处理）
        if (!isObject(data)) {
            return
        }
        // 如果已经被观察过了则不需再观察
        if (data.__ob__) {
            return __ob__
        }
        // 默认最外层 data 必须是一个对象
        return new Observer(data)
    }

    let callbacks = [];

    function flushCallbacks () {
        callbacks.forEach(cb => cb());
    }

    let timerFunc;
    let waiting = false;
    if (Promise) {
        timerFunc = () => {
            Promise.resolve().then(flushCallbacks);
        };
    } else if (MutationObserver) {
        let observe = new MutationObserver(flushCallbacks);
        let textNode = document.createTextNode(1);
        observe.observe(textNode, {
            characterData: true
        });
        timerFunc = () => {
            textNode.textContent = 2;
        };
    } else if (setImmediate) {
        timerFunc = () => {
            setImmediate(flushCallbacks);
        };
    } else {
        timerFunc = () => {
            setTimeout(flushCallbacks, 0);
        };
    }

    function nextTick (cb) {
        callbacks.push(cb);
        if (!waiting) {
            timerFunc();
            waiting = true;
        }
    }

    let queue = [];
    let has = {}; // 做列表的 列表维护存放了哪些watcher

    function flushSchedulerQueue () {
        for (let i=0; i<queue.length; i++) {
            let watcher = queue[i];
            watcher.run();
        }
        queue = [];
        has = {};
    }

    let pending = false;
    function queueWatcher (watcher) {
        const id = watcher.id;
        if (has[id] == null) {
            has[id] = true;
            queue.push(watcher);
            // 开启一次更新操作，批处理
            if (!pending) {
                nextTick(flushSchedulerQueue);
                pending = true;
            }
        }
    }

    let id = 0;
    class Watcher {
        constructor(vm, exprOrFn, cb, options) {
            this.vm = vm;
            this.exprOrFn = exprOrFn;
            this.cb = cb;
            this.options = options;
            this.id = id++;
            this.deps = []; // 存放 dep
            this.depsId = new Set(); // 用于去重 dep
            this.user = !!options.user;
            // 如果是计算属性，lazy，dirty默认为true
            this.lazy = options.lazy;
            this.dirty = options.lazy;

            // 默认应该让exprOrFn 执行，exprOrFn => render => 去vm上取值
            // 如果是渲染watcher
            if (typeof exprOrFn === 'function') {
                this.getter = exprOrFn;
            } else {
                this.getter = function () {
                    let path = exprOrFn.split('.');
                    let obj = vm;
                    for (let i=0; i<path.length; i++) {
                        obj = obj[path[i]];
                    }
                    return obj
                };
            }
            // 将初始值记录到value属性上
            // 第一次的value，如果是lazy则是undefined
            this.value = this.lazy ? undefined : this.get(); // 默认初始化，要取值
        }
        get() {
            // 由于取值会触发 defineProperty.get
            // 一个属性可以有多个watcher，一个watcher可以对应多个属性（多对多）
            // 每个属性都可以收集自己的watcher
            pushTarget(this); // 往Dep的target属性上挂载Watcher 实例
            const value = this.getter.call(this.vm);
            popTarget();
            return value
        }
        // 存放dep，同时让dep存储watcher实例
        addDep(dep) {
            let id = dep.id;
            if (!this.depsId.has(id)) {
                this.depsId.add(id);
                this.deps.push(dep);
                dep.addSub(this); // 让dep 存储Watcher 实例
            }
        }
        // 更新视图(vue中更新是异步的)
        update() {
            // this.get()
            if (this.lazy) {
               this.dirty = true; 
            } else {
                // 多次调用update，先将watcher缓存下来，收集起来一起更新
                queueWatcher(this);
            }
        }
        run () {
            let value = this.get();
            let oldValue = this.value;
            this.value = value;
            if (this.user) {
                this.cb.call(this.vm, value, oldValue);
            }
        }
        evaluate() {
            // 已经取过值了
            this.dirty = false;
            // 用户的getter执行
            this.value = this.get();
        }
        depend() {
            let i = this.deps.length;
            while (i--) {
                this.deps[i].depend();
            }
        }
    }

    function initState (vm) {
        const opts = vm.$options;
        // 初始化data
        if (opts.data) {
            initData(vm);
        }
        // 初始化方法
        if (opts.methods) ;
        // 初始化 props
        if (opts.props) ;
        // 初始化 computed
        if (opts.computed) {
            initComputed(vm, opts.computed);
        }
        // 初始化 watch
        if (opts.watch) {
            initWatch(vm, opts.watch);
        }

        function proxy (vm, source, key) {
            Object.defineProperty(vm, key, {
                get() {
                    return vm[source][key]
                },
                set(newValue) {
                    vm[source][key] = newValue;
                }
            });
        }
        
        function initData(vm) {
            let data = vm.$options.data;
            // vue2 中会将data 中的所有数值进行数据劫持(Object.defineProperty)
            // 如果传入的data 是一个方法，则取其返回值，否则取其值
            data = vm._data = isFunction(data) ? data.call(vm) : data;

            // 数据响应式
            observe(data);

            // 数据代理
            for (let key in data) {
                proxy(vm, '_data', key);
            }
        }
        
        function initComputed(vm, computed) {
            // 存放计算属性的watcher
            const watchers = vm._computedWatchers = {};
            for (let key in computed) {
                const userDef = computed[key];
                // 依赖的属性变化就重新取值
                let getter = typeof userDef === 'function' ? userDef : userDef.get;
                
                // 每个计算属性本质上就是watcher
                // lazy:true 默认不执行
                // 将watcher和属性做一个映射
                watchers[key] = new Watcher(vm, getter, () => {}, {lazy: true});
                // 将key定义在vm上
                defineComputed(vm, key, userDef);
            }
        }
        function defineComputed(vm, key, userDef) {
            let sharedProperty = {};
            if (typeof userDef === 'function') {
                sharedProperty.get = createComputedGetter(key);
            } else {
                sharedProperty.get = createComputedGetter(key);
                sharedProperty.set = userDef.set;
            }
            Object.defineProperty(vm, key, sharedProperty);
        }
        function createComputedGetter(key) {
            // 取计算属性的值，走的是这个函数
            return function computedGetter() {
                // this._computedWatchers 包含着所有的计算属性
                // 通过key 可以拿到对应的watcher，这个watcher中包含了getter
                let watcher = this._computedWatchers[key];
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                // 如果当前取值后 Dep.target 还有值，需要继续向上收集
                if (Dep.target) {
                    watcher.depend();
                }
                return watcher.value
            }
        }

        function initWatch(vm, watch) {
            for (const key in watch) {
                const handler = watch[key];
                // 如果结果值是数组循环创建watcher
                if (Array.isArray(handler)) {
                    for (let i=0; i<handler.length; i++) {
                        createWatcher(vm, key, handler[i]);
                    }
                } else {
                    createWatcher(vm, key, handler);
                }
            }
        }
        function createWatcher(vm, exprOrFn, handler, options) {
            // 如果是对象则提取函数和配置
            if (isObject(handler)) {
                options = handler;
                handler = handler.handler;
            }
            // 如果是字符串就是实例上的函数
            if (typeof handler === 'string') {
                handler = vm[handler];
            }
            return vm.$watch(exprOrFn, handler, options)
        }
    }
    function stateMixin(Vue) {
        Vue.prototype.$watch = function(exprOrFn, cb, options = {})  {
            // 标记为用户watcher
            options.user = true;
            // 核销就是创建个watcher
            const watcher = new Watcher(this, exprOrFn, cb, options);
            if (options.immediate) {
                cb.call(vm, watcher.value);
            }
        };
    }

    // 匹配标签名 div
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
    // 获取获取标签名的 match 数组索引为1的: div
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    /* let r = '<div></div>'.match(new RegExp(qnameCapture))
    console.log(r) // [ 'div', 'div', index: 1, input: '<div></div>', groups: undefined ] */

    // 匹配开始标签
    const startTagOpen = new RegExp(`^<${qnameCapture}`);
    // 匹配闭合标签
    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

    // 匹配属性 a=b a="b" a='b'
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    //  />
    const startTagClose = /^\s*(\/?)>/;

    let currentParent;
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;

    function parserHTML(html) { // <div id="app">{{name}}</div>
        let root;
        let stack = [];
        function createASTElement(tagName, attrs) {
            return {
                tag: tagName,
                type: ELEMENT_TYPE,
                children: [],
                attrs,
                parent: null
            }
        }

        // html 字符串解析成对应的脚本来触发 tokens <div id="app">{{name}}</div>

        function start(tagName, attributes) {
            let element = createASTElement(tagName, attributes);
            if (!root) {
                root = element;
            }
            currentParent = element;
            stack.push(element);
        }
        function end(tagName) {
            let element = stack.pop();
            currentParent = stack[stack.length - 1];
            if (currentParent) {
                element.parent = currentParent;
                currentParent.children.push(element);
            }
        }
        function chars(text) {
            text = text.replace(/\s/g, '');
            if (text) {
                currentParent.children.push({
                    type: TEXT_TYPE,
                    text
                });
            }
        }
        // 截取字符串
        function advance(len) {
            html = html.substring(len);
        }
        // 匹配标签开头
        function parseStartTag() {
            const start = html.match(startTagOpen);
            // console.log(start) // ['<div', 'div']
            if (start) {
                const match = {
                    tagName: start[1],
                    attrs: []
                };
                advance(start[0].length);
                // console.log(html) // id="app">{{name}}</div>
                let end, attr;
                // 如果没有遇到标签结尾就不停的解析
                while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    // console.log(attr) // [' id="app"', 'id', '=', 'app', undefined, undefined]
                    advance(attr[0].length);
                    match.attrs.push({
                        name: attr[1],
                        value: attr[3] || attr[4] || attr[5]
                    });
                    /* console.log(match)
                    {
                        tagName: 'div',
                        attrs: [
                            {
                                name: 'id',
                                value: 'app'
                            }
                        ]

                    } */
                    // console.log(html) // >{{name}}</div>
                }
                if (end) {
                    // console.log(end)
                    // ['>', '']
                    advance(end[0].length);
                    return match
                }

            }
            // 不是开始标签
            return false
        }

        // 解析的内容如果存在则不停地解析
        while (html) {
            // 当前解析的开头
            let textEnd = html.indexOf('<');
            if (textEnd === 0) {
                const startTagMatch = parseStartTag();
                if (startTagMatch) {
                    start(startTagMatch.tagName, startTagMatch.attrs);
                    continue
                }
                const endTagMatch = html.match(endTag);
                if (endTagMatch) {
                    end(endTagMatch[1]);
                    advance(endTagMatch[0].length);
                    continue
                }
            }
            // 处理文本
            let text; // {{name}}</div>
            if (textEnd >= 0) {
                text = html.substring(0, textEnd);
            }
            if (text) {
                chars(text);
                advance(text.length);
            }
        }
        return root
    }

    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    function gen (node) {
        if (node.type === 1) {
            return generate(node)
        } else {
            let text = node.text;
            if (!defaultTagRE.test(text)) {
                return `_v(${JSON.stringify(text)})`
            }
            let lastIndex = defaultTagRE.lastIndex = 0;
            let tokens = [];
            let match,index;
            while(match = defaultTagRE.exec(text)) {
                index = match.index;
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return `_v(${tokens.join('+')})`
        }
    }

    function getChildren(el) {
        const children = el.children;
        if (children) {
            return `${children.map(c => gen(c)).join(',')}`
        } else {
            return false
        }
    }

    function genProps(attrs) {
        let str = '';
        for (let i=0; i<attrs.length; i++) {
            let attr = attrs[i];
            if (attr.name === 'style') {
                let obj = {};
                attr.value.split(';').forEach(item => {
                    let [key, value] = item.split(':');
                    obj[key] = value;
                });
                attr.value = obj;
            }
            str += `${attr.name}:${JSON.stringify(attr.value)},`;
        }
        return `{${str.slice(0, -1)}}`
    }

    function generate (el) {
        let children = getChildren(el);
        let code = `_c('${el.tag}',${
        el.attrs.length?`${genProps(el.attrs)}`:'undefined'
    }${
        children?`,${children}`:''
    })`;
        return code
    }

    function compileToFunctions (template) {
        let root = parserHTML(template);
        console.log('>>>生成的AST语法树:', root);
        let code = generate(root);
        console.log('>>>生成的代码:', code);
        let render = `with(this){return ${code}}`;
        let renderFn = new Function(render);
        return renderFn
    }

    function patch(oldVnode, vnode) {
        // 判断是要要跟新还是要渲染
        if (!oldVnode) {
            return createElm(vnode)
        }
        // 如果是元素
        if (oldVnode.nodeType === 1) {
            // 用vnode来生成真实dom，替换成原来的dom元素

            // 找到其父亲元素
            const parentElm = oldVnode.parentNode;
            // 根据虚拟节点创建元素
            let elm = createElm(vnode);
            parentElm.insertBefore(elm, oldVnode.nextSibling);
            // 把自己删除
            parentElm.removeChild(oldVnode);
            return elm
        } else {
            // 如果标签名称不一样， 直接删掉老的换成新的即可
            if (oldVnode.tag !== vnode.tag) {
                // 可以通过vnode.el 属性，获取现在真实的dom元素
               return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
            
            }
            // 新节点复用老节点
            let el = vnode.el = oldVnode.el;

            // 如果两个虚拟节点是文本节点（比较文本内容）
            if (vnode.tag === undefined) {
                if (oldVnode.text !== vnode.text) {
                    el.textContent = vnode.text;
                }
                return
            }

            // 如果标签一样比较属性，用新的属性更新老的(目前data的值还有bug)
            updateProperties(vnode, oldVnode.data);

            // 一方有儿子 一方没儿子
            let oldChildren = oldVnode.children || [];
            let newChildren = vnode.children || [];
            if (oldChildren.length > 0 && newChildren.length > 0) {
                // 如果双方都有儿子
                // vue 使用了双指针的方式来对比
                patchChildren(el, oldChildren, newChildren);
            } else if (newChildren.length > 0) {
                // 老的没儿子，但是新的有儿子
                // 循环创建新节点
                for (let i=0; i < newChildren.length; i++) {
                    let child = createElm(newChildren[i]);
                    el.appendChild(child);
                }
            } else if (oldChildren.length > 0) {
                // 老的有儿子新的没儿子(bug: 属性还是会保留新属性)
                // 直接删除老节点
                el.innerHTML = ``;
            }
        }
    }

    function patchChildren(el, oldChildren, newChildren) {
        let oldStartIndex = 0;
        let oldStartVnode = oldChildren[0];
        let oldEndIndex = oldChildren.length - 1;
        let oldEndVnode = oldChildren[oldEndIndex];

        let newStartIndex = 0;
        let newStartVnode = newChildren[0];
        let newEndIndex = newChildren.length - 1;
        let newEndVnode = newChildren[newEndIndex];

        const makeIndexByKey = (children) => {
            return children.reduce((memo, current, index) => {
                if (current.key) {
                    memo[current.key] = index;
                }
                return memo
            }, {})
        };
        const keysMap = makeIndexByKey(oldChildren);

        while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
            // 如果节点已经被暴力比对给移走，则指针继续移动
            if (!oldStartVnode) {
                oldStartVnode = oldChildren[++oldStartIndex];
            } else if (!oldEndVnode) {
                oldEndVnode = oldChildren[--oldEndIndex];
            }
            // 同时循环新节点和老节点，有一方循环完毕就结束了
            // 头头比较，标签一致
            if (isSameVnode(oldStartVnode, newStartVnode)) {
                // 递归比较
                patch(oldStartVnode, newStartVnode);
                oldStartVnode = oldChildren[++oldStartIndex];
                newStartVnode = newChildren[++newStartIndex];
            } else if (isSameVnode(oldEndVnode, newEndVnode)) {
                // 尾尾比较
                patch(oldEndVnode, newEndVnode);
                oldEndVnode = oldChildren[--oldEndIndex];
                newEndVnode = newChildren[--newEndIndex];
            } else if (isSameVnode(oldStartVnode, newEndVnode)) {
                // 头尾比较=》reverse
                patch(oldStartVnode, newEndVnode);
                // 把旧头节点插入到旧尾节点下一个节点
                el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
                oldStartVnode = oldChildren[++oldStartIndex];
                newEndVnode = newChildren[--newEndIndex];
            } else if (isSameVnode(oldEndVnode, newStartVnode)) {
                // 尾头比较=》reverse
                patch(oldEndVnode, newStartVnode);
                // 把旧尾节点插入到旧头节点
                el.insertBefore(oldEndVnode.el, oldStartVnode.el);
                oldEndVnode = oldChildren[--oldEndIndex];
                newStartVnode = newChildren[++newStartIndex];
            } else {
                // 乱序对比
                // 需要根据key和对应的索引的内容生成映射表
                // 通过新头的key找出对应旧的key所对应的index
                let moveIndex = keysMap[newStartVnode.key];
                // 如果不能复用，直接创建新的插入到老的节点节点开头处
                if (moveIndex == undefined) {
                    el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
                } else {
                    let moveNode = oldChildren[moveIndex];
                    // 此节点已经被移走了
                    oldChildren[moveIndex] = null;
                    // 移动节点
                    el.insertBefore(moveNode.el, oldStartVnode.el);
                    // 比较两个节点的属性
                    patch(moveNode, newStartVnode);
                }
                newStartVnode = newChildren[++newStartIndex];
            }

        }
        // 这里是用户没有比对完的
        // 这是新的还没有比对完（旧的已经比对完了，新的还有）
        if (newStartIndex <= newEndIndex) {
            for (let i= newStartIndex; i <= newEndIndex; i++) {
                // el.appendChild(createElm(newChildren[i]))

                // 通过判断尾指针得下一个元素是否存在判断是从头比较还是从尾比较
                // 如果是从头比较则appendChild即可，如果是从尾比较则通过insertBefore (appendChild 等价于 insertBefore(newItem, null))
                let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
                el.insertBefore(createElm(newChildren[i]), anchor);
            }
        }
        // 这是旧还没有比对完（新的已经比对完了，旧的还有）
        if (oldStartIndex <= oldEndIndex) {
            for (let i=oldStartIndex; i<=oldEndIndex; i++) {
                // 如果老的多 将老节点删除 但可能有暴力对比移除掉null的情况
                if (oldChildren[i] !== null) {
                    el.removeChild(oldChildren[i].el);
                }
            }
        }
    }

    function isSameVnode(oldVnode, newVnode) {
        return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key
    }

    function createElm (vnode) {
        let { tag, data, children, text, vm } = vnode;
        // 如果是元素
        if (typeof tag ==='string') {
            if (createComponent$1(vnode)) {
                // 返回组件对应的真实节点
                return vnode.componentInstance.$el
            }
            // 虚拟节点会有一个el属性，对应真实节点
            vnode.el = document.createElement(tag);
            updateProperties(vnode);
            children.forEach(child => {
                vnode.el.appendChild(createElm(child));
            });
        } else {
            vnode.el = document.createTextNode(text);
        }
        return vnode.el
    }

    function createComponent$1 (vnode) {
        let i = vnode.data;
        if ((i=i.hook) && (i = i.init)) {
            // 调用init方法
            i(vnode);
        }
        if (vnode.componentInstance) {
            return true
        }
    }

    function updateProperties(vnode, oldProps={}) {
        let newProps = vnode.data || {};
        // 当前真实节点
        let el = vnode.el;

        let newStyle = newProps.style || {};
        let oldStyle = oldProps.style || {};
        // 去除老的style中新的没有的
        for (let key in oldStyle) {
            if (!newStyle[key]) {
                el.style[key] = '';
            }
        }

        // 如果老的属性有，新的没有直接删除
        for (let key in oldProps) {
            if (!newProps[key]) {
                el.removeAttribute(key);
            }
        }
        for (let key in newProps) {
            // 如果是有style属性
            if (key === 'style') {
                for (let styleName in newProps.style) {
                    el.style[styleName] = newProps.style[styleName];
                }
            } else if (key === 'class') {
                el.className = newProps.class;
            } else {
                el.setAttribute(key, newProps[key]);
            }
        }
    }

    function lifecycleMixin(Vue) {
        Vue.prototype._update = function (vnode) {
            const vm = this;
            vm.$el = patch(vm.$el, vnode);
        };
        Vue.prototype.$nextTick = nextTick;
    }

    // 后续每个组件渲染的时候都会有一个watcher
    function mountComponent(vm, el) {
        // 更新函数 数据变化后 会再次调用此函数
        let updateComponent = () => {
            // 1.调用render函数，生成、更新虚拟dom
            // 2.用虚拟dom生成真实dom

            vm._update(vm._render());
        };
        
        callHook(vm, 'beforeMount');

        // 观察者模式 属性：“被观察者” 刷新页面：“观察者”
        new Watcher(vm, updateComponent, () => {
            console.log('更新视图了');
        }, true); // true 表示是一个渲染watcher，后续有其他watcher

        callHook(vm, 'mounted');
    }

    function callHook(vm, hook) {
        let handlers = vm.$options[hook];
        if (handlers) {
            for (let i=0; i<handlers.length; i++) {
                handlers[i].call(vm);
            }
        }
    }

    function initMixin (Vue) {
        Vue.prototype._init = function (options) {
            // el, data
            const vm = this;
            vm.$options = mergeOptions(this.constructor.options, options);

            // 对数据进行初始化（watch、computed、props、data...）
            // 这些数据都存在于vm.options
            callHook(vm, 'beforeCreate');
            initState(vm);
            callHook(vm, 'created');

            // 页面挂载
            if (vm.$options.el) {
                // 将数据挂载到这个模板上
                vm.$mount(vm.$options.el);
            }
        };
        Vue.prototype.$mount = function (el) {
            const vm = this;
            const options = vm.$options;
            el = document.querySelector(el);
            vm.$el = el;
            // 把模板转化成对应的渲染函数 =》虚拟dom的概念 Vnode =》
            // diff算法更新虚拟dom =》 产生真实节点，更新
            // 如果没有render方法
            if (!options.render) {
                let template = options.template;
                // 如果没有模板但是有el
                if (!template && el) {
                    template = el.outerHTML;
                }
                const render = compileToFunctions(template);
                options.render = render;
                console.log('>>>生成的render函数:', options.render);
            }
            // 组件挂载
            mountComponent(vm);
        };
    }

    function createElement(vm, tag, data = {}, ...children) {
        // 在创建虚拟节点的时候我们需要判断这个标签是否是组件，普通标签的虚拟节点和组件标签虚拟节点有所不同
        if (isReservedTag(tag)) {
            return vnode(vm, tag, data, data.key, children, undefined)
        } else {
            // 如果tag是组件，应该渲染一个组件的vnode
            let Ctor = vm.$options.components[tag];
            return createComponent(vm, tag, data, data.key, children, Ctor)
        }
    }

    function createComponent(vm, tag, data, key, children, Ctor) {
        // 获取父类构造函数
        const baseCtor = vm.$options._base;
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor);
        }
        // 组件的生命周期钩子(渲染组件时需要调用此初始化方法)
        data.hook = {
            init(vnode){
                // new 的时候等于 new Vue(), 走init()
                let child = vnode.componentInstance = new Ctor({_isComponent: true});
                // 挂载组件
                child.$mount();
            }
        };
        return vnode(vm, `vue-component-${tag}`, data, key, undefined, {Ctor, children})
    }

    function createTextNode(vm, text) {
        return vnode(vm, undefined, undefined, undefined, undefined, text)
    }

    function vnode(vm, tag, data, key, children, text, componentOptions) {
        return {
            vm,
            tag,
            data,
            key,
            children,
            text,
            componentOptions
        }
    }

    function renderMixin (Vue) {
        Vue.prototype._c = function () {
            return createElement(this, ...arguments)
        };
        Vue.prototype._v = function (text) {
            return createTextNode(this, text)
        };
        Vue.prototype._s = function (val) {
            return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
        };
        Vue.prototype._render = function() {
            const vm = this;
            // 获取 render 函数
            let render = vm.$options.render;
            let vnode = render.call(vm);
            console.log('生成的vnode>>>', vnode);
            return vnode
        };
    }

    function Vue(options) {
        // options 为用户传入的选项
        this._init(options); // 初始化操作、组件
    }

    // 给原型上新增_init 方法
    initMixin(Vue);
    renderMixin(Vue);
    lifecycleMixin(Vue);
    stateMixin(Vue);

    // 在类上扩展的Vue.mixin
    initGlobalApi(Vue);

    // 1.标签名不一样，直接删掉老的换成新的即可
    // let oldTemplate = `<div>{{message}}</div>`
    // 2.标签一样比较属性
    // let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1>{{message}}</div>`
    // 3.一方有儿子 一方没儿子
    // 3.1 老的没儿子， 新的有儿子
    // let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1></div>`
    // 3.2 老的有儿子,新的没儿子
    // let oldTemplate = `<div style="color: red;background: blue;font-size: 20px;" a=1>{{message}}</div>`
    // 3.3 双方都有儿子
    // 3.3.1 ABCD ADCD(同头指针开始比较)
    // 3.3.2 ABCD ABCDE（新的没有比较完）
    // 3.3.3 ABCD EABCD(Key)（从尾指针开始比较）
    // 3.3.4 从尾比较没比较完
    // 3.3.4.1 ABCD AB
    // 3.3.4.2 ABCD CD
    // 3.3.5 ABCD BCDA (头尾比较)
    // 3.3.6 ABCD DABC (尾头比较)
    // 3.3.7 CABD BCDA (乱序比较)
    let oldTemplate = `<div>
    <li key="C">C</li>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="D">D</li>
</div>`;
    let vm1 = new Vue({data: {message: 'hello'}});
    const render1 = compileToFunctions(oldTemplate);
    const oldVnode = render1.call(vm1);
    document.body.appendChild(createElm(oldVnode));

    // v-if v-else
    // 1.标签名不一样，直接删掉老的换成新的即可
    // let newTemplate = `<p>{{message}}</p>`
    // 2.标签一样比较属性
    // let newTemplate = `<div style="color: blue;background: red;" b=2>{{message}}</div>`
    // 3.一方有儿子 一方没儿子
    // 3.1 老的没儿子， 新的有儿子
    // let newTemplate = `<div style="color: blue;background: red;" b=2>{{message}}</div>`
    // 3.2 老的有儿子,新的没儿子
    // let newTemplate = `<div style="color: blue;background: red;" b=2></div>`
    // 3.3 双方都有儿子
    // 3.3.1 ABCD ADCD (同头指针开始比较)
    // 3.3.2 ABCD ABCDE （新的没有比较完）
    // 3.3.3 ABCD EABCD(Key)（从尾指针开始比较）
    // 3.3.4 从尾比较没比较完
    // 3.3.4.1 ABCD AB
    // 3.3.4.2 ABCD CD
    // 3.3.5 ABCD BCDA (头尾比较)
    // 3.3.6 ABCD DABC (尾头比较)
    // 3.3.7 CABD BCDA (乱序比较)
    let newTemplate = `<div>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
    <li key="A">A</li>
</div>`;
    let vm2 = new Vue({data: {message: 'world'}});
    const render2 = compileToFunctions(newTemplate);
    const newVnode = render2.call(vm2);

    // 根据新的虚拟节点更新老的节点，老的节点能复用尽量复用
    setTimeout(() => {
        patch(oldVnode, newVnode);
    }, 2000);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
