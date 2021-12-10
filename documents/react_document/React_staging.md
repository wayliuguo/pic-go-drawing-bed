### 1.使用 create-react-app 创建 react 应用

```
// 全局安装
npm i create-react-app -g
// 创建项目 
create-react-app 项目名
// 显示webpack配置文件
 npm run eject
```

### 2.样式模块化

```
// 未模块化，导致冲突
// Hello/index.jsx
import React,{Component} from "react";
import './index.css'

export default class Hello extends Component {
    render() {
        return (
            <h2 className="title">hello</h2>
        )
    }
}
// Hello/index.css
.title {
    background: pink;
}


// Welcome/index.jsx
import React,{Component} from "react";
import './index.css'

export default class Welcome extends Component {
    render() {
        return (
            <h2 className="title">Welcome</h2>
        )
    }
}
// Welcome/index.css
.title {
    background: blue;
}
```

如果要使用模块化，必须做两件事情

- 两个组件的index.css改名为index.module.css
- jsx中引入使用变量接收css，命名时使用{变量.类名}

```
import React,{Component} from "react"
import hello from './index.module.css'

export default class Hello extends Component {
    render() {
        return (
            <h2 className={hello.title}>hello</h2>
        )
    }
}

import React,{Component} from "react"
import welcome from './index.module.css'

export default class Welcome extends Component {
    render() {
        return (
            <h2 className={welcome.title}>Welcome</h2>
        )
    }
}
```

### 3.vscode中react插件的安装

- 插件：ES7 React/Redux/GraphQL/React-Native snippets
- rfc：函式组件
- rcc：类式组件

### 4.todoList

#### 4.1 生成随机数

```
npm i nanoid

import {nanoid} from 'nanoid'
const todoObj = {id:nanoid(),name:target.value,done:false}
```

#### 4.2 子组件向父组件传值

Header 组件

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {nanoid} from 'nanoid'
import './index.css'

export default class Header extends Component {

	//对接收的props进行：类型、必要性的限制
	static propTypes = {
		addTodo:PropTypes.func.isRequired
	}

	//键盘事件的回调
	handleKeyUp = (event)=>{
		//解构赋值获取keyCode,target
		const {keyCode,target} = event
		//判断是否是回车按键
		if(keyCode !== 13) return
		//添加的todo名字不能为空
		if(target.value.trim() === ''){
			alert('输入不能为空')
			return
		}
		//准备好一个todo对象
		const todoObj = {id:nanoid(),name:target.value,done:false}
		//将todoObj传递给App
		this.props.addTodo(todoObj)
		//清空输入
		target.value = ''
	}

	render() {
		return (
			<div className="todo-header">
				<input onKeyUp={this.handleKeyUp} type="text" placeholder="请输入你的任务名称，按回车键确认"/>
			</div>
		)
	}
}
```

```
import React, { Component } from 'react'
import Header from './components/Header'
import List from './components/List'
import Footer from './components/Footer'
import './App.css'

export default class App extends Component {
	//状态在哪里，操作状态的方法就在哪里

	//初始化状态
	state = {todos:[
		{id:'001',name:'吃饭',done:true},
		{id:'002',name:'睡觉',done:true},
		{id:'003',name:'打代码',done:false},
		{id:'004',name:'逛街',done:false}
	]}

