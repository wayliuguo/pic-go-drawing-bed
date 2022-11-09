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
        };
    });

    class Observer {
        // 对对象中的所有属性进行劫持
        constructor (data) {
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

    // vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
    function defineReactive(data, key, value) {
        // 如果value是一个对象，则继续递归进行劫持
        observe(value); 
        Object.defineProperty(data, key, {
            get() {
                return value
            },
            set(newV) {
                // 如果用户赋值一个新对象，需要将这个对象进行劫持
                observe(newV);
                value = newV;
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
            return
        }
        // 默认最外层 data 必须是一个对象
        return new Observer(data)
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
        if (opts.computed) ;
        // 初始化 watch
        if (opts.watch) ;

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

    let root;
    let currentParent;
    let stack = [];
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
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
    function parserHTML(html) { // <div id="app">{{name}}</div>
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

    function initMixin (Vue) {
        Vue.prototype._init = function (options) {
            // el, data
            const vm = this;
            vm.$options = options;

            // 对数据进行初始化（watch、computed、props、data...）
            // 这些数据都存在于vm.options
            initState(vm);

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
        };
    }

    function Vue(options) {
        // options 为用户传入的选项
        this._init(options); // 初始化操作、组件
    }

    // 给原型上新增_init 方法
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
