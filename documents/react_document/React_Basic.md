### 1.JSX语法规则

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
    <style>
        .title {
            color: orange;
        }
    </style>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        const myId = "liuguowei"
        const myData = 'hello react'
        // 创建虚拟 DOM 
        const vDOM = (
            <div>    
                <h2 className="title" id={myId.toLowerCase()}>
                    <span style={{color: 'pink',fontSize: '20px'}}>{myData.toLowerCase()}</span>    
                </h2>
                <input type="text"/>
            </div>
        )
        // 渲染虚拟DOM 到页面
        ReactDOM.render(vDOM, document.querySelector('#test'))
    </script>
</body>
</html>
```

- 定义虚拟DOM时，不要写引号

- 标签中混入 JS 表达式时要用 {}

- 定义类名需要用 className

- 内联样式,要用 style={{key:val}}形式去写，外面第一个大括号是表达式，里面那个是对象

- 虚拟DOM 必须只有一个根标签

- 标签必须闭合

- 标签首字母

-  若小写字母开头，则将该标签转为html中用户元素，若html中无该标签同名元素，则报错

-  若大写字母开头，react就去渲染对应的组件，若组件没有定义，则报错。

### 2.表达式、代码的区别

- 表达式
  - 一个表达式会产生一个值，可以放在任何一个需要值的地方
    - a (const a = 1) 变量名
    - a+b
    - demo(1) 函数调用表达式，没有返回值也会返回 undefined
    - arr.map() 对数组进行加工
    - function test () {}
    - 上面的这些都可以 const x = 接收并console出来，都是表达式
- 语句（代码）
  - if() {}
  - for(){}
  - switch() {case: xxx}

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        const data = ['Angular', 'React', 'Vue']
        // 创建虚拟 DOM 
        const vDOM = (
            <div>    
                <h1>前端框架列表</h1>
                <ul>
                    {
                        data.map((item, index) => {
                            return <li key={index}>{item}</li>
                        })
                    }    
                </ul>
            </div>
        )
        // 渲染虚拟DOM 到页面
        ReactDOM.render(vDOM, document.querySelector('#test'))
    </script>
</body>
</html>
```

### 3.函数式组件

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        // 1.创建函数式组件
        function MyComponent() {
            console.log(this) // 此处的this是 undefined，因为 babel 编译后开启了严格模式
            return <h2>我是用函数定义的组件（适用于【简单组件】的定义）</h2>
        }
        // 渲染虚拟DOM 到页面
        ReactDOM.render(<MyComponent/>, document.querySelector('#test'))
        /*
            执行了ReactDOM.render(<MyComponent />, ...)后，
            1.React 解析组件标签，找到了MyComponent组件
            2.发现组件是使用函数定义的，随后调用该函数，将返回的虚拟DOM转为真实DOM,随后呈现在页面中
        */ 
    </script>
</body>
</html>
```

### 4.类的基本知识

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <script type="text/javascript">
        // 创建一个Person类
        class Person {
            // 构造器方法
            constructor(name,age) {
                // 构造器中的this =>> 类的实例对象
                this.name = name
                this.age = age
            }
            // 一般方法
            speak() {
                // speak方法放在哪里？=>>类的原型对象上，但供实例使用
                // speak中的this就是Person实例
                console.log(`我叫${this.name}，我年龄是${this.age}`)
            }
        }
        // 创建一个Person的实例对象
        const p1 = new Person('tom', 18)
        const p2 = new Person('jerry', 19)
        console.log(p1)
        console.log(p2)
        p1.speak()
        p2.speak()

        // 创建一个Student类，继承于Person类
        class Student extends Person {
            constructor(name, age, grade) {
                super(name, age)
                this.grade = grade
            }
            // 重写 speak 方法
            speak() {
                console.log(`我叫${this.name}，我的年龄是${this.age},我读的是${this.grade}年级`)
            }
        }
        const s1 = new Student('小张',15,'高一')
        console.log(s1)
    </script>
</body>
</html>
```

- 类中构造器不是必须写的，要对实例进行一些初始化的操作如添加指定属性时才写
-  如果A类继承了B类，且A类中写了构造器，那么A类构造器中的super是必须要调用的
- 类中所定义的方法，都是放在类的原型对象上，供实例去使用

### 5.类式组件

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        // 创建类式组件
        class MyComponent extends React.Component {
            render() {
                // render是放在哪里的？==>MyComponent的原型对象上，供实例使用
                // 控制台 MyComponent.prototype查看即可
                // render 中的this是谁？==>MyComponent组件的实例对象
                console.log('render中的this',this)
                return (
                    <h2>我是类定义的组件【使用于复杂组件的定义】</h2>
                )
            }
        }
        ReactDOM.render(<MyComponent/>, document.querySelector('#test'))
        /*
            执行了ReactDOM.render(<MyComponent />, ...)后，
            1.React 解析组件标签，找到了MyComponent组件
            2.发现组件是使用类定义的，随后实例化该类的实例，并通过该实例调用到原型上的render方法
            3.将render返回的虚拟DOM转为真实DOM，随后呈现在页面中
        */ 
    </script>