	//addTodo用于添加一个todo，接收的参数是todo对象
	addTodo = (todoObj)=>{
		//获取原todos
		const {todos} = this.state
		//追加一个todo
		const newTodos = [todoObj,...todos]
		//更新状态
		this.setState({todos:newTodos})
	}
	render() {
		const {todos} = this.state
		return (
				<Header addTodo={this.addTodo}/>
				...
```

- 在父组件中通过 props 传递一个回调函数给子组件

  - ```
    <Header addTodo={this.addTodo}/>
    ```

- 在子组件中通过调用父组件中传递过来的函数通过参数把值传递给父组件

  - this.props.addTodo(todoObj)

#### 4.3对props进行限制

```
npm i prop-types

import PropTypes from 'prop-types'
...
static propTypes = {
	addTodo:PropTypes.func.isRequired
}
```

### 5.react ajax

#### 5.1配置代理的两种方式

```
// package.json
"proxy": "http://localhost:5000"

// src/setupProxy.js
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
	app.use(
		proxy('/api1', { // 遇见api1前缀的请求，就会触发该代理
			target: 'http://localhost:5000', // 请求转发给谁
			changeOrigin: true, // 控制服务器收到的请求头中的Host的值
			pathRewrite: {'/api1': ''} // 重写请求路径
		}),
		proxy('/api2', {
			target: 'http://localhost:3000',
			changeOrigin: true,
			pathRewrite: {'/api2': ''}
		})
	)
}
```

#### 5.2消息订阅与发布机制

- 订阅报纸

  1. 交钱，说好地址，订阅哪一种报纸
  2. 邮递员送报纸

- 订阅消息：

  1. 消息名
  2. 发布消息

- 工具库: PubSubJS

- 下载

  ```
  npm i pubsub-js
  ```

  ```
  // 订阅与解除订阅
  componentDidMount() {
  	this.token = PubSub.subscribe('updateState', (msg, data) => {
  			this.setState(data)
  	})
  }
  componentWillUnmount() {
  	PubSub.unsubscribe(this.token)
  }
  
  // 发布
  search = async () => {
  	PubSub.publish('updateState', {
          isFirst: false,
          isLoading: true,
          err: false
      })
      // 获取用户的输入(连续解构赋值+重命名)
      const { keywordElement:{value:keyword}} = this
      // 发送网络请求
      try {
      	const result = await searchForJson(keyword)
      	PubSub.publish('updateState', {
      		users: result.data.items,
      		isLoading: false,
      	})
      } catch (err) {
      	PubSub.publish('updateState', {
      		err: err.message,
      		isLoading: false,
      	})
      }
  }
  ```
  

### 6. react-router-dom

#### 6.1 路由中的基本使用

```
npm i react-router-dom
```

**路由器(Router)种类**

- BrowserRouter
- HashRouter

**注册路由(Route)**

- Route 必须被路由器包裹，用于注册路由

  ```
  <Route path="/about" component={About}/>
  <Route path="/home" component={Home}/>
  ```

**路由链接(Link)**

```
<Link className="list-group-item" to="/about">About</Link>
<Link className="list-group-item" to="/home">Home</Link>
```

```
import './App.css';
import { Link, BrowserRouter, Route } from 'react-router-dom'
import About from './components/About';
import Home from './components/Home';

function App() {
  return (
    <div>
      <div className="row">
        <div className="col-xs-offset-2 col-xs-8">
          <div className="page-header"><h2>React Router Demo</h2></div>
        </div>
      </div>
      <BrowserRouter>
        <div className="row">
          <div className="col-xs-2 col-xs-offset-2">
            <div className="list-group">
              {/* 原生路由中，靠a标签跳转不同页面 */}
              {/* <a class="list-group-item active" href="./about.html">About</a>
              <a class="list-group-item" href="./home.html">Home</a> */}

              {/* 编写路由链接 */}
              <Link className="list-group-item" to="/about">About</Link>
              <Link className="list-group-item" to="/home">Home</Link>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="panel">
              <div className="panel-body">
                {/* 注册路由 */}
                <Route path="/about" component={About}/>
                <Route path="/home" component={Home}/>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

```

- 这里使用的路由器是 BrowserRouter

- 同样的路由只能由一个路由器包裹，也可以去掉上面的 BrowserRouter,直接使用下面方式

  ```
  import React from 'react';
  import ReactDOM from 'react-dom';
  import { BrowserRouter } from 'react-router-dom'
  import './index.css';
  import App from './App';
  import reportWebVitals from './reportWebVitals';
  
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
  
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  
  ```


#### 6.2 一般组件与路由组件的区别

1. 写法不同

   - 一般组件：

     ```
     <Demo />
     ```

   - 路由组件

     ```
     <Route path="/about" component={About}/>
     ```

2. 存放位置不同

   - 一般组件：component
   - 路由组件： pages

3. 接收到的props不同

   - 一般组件：写组件标签时传递了什么，就能收到什么

   - 路由组件：接收到三个固定的属性

     ```
     history:
         action: "PUSH"
         block: ƒ block(prompt)
         createHref: ƒ createHref(location)
         go: ƒ go(n)
         goBack: ƒ goBack()
         goForward: ƒ goForward()
         length: 10
         listen: ƒ listen(listener)
         location: {pathname: '/about', search: '', hash: '', state: undefined, key: '2yemhp'}
         push: ƒ push(path, state)
         replace: ƒ replace(path, state)
     	[[Prototype]]: Object
     location:
         hash: ""
         key: "2yemhp"
         pathname: "/about"
         search: ""
         state: undefined
         [[Prototype]]: Object
     match:
         isExact: true
         params: {}
         path: "/about"
         url: "/about"
         [[Prototype]]: Object
      staticContext: undefined
     ```


#### 6.3 NavLink 的使用

```
<NavLink activeClassName="aboutActive" className="list-group-item"  to="/about">About</NavLink>
<NavLink activeClassName="homeActive" className="list-group-item" to="/home">Home</NavLink>
```

#### 6.4封装NavLink组件

```
1.普通封装
// components/myNavLink/index.jsx
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class MyNavLink extends Component {
    render() {
        const { to, title } = this.props
        return (
             <NavLink activeClassName="aboutActive" className="list-group-item" to={to}>{title}</NavLink>
        )
    }
}
//使用
<MyNavLink  to="/about" title="About" />
<MyNavLink className="list-group-item" to="/home" title="Home" />

// 2.自闭合封装
// components/myNavLink/index.jsx
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class MyNavLink extends Component {
    render() {
        const { to, title } = this.props
        return (
             <NavLink activeClassName="aboutActive" className="list-group-item" {...this.props}></NavLink>
        )
    }
}
// 使用
<MyNavLink  to="/about">About</MyNavLink>
<MyNavLink to="/home" title="Home">Home</MyNavLink>
//通过 props.children可接收到标签体内容，即<NavLink activeClassName="aboutActive" className="list-group-item" {...this.props}>{this.props.children}</NavLink>
```

#### 6.5 Switch的使用

```
import { Route, Switch } from 'react-router-dom'
...
<Switch>
	<Route path="/about" component={About}/>
    <Route path="/home" component={Home}/>
    <Route path="/home" component={Home}/>
</Wwitch>
```

- 使用了Switch包裹后，只匹配第一个，如果没有包裹的话，就都展示

#### 6.6解决样式丢失问题

1. 出现原因

   - 如果访问的路径没有匹配到，将返回localhost:3000下的index.html(/public/index.html)

   - ```
     <MyNavLink  to="/well/about">About</MyNavLink>
     <MyNavLink to="/well/home" title="Home">Home</MyNavLink>
     ```

   - 点击路由再刷新就会出现样式丢失，原因是路由不匹配返回了/public/index.html，这个index.html引入

     ```
     <link rel="stylesheet" href="./css/bootstrap.css">
     ```

     路径解析为 

     ```
     http://localhost:3000/well/css/bootstrap.css
     ```

     就没有返回样式文件，路径错误就返回Index.html

2. 解决方案

   - 使用绝对路径

     ```
     <link rel="stylesheet" href="/css/bootstrap.css">
     ```

   - 使用%PUBLIC_URL%

     ```
     <link rel="stylesheet" href="%PUBLIC_URL%/css/bootstrap.css">
     ```

   - 使用 HashRouter（#后边视为前端资源，不带给后端）

#### 6.7 严格匹配与模糊匹配

- 默认使用的是模糊匹配
- 开启严格匹配 exact={true}
- 严格匹配不要随便开启，需要再开，有些时候开启会导致无法继续匹配二级路由

```
// 模糊匹配
<MyNavLink  to="/about">About</MyNavLink>
<MyNavLink to="/home/a/b" title="Home">Home</MyNavLink>
...
<Route path="/about" component={About}/>
<Route path="/home" component={Home}/>

// 严格匹配
<MyNavLink  to="/about">About</MyNavLink>
<MyNavLink to="/home/a/b" title="Home">Home</MyNavLink>
...
<Route path="/about" component={About}/>
<Route path="/home" exact={true} component={Home}/>
```

#### 6.8 Rediect 的使用

```
import { Route, Redirect } from 'react-router-dom'
...
<Route path="/about" component={About}/>
<Route path="/home" component={Home}/>
<Redirect to="/about" />
```

- 在前面的匹配不上的时候匹配to对应得路由

#### 6.9 嵌套路由

```
import React, { Component } from 'react'
import MyNavLink from '../../components/MyNavLink'
import { Route, Switch } from 'react-router'
import News from './News'
import Message from './Message'

export default class Home extends Component {
    render() {
        return (
            <div>
            <h3>我是Home的内容</h3>
            <div>
                <ul className="nav nav-tabs">
                  <li>
                    <MyNavLink to="/home/news">News</MyNavLink>
                  </li>
                  <li>
                    <MyNavLink to="/home/message">Message</MyNavLink>
                  </li>
                </ul>
                <Switch>
                    <Route path="/home/news" component={News} />
                    <Route path="/home/message" component={Message} />
                </Switch>
              </div>
            </div>
        )
    }
}

```

#### 6.10 路由传参

##### 6.10.1params传参

```
// Message/index.jsx
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import Detail from '../../../components/Detail'

export default class Message extends Component {
    state = {
        messageArr: [
            {
                id: '01',
                title: '消息1'
            },
            {
                id: '02',
                title: '消息2'
            },
            {
                id: '03',
                title: '消息3'
            }
        ]
    }
    render() {
        const { messageArr } = this.state
        return (
            <div>
                <ul>
                    {
                        messageArr.map(item => {
                            return (
                                <li key={item.id}>
                                    {/* <Link to="/home/message/detail">{item.title}</Link> */}
                                    {/* 向路由组件传递 params 参数 */}
                                    <Link to={`/home/message/detail/${item.id}/${item.title}`}>{item.title}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
                <hr />
                {/* <Route path="/home/message/detail" component={Detail}></Route> */}
                {/* 声明接收params参数 */}
                <Route path="/home/message/detail/:id/:title" component={Detail}></Route>
            </div>
        )
    }
}
```

```
// Detail/index.jsx

import React, { Component } from 'react'

const detailData = [
    {
        id: '01',
        content: '深圳'
    },
    {
        id: '02',
        content: '北京'
    },
    {
        id: '03',
        content: '上海'
    }
]
export default class Detail extends Component {
    render() {
        console.log(this.props)
        const { id, title} = this.props.match.params
        const findResult = detailData.find(detailObj => {
            return detailObj.id == id
        })
        return (
            <ul>
                <li>ID: {id}</li>
                <li>TITLE: {title}</li>
                <li>CONTENT: {findResult.content}</li>
            </ul>
        )
    }
}
```

- 关键代码

```
<Link to={`/home/message/detail/${item.id}/${item.title}`}>{item.title}</Link>
...
{/* 声明接收params参数 */}
<Route path="/home/message/detail/:id/:title" component={Detail}></Route>
...
// 对应路由组件中可以通过 props获取
const { id, title} = this.props.match.params
```

##### 6.10.2 search 传参

```
{/* 向路由组件传递 search 参数 */}
<Link to={`/home/message/detail/?id=${item.id}&title=${item.title}`}>{item.title}</Link>
...
{/* search参数无需声明接收 */}
<Route path="/home/message/detail" component={Detail}></Route>
```

```
// 接收参数
import qs from 'querystring'
const { search } = this.props.location // ?id=???&title=???
const {id, title} = qs.parse(search.slice(1))
```

##### 6.10.3 state 传参

```
/* 向路由组件传递 state 参数 */}
<Link  to={{pathname:'/home/message/detail', state:{id:item.id,title:item.title}}}>{item.title}</Link>
{/* state参数无需声明接收 */}
<Route path="/home/message/detail" component={Detail}></Route>
```

```
// 接收参数
const {id, title} = this.props.location.state
```

#### 6.11 push 和 replace模式

- 默认是push模式，会压栈
- 如果用 replace模式，则不会压栈，则浏览器路由没有历史

```
<Link replace to="/home/message/detail">{item.title}</Link>
```

#### 6.11 编程式路由导航

- push、replace及三种携带参数

```
<button onClick={() => this.pushShow(item.id, item.title)}>push 查看</button>
<button onClick={this.replaceShow(item.id, item.title)}>replace 查看</button>
```

```
replaceShow = (id, title) => {
	return () => {
    // 编写一段代码，让其实现跳转到Detail组件，且为replace跳转(携带 params 参数)
    this.props.history.replace(`/home/message/detail/${id}/${title}`)
    // 编写一段代码，让其实现跳转到Detail组件，且为replace跳转(携带 search 参数)
    // this.props.history.replace(`/home/message/detail/?id=${id}&title=${title}`)
    // 编写一段代码，让其实现跳转到Detail组件，且为replace跳转(携带 state 参数)
    // this.props.history.replace(`/home/message/detail`, {id, title}) 
    }
}
pushShow = (id, title) => {
	this.props.history.push((`/home/message/detail/${id}/${title}`))
}
```

- goBack、goForward、go

  ```
  <button onClick={this.back}>回退</button>
  <button onClick={this.forward}>前进</button>
  <button onClick={this.go}>跳转</button>
  ```

  ```
  back = () => {
  	this.props.history.goBack()
  }
  forward = () => {
  	this.props.history.goForward()
  }
  go = () => {
  	this.props.history.go(-2)
  }
  ```

#### 6.12 withRouter的使用

```
import React, { Component } from 'react'
import { withRouter } from 'react-router'
class Header extends Component {
    back = () => {
        this.props.history.goBack()
    }
    forward = () => {
        this.props.history.goForward()
    }
    go = () => {
        this.props.history.go(-2)
    }
    render() {
        return (
            <div className="page-header">
                <h2>React Router Demo</h2>
                <button onClick={this.back}>回退</button>
                <button onClick={this.forward}>前进</button>
                <button onClick={this.go}>跳转</button>
            </div>
        )
    }
}

export default withRouter(Header)
```

**withRouter 可以加工一般组件，让一般组件具备路由组件所特有的API**

**withRouter 的返回值是一个新组件**

#### 6.13 BrowserRouter 与 HashRouter 的区别

1. 底层原理不同
   - BrowserRouter 使用的是H5的history API,不兼容IE9及已下版本
   - HashRouter  使用的是URL的哈希值
2. path表现形式不同
3. 刷新后对路由state参数的影响
   - BrowserRouter  没有任何影响，因为state保存在history对象中
   - HashRouter 刷新后悔导致路由 state 参数的丢失
4. 备注：HashRouter可以由于解决一些路径错误相关的问题

### 7. redux

#### 7.1 redux理解

##### 7.1.1 学习文档

- 英文文档: https://redux.js.org/
- 中文文档: http://www.redux.org.cn/

##### 7.1.2 redux 是什么？

1. redux是一个专门用于做状态管理的JS库（不是React插件库）
2. 它可以用再angular、react、vue等项目中，但基本与react配合使用
3. 作用：集中式管理react应用中多个组件共享的状态

##### 7.1.3 什么情况下需要需用redux

1. 某个组件的状态，需要其他组件可以随时拿到（共享）
2. 一个组件需要改变另一个组件的状态（通信）
3. 总体原则：能不用就不用，如果不用比较吃力才考虑使用



#### 7.2 redux 工作流程

![redux原理图](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/redux%E5%8E%9F%E7%90%86%E5%9B%BE.png)

##### 7.2.1 action

1. 动作的对象
2. 包含2个属性
   - type: 标识属性，值为字符串，唯一，必要属性
   - data：数据属性，值类型任意，可选属性
3. 例子：{type:'ADD_STUDENT',DATA:{name:'tom',age:18}}

##### 7.2.2 reducer

1. 用于初始化状态，加工状态
2. 加工时，根据旧的state 和 action，产生新的 state 的纯函数

##### 7.2.3 store

1. 将 state、action、reducer联系在一起的对象
2. 如何得到此对象？
   - import {createStore} from 'redux'
   - import reducer from './reducers‘
   - const store = createStore(reducer)
3. 此对象的功能？
   - getState(): 得到 state
   - dispatch(action)：分发action，触发reducer调用，产生新的state
   - subscribe(listener):注册监听，当产生新的state时，自动调用

#### 7.3 求和案例(精简版)

##### 7.3.1 关键代码

```
npm i redux
```

```
// src/redux/store.js

/**
 * 该文件用于暴露一个store对象，整个应用只用一个store对象
 */

// 引入createStore 用于创建redux最为核心的store对象
import { createStore } from "redux"
// 引入为count组件服务的reducer
import countReducer from './count_reducer'

export default createStore(countReducer)
```

```
// src/redux/count_redux.js

/**
 * 该文件是用于创建一个count组件服务的reducer，reducer的本质就是一个函数
 * reducer函数会
 */

const initState = 0
export default function countReducer(preState=initState, action) {
	// 从action 对象中获取：type、action,action中的初始化只有type，形式:{type: '@@redux/INITs.m.j.8.h'}
	const {type, data} = action
	// 根据type处理
	switch (type) {
		case 'increment':
			return preState + data
		case 'decrement':
			return preState - data
		default:
			return 0
	}
}
```

```
// components/Count/index.jsx

import React, { Component } from 'react'
// 引入store，用于获取redux中保存状态
import store from '../../redux/store'

export default class Count extends Component {
	
	componentDidMount() {
		// 检测redux中状态的变化，只要变化，就调用render
		store.subscribe(() => {
			this.setState({}) // 利用setState触发render，但是会有效率上的问题
		})
	}

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
		store.dispatch({type: 'increment', data: value*1})
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
		store.dispatch({type: 'decrement', data: value*1})
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		const count = store.getState()
		if(count % 2 !== 0){
			store.dispatch({type: 'increment', data: value*1})
		}
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		setTimeout(()=>{
			store.dispatch({type: 'increment', data: value*1})
		},500)
	}

	render() {
		return (
			<div>
				<h1>当前求和为：{store.getState()}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}
```

为了方便，可以在src/index.js下利用store.subscribe()监听更新。

##### 7.3.2总结笔记

- store.js
  - 引入redux中的createStore函数,创建一个store
  - createStore调用时要传入一个为其服务的reducer
  - 记得暴露store对象
- count_reducer.js
  - reducer的本质是一个函数，接收:preState、action，返回加工后的状态
  - reducer有两个作用，初始化状态，加工状态
  - reducer被第一次调用时，是store自动触发的，传递的preState是undefined，传递的action类似{type: '@@redux/INITs.m.j.8.h'}
- 在index.js中检测store状态的改变，一旦发生改变重新渲染<App/>
  - redux只负责管理状态，至于状态的改变驱动着页面的展示，要靠我们自己写

#### 7.4 求和案例（完整版）

```
// src/redux/count_action.js

/**
 * 该文件专门为Count组件生成action对象
 */

export const createIncrementAction = data => ({type: 'increment', data})

export const createDecementAction = data => ({type: 'decrement', data})

// components/Count/index.jsx

import React, { Component } from 'react'
// 引入store，用于获取redux中保存状态
import store from '../../redux/store'
// 引入actionCreator，专门用于创建action对象
import { createIncrementAction, createDecementAction } from '../../redux/count_action'

export default class Count extends Component {
	
	// componentDidMount() {
	// 	// 检测redux中状态的变化，只要变化，就调用render
	// 	store.subscribe(() => {
	// 		this.setState({}) // 利用setState触发render，但是会有效率上的问题
	// 	})
	// }

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
		store.dispatch(createIncrementAction(value * 1))
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
		store.dispatch(createDecementAction(value * 1))
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		const count = store.getState()
		if(count % 2 !== 0){
			store.dispatch(createIncrementAction(value * 1))
		}
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		setTimeout(()=>{
			store.dispatch(createIncrementAction(value * 1))
		},500)
	}

	render() {
		return (
			<div>
				<h1>当前求和为：{store.getState()}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}

```

- 使用count_action.js作为action Creator 生产actions
- 在组件中使用生成的action

#### 7.5 求和案例（异步action版）

```
npm i redux-thunk
```

```
// src/redux/count_action.js
...
// 异步action，指的是action的值为函数
export const createIncrementAsyncAction =  (data, timer) =>  {
    return () => {
        // 在函数体里进行异步任务
        setTimeout(() => {
            store.dispatch(createIncrementAction(data * 1))
        }, timer)
    }
}

// src/components/Count/index.jsx
...
// 引入actionCreator，专门用于创建action对象
import { createIncrementAction, createDecementAction, createIncrementAsyncAction } from '../../redux/count_action'

//异步加
incrementAsync = ()=>{
    const {value} = this.selectNumber
    store.dispatch(createIncrementAsyncAction(value * 1))
}


// src/redux/store.js
/**
 * 该文件用于暴露一个store对象，整个应用只用一个store对象
 */

// 引入createStore 用于创建redux最为核心的store对象
import { createStore, applyMiddleware } from "redux"
// 引入为count组件服务的reducer
import countReducer from './count_reducer'
// 引入redux-thunk，用于支持异步action
import thunk from "redux-thunk"

export default createStore(countReducer, applyMiddleware(thunk))
```

- 异步action指的是函数，同步action值的是Object的普通对象
- 在异步action返回的函数体中进行异步操作，异步操作后调用对应的同步操作
- 异步action需要配合redux-thunk使用：applyMiddleWare(thunk)作为createStore的第二个参数

#### 7.6 react-redux

![react-redux模型图](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/react-redux%E6%A8%A1%E5%9E%8B%E5%9B%BE.png)

```
npm i react-redux
```

```
// src/containers/Count/index.jsx

// 引入Count的UI组件
import CountUI from '../../components/Count'
// 引入connect用于连接UI组件与redux
import { connect } from 'react-redux'

// 使用connect()()创建并暴露一个Count的容器组件
export default connect()(CountUI)

//src/App.jsx 

import React, { Component } from 'react'
import Count from './containers/Count' // 容器组件
import store from './redux/store' // 引入store

export default class App extends Component {
	render() {
		return (
			<div>
				<Count store={store}/>
			</div>
		)
	}
}

```

```
// src/Containers/Count/index.jsx（容器组件）
// 引入Count的UI组件
import CountUI from '../../components/Count'
// 引入connect用于连接UI组件与redux
import { connect } from 'react-redux'
// 引入 action
import {
    createIncrementAction,
    createDecementAction,
    createIncrementAsyncAction
} from '../../redux/count_action'


// mapStateToProps 函数返回的是一个对象
// 返回的对象中的key就作为传递给UI组件props的key，value就作为传递给UI组件的props的value
// mapStateToProps 用于传递状态
function mapStateToProps(state) {
    return {
        count: state
    }
}

// mapDispatchToProps 函数返回的是一个对象
// 返回的对象中的key就作为传递给UI组件props的key，value就作为传递给UI组件的props的value
// mapStateToProps 用于传递操作状态的方法
function mapDispatchToProps(dispatch) {
    return {
        jia:number =>  dispatch(createIncrementAction(number)),
        jian: number => dispatch(createDecementAction(number*1)),
        jiaAsync: (number, timer) => dispatch(createIncrementAsyncAction(number*1, timer))
    }
}


// 使用connect()()创建并暴露一个Count的容器组件
export default connect(mapStateToProps, mapDispatchToProps)(CountUI)
```

```
// src/components/Count/index.jsx （UI组件）
import React, { Component } from 'react'

export default class Count extends Component {

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
		this.props.jia(value*1)
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
		this.props.jian(value*1)
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		if(this.props.count %2 !== 0) {
			this.props.jia(value*1)
		}
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		this.props.jiaAsync(value*1, 500)
	}

	render() {
		return (
			<div>
				<h1>当前求和为：{this.props.count}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}
```

- 明确两个概念：
  - UI组件：不能使用任何redux的api，只负责页面的呈现、交互等
  - 容器组件：负责和redux通信，将结果交给UI组件
- 如何创建一个容器组件——靠react-redux的connect函数
  - connect(mapStateToProps, mapDispatchToProps)（UI组件）
  - mapStateToProps: 映射状态，返回的是一个对象
  - mapDispatchToProps: 映射操作状态的方法，返回值是一个对象
- 备注：容器组件中的store是靠props传进去的，而不是容器组件中直接引入

#### 7.7 react-redux 优化

##### 7.7.1 优化容器组件connect传值

```
// src/Containers/Count/index.jsx（容器组件）

// 引入Count的UI组件
import CountUI from '../../components/Count'
// 引入connect用于连接UI组件与redux
import { connect } from 'react-redux'
// 引入 action
import {
    createIncrementAction,
    createDecementAction,
    createIncrementAsyncAction
} from '../../redux/count_action'


// 使用connect()()创建并暴露一个Count的容器组件
export default connect(
    state => (
        {
            count: state
        }
    ),
    {
        jia: createIncrementAction,
        jian: createDecementAction,
        jiaAsync: createIncrementAsyncAction
    }
    )(CountUI)
```

- 

##### 7.7.2 优化index.js与App.jsx

```
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './redux/store'

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
)
```

- 可以去除手动监测更新，容器组件会完成这部分工作， 即

  ```
  // src/index.js
  ...
  // 监测redux中状态的改变，如果redux状态发生了改变，那么重新渲染App组件
  store.subscribe(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
  })
  ```

- 在App.jsx中可以使用 Provider组件统一给容器组件传 store

```
// src/App.jsx
import React, { Component } from 'react'
import Count from './containers/Count'

export default class App extends Component {
	render() {
		return (
			<div>
				<Count/>
			</div>
		)
	}
}
```

- 去除了手动向每一个容器组件传 store，即

  ```
  import store from './redux/store'
  ...
  <Count store={store}/>
  ```

##### 7.3 优化——把UI组件与容器组件放在同一个文件中

```
// containers/Count/index.jsx

// 引入connect用于连接UI组件与redux
import { connect } from 'react-redux'
// 引入 action
import {
    createIncrementAction,
    createDecementAction,
    createIncrementAsyncAction
} from '../../redux/count_action'
import React, { Component } from 'react'

// UI 组件
class Count extends Component {

	//加法
	increment = ()=>{
		const {value} = this.selectNumber
		this.props.jia(value*1)
	}
	//减法
	decrement = ()=>{
		const {value} = this.selectNumber
		this.props.jian(value*1)
	}
	//奇数再加
	incrementIfOdd = ()=>{
		const {value} = this.selectNumber
		if(this.props.count %2 !== 0) {
			this.props.jia(value*1)
		}
	}
	//异步加
	incrementAsync = ()=>{
		const {value} = this.selectNumber
		this.props.jiaAsync(value*1, 500)
	}

	render() {
		return (
			<div>
				<h1>当前求和为：{this.props.count}</h1>
				<select ref={c => this.selectNumber = c}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>&nbsp;
				<button onClick={this.increment}>+</button>&nbsp;
				<button onClick={this.decrement}>-</button>&nbsp;
				<button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
				<button onClick={this.incrementAsync}>异步加</button>&nbsp;
			</div>
		)
	}
}


// 使用connect()()创建并暴露一个Count的容器组件
export default connect(
    state => (
        {
            count: state
        }
    ),
    {
        jia: createIncrementAction,
        jian: createDecementAction,
        jiaAsync: createIncrementAsyncAction
    }
    )(Count)
```

#### 7.8 Person 组件