</body>
</html>
```

### 6.state基础

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        class Weather extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    isHot : false
                }
            }
            render() {
                const {isHot} = this.state
                return <h1>今天天气很{isHot ? '炎热' : '凉爽'}</h1>
            }
        }
        ReactDOM.render(<Weather/>, document.querySelector('#test'))
    </script>
</body>
</html>
```

### 7.类中方法this的指向与事件绑定

```
class Person {
	constructor(name,age) {
        this.name = name
        this.age = age
	}
}
speak() {
    // speak 方法放在了哪里？==>类的原型对象上，供实例调用
    // 通过 Person实例调用speak时，speak中的this就是Person实例（沿着原型链查找）
	console.log(this)
}
const p1 = new Person('tom', 18)
p1.speak() // 打印Person对象

const x = p1.speak() // 赋值语句，x 引用了 p1.speak
x() // undefined // 类中所有定义的方法，局部都开启了严格模式，所以this不是window，而是undefined
```

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        class Weather extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    isHot : false
                }
                this.changeWeather = this.changeWeather.bind(this) // 需要使用bind改变changeWeather的指向we
            }
            render() {
                const {isHot} = this.state
                return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}</h1>
            }
            changeWeather() {
                // changeWeather放在了哪里？=>>Weather的原型对象上，供实例调用
                // 由于 changeWeather 是作为Onclick的回调，所以不是通过实例调用的，是直接调用
                // 类中的方法默认开启了局部的严格模式，所以changeWeather中的this为undefined（如果没有使用bind改变指向）
                console.log(this)
            }
        }
        ReactDOM.render(<Weather/>, document.querySelector('#test'))
    </script>
</body>
</html>
```

### 8.setSate

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        class Weather extends React.Component {
            // 构造器调用 1 次
            constructor(props) {
                super(props)
                this.state = {
                    isHot : false
                }
                this.changeWeather = this.changeWeather.bind(this) // 需要使用bind改变changeWeather的指向we
            }
            // render 调用 1 + n 次，1为初始化， n为更新
            render() {
                const {isHot} = this.state
                return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}</h1>
            }
            // 更新次数
            changeWeather() {
                const isHot = this.state.isHot
                this.setState({
                    isHot: !isHot
                })
            }
        }
        ReactDOM.render(<Weather/>, document.querySelector('#test'))
    </script>
</body>
</html>
```

### 9.state简写

```
class Car {
	constructor (name, price) {
		this.name = name
		this.price = price
	}
	// 类中可以直接写赋值语句
	a = 1
	speak = function(){
		console.log(this)
	}
	talk = () => {
		console.log(this)
	}
}

const c1 = new Car('法拉利', 999)
console.log(c1)
// 输出
// 构造器内的属性与方法也是实例的
// 往实例身上追加属性(在构造器外写赋值语句) =>> 可以看到 a、speak、talk都是实例的方法
Car {a: 1, name: '法拉利', price: 999, speak: ƒ, talk: ƒ}
a: 1
name: "法拉利"
price: 999
speak: ƒ ()
talk: () => { console.log(this) }
```

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        class Weather extends React.Component {
            state = {
                isHot: false
            }
            render() {
                const {isHot} = this.state
                return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}</h1>
            }
            // 使用箭头函数（箭头函数this指向声明时所在的作用域下的this的值，即Weather的实例对象）
            changeWeather = () => {
                const isHot = this.state.isHot
                this.setState({
                    isHot: !isHot
                })
                console.log(this)
                // Weather {props: {…}, context: {…}, refs: {…}, updater: {…}, state: {…}, …}
                // changeWeather: ƒ ()
                // context: {}
                // props: {}
                // refs: {}
                // state: {isHot: true}
                // updater: {isMounted: ƒ, enqueueSetState: ƒ, enqueueReplaceState: ƒ, enqueueForceUpdate: ƒ}
                // _reactInternalInstance: {_processChildContext: ƒ}
                // _reactInternals: FiberNode {tag: 1, key: null, stateNode: Weather, elementType: ƒ, type: ƒ, …}
                // isMounted: (...)
                // replaceState: (...)
            }
        }
        ReactDOM.render(<Weather/>, document.querySelector('#test'))
    </script>
</body>
</html>
```

### 10.展开运算符

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        let arr1 = [1,3,5,7]
        let arr2 = [2,4,6,8]
        console.log(...arr1) // 展开一个数组 1,3,5,7
        let arr3 = [...arr1,...arr2]
        console.log(arr3) // 连接数组 [1, 3, 5, 7, 2, 4, 6, 8]
        function sum(...args) {
            console.log(args) // [1, 2, 3, 4]
        }
        sum(1,2,3,4)

        let person = {
            name: 'liuguowei',
            age: 18,
            hobby: ['篮球','rap'],
            school: {
                hight: [123,456,789]
            }
        }
        // console.log(...person) // Uncaught TypeError: Found non-callable @@iterator
        // 如果外面包了{}则可以复制对象（一层的浅拷贝）
        let person2 = {...person}
        person.name = "小刘"
        person.hobby = ['dance','sing']
        person.school.hight[0] = 111111;
        console.log(person2) // {name: 'liuguowei', age: 18,hobby: ['篮球','rap'], school: {hight: [111111，456，789]}}
        console.log(person) // {name: '小刘', age: 18,hobby: ['dance','sing]，school: {hight: [111111，456，789]}
    </script>
</body>
</html>
```

### 11.批量传递Proops

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>
    <div id="test2"></div>
    <div id="test3"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script>
    <script src="./js/react-dom.development.js" type="text/javascript"></script>
    <script src="./js/babel.min.js" type="text/javascript"></script>
    
    <script type="text/babel">
        class Person extends React.Component {
            render() {
                const {name, age, sex} = this.props
                return (
                    <ul>
                        <li>姓名：{name}</li>    
                        <li>性别：{sex}</li> 
                        <li>年龄：{age}</li> 
                    </ul>
                )
            }
        }
        ReactDOM.render(<Person name="jerry" age="19" sex="女"/>, document.querySelector('#test1'))
        ReactDOM.render(<Person name="tom" age="19" sex="男"/>, document.querySelector('#test2'))
    
        const p = {name:'老刘', age: 18, sex: '女'}
        ReactDOM.render(<Person {...p}/>, document.querySelector('#test3'))
    </script>
</body>
</html>
```

### 12.对props进行约束

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>
    <div id="test2"></div>
    <div id="test3"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Person extends React.Component {
            render() {
                const {name, age, sex} = this.props
                return (
                    <ul>
                        <li>姓名：{name}</li>    
                        <li>性别：{sex}</li> 
                        <li>年龄：{age+1}</li>
                    </ul>
                )
            }
        }
        // 对 props 进行约束
        // 在 react16后弃用了React对象上的 PropToypes(导致React对象太臃肿),需单独引入 prop-types.js
        // 注意区分 propTypes 与 PropTypes （首字母大小写）
        Person.propTypes = {
            name: PropTypes.string.isRequired,
            sex: PropTypes.string,
            age: PropTypes.number,
            speak: PropTypes.func
        }
        Person.defaultProps = {
            sex: '女',
            age: 18
        }
    
        // age 传的非字符串值需要使用{}
        ReactDOM.render(<Person name="jerry" age={19} speak={speak}/>, document.querySelector('#test1'))
        ReactDOM.render(<Person name="tom" sex="男"/>, document.querySelector('#test2'))
    
        const p = { name: '老刘', age: 18, sex: '女'}
        ReactDOM.render(<Person {...p}/>, document.querySelector('#test3'))
    
        function speak() {
            console.log('我说话了')
        }
    </script>
</body>
</html>
```

### 13.props简写

````
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Person extends React.Component {
            static propTypes = {
                name: PropTypes.string.isRequired,
                sex: PropTypes.string,
                age: PropTypes.number,
                speak: PropTypes.func
            }
            static defaultProps = {
                sex: '女',
                age: 18
            }
            render() {
                const {name, age, sex} = this.props
                return (
                    <ul>
                        <li>姓名：{name}</li>    
                        <li>性别：{sex}</li> 
                        <li>年龄：{age+1}</li>
                    </ul>
                )
            }
        }
    
        ReactDOM.render(<Person name="jerry"/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

- 使用static即可

### 函数式组件使用props

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>
    <div id="test2"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        function Person (props) {
            const {name, sex, age} = props
            return (
                <ul>
                    <li>姓名：{name}</li>    
                    <li>性别：{sex}</li> 
                    <li>年龄：{age+1}</li>
                </ul>
            )
        }
        // 对 props 进行约束
        Person.propTypes = {
            name: PropTypes.string.isRequired,
            sex: PropTypes.string,
            age: PropTypes.number,
            speak: PropTypes.func
        }
        Person.defaultProps = {
            sex: '女',
            age: 18
        }
        ReactDOM.render(<Person name="jerry" sex="男" age={50} />, document.querySelector('#test1'))
        ReactDOM.render(<Person name="tom" />, document.querySelector('#test2'))
    </script>
</body>
</html>
````

### 14.字符串形式的ref

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Demo extends React.Component {
            // 展示左侧输入框的数据
            showData = () => {
                const { input1 } = this.refs
                alert(input1.value)
            }
            showData2 = () => {
                const { input2 } = this.refs
                alert(input2.value)
            }
            render() {
                return(
                    <div>
                        <input ref="input1" type="text" placeholder="点击按钮提示数据"/>
                        <button onClick={this.showData}>点我提示左侧的数据</button>
                        <input ref="input2" onBlur={this.showData2} type="text" placeholder="失去提示数据"/>
                    </div>
                )
            }
        }
        ReactDOM.render(<Demo/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 15.回调形式的ref

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Demo extends React.Component {
            // 展示左侧输入框的数据
            showData = () => {
                const { input1 } = this
                alert(input1.value)
            }
            showData2 = () => {
                const { input2 } = this
                alert(input2.value)
            }
            // 回调形式的ref的入参是ref的整个dom
            render() {
                return(
                    <div>
                        <input ref={dom1=>this.input1 = dom1} type="text" placeholder="点击按钮提示数据"/>
                        <button onClick={this.showData}>点我提示左侧的数据</button>
                        <input ref={(dom2) => {this.input2 = dom2}} onBlur={this.showData2} type="text" placeholder="失去提示数据"/>
                    </div>
                )
            }
        }
        ReactDOM.render(<Demo/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 16.回调ref的执行次数

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Demo extends React.Component {
            state = {
                isHot: false
            }
            // 展示左侧输入框的数据
            showInfo = () => {
                const { input1 } = this
                alert(input1.value)
            }
            // 切换天气
            changeWeather = () => {
                const {isHot} = this.state
                this.setState({
                    isHot: !isHot
                })
            }
            // 回调形式的ref的入参是ref的整个dom
            // 如果ref回调函数以内联形式使用，在更新过程中会被执行两次，第一次传入的是null，第二次传入的才是对应dom
            render() {
                const {isHot} = this.state
                return(
                    <div>
                        <h2>今天天气很{isHot ? '炎热' : '凉爽'}</h2>
                        <input ref={(dom)=>{this.input1 = dom;console.log(dom)}} type="text" placeholder="点击按钮提示数据"/>
                        <button onClick={this.showInfo}>点我提示输入的数据</button>
                        <button onClick={this.changeWeather}>点我切换天气</button>
                    </div>
                )
            }
        }
        ReactDOM.render(<Demo/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

- 点击切换天气更新的时候，回调函数（内联）会打印两次

### 17.React.createRef()的使用

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Demo extends React.Component {
            // React.createRef调用后可以返回一个容器，该容器可以存储被ref所标识的节点，该容器是“专人专用”的
            myRef1 = React.createRef()
            myRef2 = React.createRef()
            // 展示左侧输入框的数据
            showData = () => {
                const { myRef1, myRef2 } = this
                alert(myRef1.current.value)
                alert(myRef2.current.value)
            }
            // 回调形式的ref的入参是ref的整个dom
            render() {
                return(
                    <div>
                        <input ref={this.myRef1} type="text" placeholder="点击按钮提示数据"/>
                        <button onClick={this.showData}>点我提示左侧的数据</button>
                        <input ref={this.myRef2} type="text" placeholder="点击按钮提示数据"/>
                    </div>
                )
            }
        }
        ReactDOM.render(<Demo/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 18.React中的事件处理

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Demo extends React.Component {
            /*
                (1).通过onXxx属性指定事件处理函数，注意大小写
                    a.React 使用的是自定义（合成）事件，而不是使用的原生Dom事件
                    b.React 中的事件是通过事件委托方式处理的(委托给组件最外层元素)
                (2).通过event.target得到发生事件的DOM元素对象
            */
            myRef1 = React.createRef()
            myRef2 = React.createRef()
    
            showData = () => {
                const { myRef1, myRef2 } = this
                alert(myRef1.current.value)
                alert(myRef2.current.value)
            }
    
            showData2 = (event) => {
                alert(event.target.value)
            }
            
            render() {
                return(
                    <div>
                        <input ref={this.myRef1} type="text" placeholder="点击按钮提示数据"/>
                        <button onClick={this.showData}>点我提示左侧的数据</button>
                        <input onBlur={this.showData2} type="text" placeholder="点击按钮提示数据"/>
                    </div>
                )
            }
        }
        ReactDOM.render(<Demo/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 19.非受控组件

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Login extends React.Component {
            handleSubmit = (event) =>  {
                event.preventDefault()
                const {usernameDom, passwordDom} = this
                console.log(this)
                alert(`你输入的用户名是:${usernameDom.value}，密码:${passwordDom.value}`)
            }
            render() {
                return (
                    <form action="http://www.atguigu.com" onSubmit={this.handleSubmit}>
                        用户名: <input type="text" ref={dom=>this.usernameDom=dom} name="username"/>
                        密码: <input type="password" ref={dom=>this.passwordDom=dom} name="password"/>
                        <button>登录</button>
                    </form>
                )
            }
        }
        ReactDOM.render(<Login/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 20.受控组件

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Login extends React.Component {
            state = {
                username: '',
                password: ''
            }
            usernameChange = (evnet) => {
                console.log(event.target.value)
                this.setState({
                    username: evnet.target.value
                })
            }
            passwordChange = (event) => {
                console.log(event.target.value)
                this.setState({
                    password: event.target.value
                })
            }
            handleSubmit = (event) =>  {
                event.preventDefault()
                const {username, password} = this.state
                alert(`你输入的用户名是:${username}，密码:${password}`)
            }
            render() {
                return (
                    <form onSubmit={this.handleSubmit}>
                        用户名: <input type="text" onChange={this.usernameChange} name="username"/>
                        密码: <input type="password" onChange={this.passwordChange} name="password"/>
                        <button>登录</button>
                    </form>
                )
            }
        }
        ReactDOM.render(<Login/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 21.高阶函数-函数柯里化

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Login extends React.Component {
            /*
                高阶函数：如果一个函数符合下面两个规范中的任何一个，那该函数就是高阶函数
                1.若A函数，接受的参数是一个函数，那么A就可以称之为高阶函数
                2.若A函数，调用的返回值依然是一个函数，那么A就可以称之为高阶函数
                函数的柯里化:通过调用函数继续返回函数的方式，实现多次接受参数最后统一处理的函数编码形式
                常见的高阶函数:Promise、setTimeout、setInterval、arr.map、arr.
            */
            state = {
                username: '',
                password: ''
            }
            saveFormData = (dataType) => {
                return (event) => {
                    this.setState({
                        [dataType] : event.target.value
                    })
                }
            }
            handleSubmit = (event) =>  {
                event.preventDefault()
                const {username, password} = this.state
                alert(`你输入的用户名是:${username}，密码:${password}`)
            }
            render() {
                return (
                    <form onSubmit={this.handleSubmit}>
                        用户名: <input type="text" onChange={this.saveFormData('username')} name="username"/>
                        密码: <input type="password" onChange={this.saveFormData('password')} name="password"/>
                        <button>登录</button>
                    </form>
                )
            }
        }
        ReactDOM.render(<Login/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 22.不用柯里化的写法

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Login extends React.Component {
            state = {
                username: '',
                password: ''
            }
            saveFormData = (dataType, event) => {
                this.setState({
                    [dataType] : event.target.value
                })
            }
            handleSubmit = (event) =>  {
                event.preventDefault()
                const {username, password} = this.state
                alert(`你输入的用户名是:${username}，密码:${password}`)
            }
            render() {
                return (
                    <form onSubmit={this.handleSubmit}>
                        用户名: <input type="text" onChange={event => this.saveFormData('username', event)} name="username"/>
                        密码: <input type="password" onChange={event => this.saveFormData('password', event)} name="password"/>
                        <button>登录</button>
                    </form>
                )
            }
        }
        ReactDOM.render(<Login/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 23.引出生命周期

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Life extends React.Component {
            state = {
                opacity: 1
            }
            death = () => {
                ReactDOM.unmountComponentAtNode(document.querySelector('#test1'))
            }
            // 组件挂载完毕调用
            componentDidMount() {
                this.timer = setInterval(() => {
                    let {opacity} = this.state
                    opacity -= 0.1
                    if (opacity <= 0) opacity = 1
                    this.setState({
                        opacity
                    })
                }, 200)
            }
            // 组件将要卸载时调用
            componentWillUnmount() {
                clearInterval(this.timer)
            }
    
            render() {
                return (
                    <div>
                        <h2 style={{opacity: this.state.opacity}}>React学不会怎么办?</h2>
                        <button onClick={this.death}>不活了</button>
                    </div>
                )
            }
        }
        ReactDOM.render(<Life/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

### 24.生命周期(旧)—组件挂载流程

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Count extends React.Component {
            constructor(props) {
                super(props)
                console.log('constructor')
                // 初始化状态
                this.state = {
                    count: 1
                }
            }
            // 组件将要挂载的钩子
            componentWillMount() {
                console.log('componentWillMount')
            }
            // 组件挂载完毕的钩子
            componentDidMount() {
                console.log('componentDidMount')
            }
            add = () => {
                const {count} = this.state
                this.setState({
                    count: count+1
                })
            }
            death = () => {
                ReactDOM.unmountComponentAtNode(document.querySelector('#test1'))
            }
            // 组件卸载的钩子
            componentWillUnmount() {
                console.log('componentWillUnmount');
            }
            render(){
                console.log('render')
                return (
                    <div>
                        <h2>当前求和为{this.state.count}</h2>
                        <button onClick={this.add}>+1</button>
                        <button onClick={this.death}>关闭</button> 
                    </div>
                )
            }
        }
        ReactDOM.render(<Count/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

-  constructor
-  componentWillMount
- render
- componentDidMount
- 点击关闭 ==> componentWillUnmount

### 25.生命周期(旧)—setState流程

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Count extends React.Component {
            constructor(props) {
                super(props)
                console.log('constructor')
                // 初始化状态
                this.state = {
                    count: 1
                }
            }
            // 组件将要挂载的钩子
            componentWillMount() {
                console.log('componentWillMount')
            }
            // 组件挂载完毕的钩子
            componentDidMount() {
                console.log('componentDidMount')
            }
            add = () => {
                const {count} = this.state
                this.setState({
                    count: count+1
                })
            }
            death = () => {
                ReactDOM.unmountComponentAtNode(document.querySelector('#test1'))
            }
            // 组件卸载的钩子
            componentWillUnmount() {
                console.log('componentWillUnmount');
            }
            /* 
                控制组件更新的阀门钩子
                点击 +1
                默认已有，返回 true，如果重写必须有返回值，且返回值为boolean
                如果返回false，则不更新
            */
            shouldComponentUpdate() {
                console.log('shouldComponentUpdate')
                return true
            }
            // 组件将要更新的钩子
            componentWillUpdate() {
                console.log('componentWillUpdate')
            }
            // 组件更新完毕的钩子
            componentDidUpdate() {
                console.log('componentDidUpdate')
            }
            render(){
                console.log('render')
                return (
                    <div>
                        <h2>当前求和为{this.state.count}</h2>
                        <button onClick={this.add}>+1</button>
                        <button onClick={this.death}>关闭</button> 
                    </div>
                )
            }
        }
        ReactDOM.render(<Count/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

- shouldComponentUpdate： 默认已经有了，如果重写，需要返回boolean值，返回true则开启阀门，返回false则关闭阀门。
- 点击+1，触发setState

-  shouldComponentUpdate

-  componentWillUpdate

-  render

-  componentDidUpdate

### 26.生命周期(旧)—forceUpdate流程

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Count extends React.Component {
            constructor(props) {
                super(props)
                console.log('constructor')
                // 初始化状态
                this.state = {
                    count: 1
                }
            }
            // 组件将要挂载的钩子
            componentWillMount() {
                console.log('componentWillMount')
            }
            // 组件挂载完毕的钩子
            componentDidMount() {
                console.log('componentDidMount')
            }
            add = () => {
                const {count} = this.state
                this.setState({
                    count: count+1
                })
            }
            death = () => {
                ReactDOM.unmountComponentAtNode(document.querySelector('#test1'))
            }
            force = () => {
                this.forceUpdate()
            }
            // 组件卸载的钩子
            componentWillUnmount() {
                console.log('componentWillUnmount');
            }
            /* 
                控制组件更新的阀门钩子
                点击 +1
                默认已有，返回 true，如果重写必须有返回值，且返回值为boolean
                如果返回false，则不更新
            */
            shouldComponentUpdate() {
                console.log('shouldComponentUpdate')
                return false
            }
            // 组件将要更新的钩子
            componentWillUpdate() {
                console.log('componentWillUpdate')
            }
            // 组件更新完毕的钩子
            componentDidUpdate() {
                console.log('componentDidUpdate')
            }
            render(){
                console.log('render')
                return (
                    <div>
                        <h2>当前求和为{this.state.count}</h2>
                        <button onClick={this.add}>+1</button>
                        <button onClick={this.death}>关闭</button>
                        <button onClick={this.force}>不更改任何状态中的数据，强制更新一下</button> 
                    </div>
                )
            }
        }
        ReactDOM.render(<Count/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

- 点击“不更改任何状态中的数据，强制更新一下”

  omponentWillUpdate

   render

   componentDidUpdate

### 27.生命周期(旧)—父组件render流程

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class A extends React.Component {
            state = {
                carName: '奔驰'
            }
            changeCar = () => {
                this.setState({
                    carName: '本田'
                })
            }
            render() {
                return (
                    <div>
                        <div>A</div>
                        <button onClick={this.changeCar}>换车</button>
                        <B carName={this.state.carName}/>
                    </div>
                )
            }
        }
        class B extends React.Component {
            // 首次接收的不出发，后续的才触发(点击换车后)
            componentWillReceiveProps() {
                console.log('componentWillReceiveProps')
            }
            render() {
                return(
                    <div>我是B组件，接收到的车是:{this.props.carName}</div>
                )
            }
        }
        ReactDOM.render(<A/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

- 点击换车
- componentWillReceiveProps

### 28.生命周期(旧)总结

1. 初始化阶段

- constructor()
- componentWillMount()
- render()
- componentDidMount() ==>一般在这个钩子中做一些初始化的事，如开启定时器、发送网络请求、订阅消息

2. 更新阶段：由组件内部 this.setState()或父组件重新 render 触发

- shouldComponentUpdate()
-  componentWillUpdate()
-  render()
-  componentDidUpdate()

3. 卸载组件：由ReactDom.unmountComponentAtNode()触发

- componentWillUnmount() ==>一般在这个钩子中做一些收尾的事，如关闭定时器、取消订阅消息

### 29.新旧生命周期对比

- componentWillMount ==>UNSAFE_componentWillMount 
- componentWillUpdate ==>UNSAFE_componentWillUpdate
- componentWillReceiveProps ==>UNSAFE_componentWillReceiveProps

### 30.新生命周期getDerivedStateFromProps()

- 直译：从props得到一个派生的状态
- 新生命周期：去掉三个钩子：componentWillMount 、componentWillUpdate 、componentWillReceiveProps 
- 新生命周期：新增两个钩子：getDerivedStateFromProps

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

```html
<!-- 引入 react 核心库 -->
<script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
<script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
<script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
<script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->

<script type="text/babel">
    class Count extends React.Component {
        constructor(props) {
            super(props)
            console.log('constructor')
            // 初始化状态
            this.state = {
                count: 1
            }
        }
        // 必须加 static
        // 返回状态对象,如果 state 的值在任何时候都取决于props 时使用，入参可以接收props和state
        // 由于其横跨挂载和更新，所以挂载和更新都触发，导致点击+1还是不变(108)
        static getDerivedStateFromProps(props, state) {
            console.log('getDerivedStateFromProps')
            return props
        }
        // 组件挂载完毕的钩子
        componentDidMount() {
            console.log('componentDidMount')
        }
        add = () => {
            const {count} = this.state
            this.setState({
                count: count+1
            })
        }
        death = () => {
            ReactDOM.unmountComponentAtNode(document.querySelector('#test1'))
        }
        // 组件卸载的钩子
        componentWillUnmount() {
            console.log('componentWillUnmount');
        }
        /* 
            控制组件更新的阀门钩子
            点击 +1
            默认已有，返回 true，如果重写必须有返回值，且返回值为boolean
            如果返回false，则不更新
        */
        shouldComponentUpdate() {
            console.log('shouldComponentUpdate')
            return true
        }
        // 组件更新完毕的钩子
        componentDidUpdate() {
            console.log('componentDidUpdate')
        }
        render(){
            console.log('render')
            return (
                <div>
                    <h2>当前求和为{this.state.count}</h2>
                    <button onClick={this.add}>+1</button>
                    <button onClick={this.death}>关闭</button> 
                </div>
            )
        }
    }
    ReactDOM.render(<Count count={108}/>, document.querySelector('#test1'))
</script>
```

- 必须加 static
- 返回状态对象,如果 state 的值在任何时候都取决于props 时使用，入参可以接收props和state
- 由于其横跨挂载和更新，所以挂载和更新都触发，导致点击+1还是不变(108)
-  logs:
  - constructor
  - getDerivedStateFromProps
  -  render
  - componentDidMount

### 31.新生命周期getSnapshotBeforeUpdate()

- 直译：在更新之前获取快照

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->
    
    <script type="text/babel">
        class Count extends React.Component {
            constructor(props) {
                super(props)
                console.log('constructor')
                // 初始化状态
                this.state = {
                    count: 1
                }
            }
            // 必须加 static
            // 返回状态对象,如果 state 的值在任何时候都取决于props 时使用，入参可以接收props和state
            static getDerivedStateFromProps(props, state) {
                console.log('getDerivedStateFromProps')
                return null
            }
            // 在最近一次渲染输出前调用，其两个参数分别为渲染前的 props和state
            // 作用：使组件能在发生更改之前捕获一些信息（例如：滚轮、移动位置）
            // 此生命周期的任何返回值将作为参数传递给 componentDidUpdate()
            getSnapshotBeforeUpdate(prevProps, prevState) {
                console.log(prevProps, prevState)
                console.log('getSnapshotBeforeUpdate')
                return 'liuguowei'
            }
            // 组件更新完毕的钩子
            // prevProps 和 prevState 也是渲染前的 props和state
            // snapshotValue 为 getSnapshotBeforeUpdate 传递的快照值
            componentDidUpdate(prevProps, prevState, snapshotValue) {
                console.log(prevProps, prevState, snapshotValue)
                console.log('componentDidUpdate')
            }
            // 组件挂载完毕的钩子
            componentDidMount() {
                console.log('componentDidMount')
            }
            add = () => {
                const {count} = this.state
                this.setState({
                    count: count+1
                })
            }
            death = () => {
                ReactDOM.unmountComponentAtNode(document.querySelector('#test1'))
            }
            // 组件卸载的钩子
            componentWillUnmount() {
                console.log('componentWillUnmount');
            }
            /* 
                控制组件更新的阀门钩子
                点击 +1
                默认已有，返回 true，如果重写必须有返回值，且返回值为boolean
                如果返回false，则不更新
            */
            shouldComponentUpdate() {
                console.log('shouldComponentUpdate')
                return true
            }
            render(){
                console.log('render')
                return (
                    <div>
                        <h2>当前求和为{this.state.count}</h2>
                        <button onClick={this.add}>+1</button>
                        <button onClick={this.death}>关闭</button> 
                    </div>
                )
            }
        }
        ReactDOM.render(<Count count={108}/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```

- 点击 + 1
- getDerivedStateFromProps
- shouldComponentUpdate
- render
- {count: 108} {count: 1}   getSnapshotBeforeUpdate
- {count: 108} {count: 1} 'liuguowei'    componentDidUpdate

### 31.getSnapshotBeforeUpdate()例子

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello_react</title>
</head>
<style>
    .list {
        width: 200px;
        height: 150px;
        background-color: pink;
        overflow: auto;
    }
    .news {
        height: 30px;
    }
</style>
<body>
    <div id="test1"></div>

    <!-- 引入 react 核心库 -->
    <script src="./js/react.development.js" type="text/javascript"></script> <!-- React 对象 -->
    <script src="./js/react-dom.development.js" type="text/javascript"></script> <!-- ReactDOM 对象 -->
    <script src="./js/babel.min.js" type="text/javascript"></script> <!-- babel -->
    <script src="./js/prop-types.js" type="text/javascript"></script> <!-- PropTypes -->

    <script type="text/babel">
        class NewsList extends React.Component {
            state = {
                newsArr: []
            }
            componentDidMount() {
                setInterval(() => {
                    const { newsArr } = this.state
                    const news = '新闻'+(newsArr.length+1)
                    this.setState({
                        newsArr: [news, ...newsArr]
                    })
                }, 1000)
            }
            getSnapshotBeforeUpdate() {
                return this.refs.list.scrollHeight
            }
            componentDidUpdate(preProps, preState, height) {
                this.refs.list.scrollTop += this.refs.list.scrollHeight - height
            }
            render() {
                return(
                    <div className="list" ref="list">
                            {
                                this.state.newsArr.map((item, index) => {
                                    return <div className="news" key={index}>{item}</div>
                                })
                            }
                    </div>
                )
            }
        }
        ReactDOM.render(<NewsList/>, document.querySelector('#test1'))
    </script>
</body>
</html>
```



### 32.新生命周期总结

1.初始化阶段:由ReactDOM.render()触发----初次渲染

- constructor
- getDerivedStateFromProps
-  render
- componentDidMount(一般进行初始化的事情，如网络请求、定时器)

2.更新阶段：由组件内部 this.setState()或父组件重新render触发

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

3.卸载组件：由ReactDOM.unmountComponentAtNode触发

- componentWillUnmount

### 33.DOM的diff算法

1. 虚拟DOM中key的作用
   - 简单：key是虚拟DOM对象的标识，在更新显示时key起着极其重要的作用
   - 详细：当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】，随后react进行【新虚拟DOM】与【旧虚拟DOM】进行diff比较，比较规则如下
     - 旧虚拟DOM中找到与新虚拟DOM相同的key：
       - 若虚拟DOM中内容没变，直接使用之前的真实DOM
       - 若虚拟DOM中内容变了，则生产新的真实DOM,随后替换掉页面中之前的真实DOM
     - 旧虚拟DOM中未找到与新虚拟DOM相同的key
       - 根据数据创建新的真实DOM,随后渲染到页面
2. 用index作为key可能会引发的问题
   - 若对数据进行：逆序添加、逆序删除等破坏顺序操作：
     - 会产生没有必要的真实DOM更新==>界面效果没问题，但效率低
   - 如果结构中还包含输入类的DOM:
     - 会产生错误DOM更新 ==> 界面有问题
   - 注意：如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的

