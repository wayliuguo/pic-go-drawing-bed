### 1.vue模板语法

1. 插值语法：
   - 功能：用于解析标签体内容。
   - 写法：{{xxx}}，xxx是js表达式，且可以直接读取到data中的所有属性。
2. 指令语法：
   - 功能：用于解析标签（包括：标签属性、标签体内容、绑定事件.....）。
   - 举例：v-bind:href="xxx" 或  简写为 :href="xxx"，xxx同样要写js表达式，且可以直接读取到data中的所有属性。

### 2.事件处理

1. 基本语法

   ```
   <input type="text" @change="inputChange()">
   <button @click="showInfo2($event,66)">点我提示信息2（传参）</button>
   ```

2. 事件修饰符

   - prevent：阻止默认事件（常用
   - stop：阻止事件冒泡（常用）
   - once：事件只触发一次（常用）
   - capture：使用事件的捕获模式
   - self：只有event.target是当前操作的元素时才触发事件
   - passive：事件的默认行为立即执行，无需等待事件回调执行完毕

### 3.计算属性computed:{}

1. 定义：要用的属性不存在，要通过已有属性计算得来。
2. 原理：底层借助了Objcet.defineproperty方法提供的getter和setter。
3. get函数什么时候执行？
   - 初次读取时会执行一次。
   - 当依赖的数据发生改变时会被再次调用。
4. 优势：与methods实现相比，内部有缓存机制（复用），效率更高，调试方便。
5. 备注：
   - 计算属性最终会出现在vm上，直接读取使用即可。
   - 如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变。

```
computed:{
	fullName:{
	//get有什么作用？当有人读取fullName时，get就会被调用，且返回值就作为fullName的值
	//get什么时候调用？1.初次读取fullName时。2.所依赖的数据发生变化时。
	get(){
	console.log('get被调用了')
	// console.log(this) //此处的this是vm
	return this.firstName + '-' + this.lastName
	},
	//set什么时候调用? 当fullName被修改时。
	set(value){
        console.log('set',value)
        const arr = value.split('-')
        this.firstName = arr[0]
        this.lastName = arr[1]
		}
	}
}


// 简写
fullName() {
	console.log('get被调用了')
    return this.firstName + '-' + this.lastName
}
```

### 4.监视属性watch:{}

1. 当被监视的属性变化时, 回调函数自动调用, 进行相关操作
2. 监视的属性必须存在，才能进行监视！
3. 监视的两种写法：
   - new Vue时传入watch配置
   - 通过vm.$watch监视
   - deep: boolean : 深度监听，Vue中的watch默认不监测对象内部值的改变（一层）
   - immediate: boolean 初始化是否调用

```
// 两种形式：
watch:{
    isHot:{
    immediate:true, //初始化时让handler调用一下
    //handler什么时候调用？当isHot发生改变时。
    handler(newValue,oldValue){
    	console.log('isHot被修改了',newValue,oldValue)
    	}
    }
}
vm.$watch('isHot',{
	immediate:true, //初始化时让handler调用一下
    //handler什么时候调用？当isHot发生改变时。
    handler(newValue,oldValue){
    	console.log('isHot被修改了',newValue,oldValue)
    }
})

// 监听多级结构中某个属性的变化
...
data: {
	numbers: {
		a: 1,
		b: 2
		c: {
			d: {
				e: 100
			}
		}
	}
}
...
'numbers.a':{
	handler(){
		console.log('a被改变了')
    }
}
```

### 5.数据监听

#### 5.1 更新时的一个问题

```
...
data: {
	persons:[
        {id:'001',name:'马冬梅',age:30,sex:'女'},
        {id:'002',name:'周冬雨',age:31,sex:'女'},
        {id:'003',name:'周杰伦',age:18,sex:'男'},
        {id:'004',name:'温兆伦',age:19,sex:'男'}
    ]
}

methods: {
	updateMei() {
		// this.persons[0].name = '马老师' //奏效
        // this.persons[0].age = 50 //奏效
        // this.persons[0].sex = '男' //奏效
        // this.persons[0] = {id:'001',name:'马老师',age:50,sex:'男'} //不奏效
        // this.persons.splice(0,1,{id:'001',name:'马老师',age:50,sex:'男'}) // 奏效
        this.$set(this.persons, 0, {id:'001',name:'马老师',age:50,sex:'男'}) // 奏效
	}
}
```

如果使用的是不奏效的，则

```
this.persons[0] = {id:'001',name:'马老师',age:50,sex:'男'} 
```

在开发者工具上可以观察，vm._data.persons[0]/ vm.persons[0]的数据虽然更新了，但页面没有更新。

![image-20211215002458078](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211215002458078.png)

#### 5.2vue.set的使用

```
data:{
	school:{
        name:'尚硅谷',
        address:'北京',
	},
	student:{
	name:'tom',
	age:{
        rAge:40,
        sAge:29,
    },
	friends:[
        {name:'jerry',age:35},
        {name:'tony',age:36}
	]
	}
}
```

在控制台输入vm查看数据

![image-20211215010047890](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211215010047890.png)

可以看到，vue的初始化时每个属性都会被加上setter和getter。现在如果我们需要往student对象上增加一个sex属性，在控制台中输入

vm._data.student.sex="男"，视图将不会得到更新，重新查看vm发现新增的属性sex没有getter和setter。

**使用vue.set()更新**

在控制台中输入 Vue.set(vm._data.student, 'sex', '男'),视图将会更新，sex属性也有自己的getter和seeter。

**不能往实例上添加属性，即不能往data身上添加新属性**

如果我们想往data身上添加新的属性leader

![image-20211215011159883](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/image-20211215011159883.png)

#### 5.3数据监听总结

1.  vue会监视data中所有层次的数据。

2.  如何监测对象中的数据？

   - 通过setter实现监视，且要在new Vue时就传入要监测的数据。

   - 对象中后追加的属性，Vue默认不做响应式处理

   - 如需给后添加的属性做响应式，请使用如下API

     ```
     Vue.set(target，propertyName/index，value) 
     vm.$set(target，propertyName/index，value)
     ```

3. 如何监测数组中的数据？

   - 通过包裹数组更新元素的方法实现，本质就是做了两件事：
   - 调用原生对应的方法对数组进行更新。
   - 重新解析模板，进而更新页面。

4. 在Vue修改数组中的某个元素一定要用如下方法：

   - 使用这些API:push()、pop()、shift()、unshift()、splice()、sort()、reverse()
   - Vue.set() 或 vm.$set()

5. 特别注意：Vue.set() 和 vm.$set() 不能给vm 或 vm的根数据对象 添加属性！！！

### 6.过滤器

1. 定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）,如果是复杂的，可以使用methods或者computed。
2. 语法：
   - 1.注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}}
   - 2.使用过滤器：{{ xxx | 过滤器名}}  或  v-bind:属性 = "xxx | 过滤器名"
3. 备注
   - 过滤器也可以接收额外参数、多个过滤器也可以串联
   - 并没有改变原本的数据, 是产生新的对应的数据

```
//全局过滤器
Vue.filter('mySlice',function(value){
	return value.slice(0,4)
})

// 局部注册
new Vue({
	filters: {
		timeFormater(value,str='YYYY年MM月DD日 HH:mm:ss'){
			return dayjs(value).format(str)
		}
	}
})
```

### 7.内置指令

#### 7.1 v-text

- 作用：向其所在的节点中渲染文本内容。
- 与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会。

```
<div id="root">
	<div>你好，{{name}}</div>
	<div v-text="name">你好</div>
</div>
```

v-text渲染出来的dom内容就只有name对应的内容，“你好”会被去掉。

#### 7.2 v-cloak

```
<div id="root">
	<h2 v-cloak>{{name}}</h2>
</div>

<style>
	[v-cloak] {
		display:none;
	}
</style>
```

- 本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。
- 使用css配合v-cloak可以解决网速慢时页面展示出{{xxx}}的问题。

#### 7.3 v-once

```
<div id="root">
	<h2 v-once>初始化的n值是:{{n}}</h2>
    <h2>当前的n值是:{{n}}</h2>
    <button @click="n++">点我n+1</button>
</div>
```

- v-once所在节点在初次动态渲染后，就视为静态内容了。
- 以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。

#### 7.4 v-pre

```
<div id="root">
    <h2 v-pre>Vue其实很简单</h2>
    <h2 >当前的n值是:{{n}}</h2>
    <button @click="n++">点我n+1</button>
</div>
```

- 跳过其所在节点的编译过程。
- 可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。

### 8.生命周期

![生命周期](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/生命周期.png)

```
const vm = new Vue({
	el:'#root',
    data:{
    	n:1
    },
    methods: {
    	add(){
    		console.log('add')
    	this.n++
    	},
    bye(){
        console.log('bye')
        this.$destroy()
    	}
    },
    watch:{
        n(){
        console.log('n变了')
    	}
    },
    beforeCreate() {
        console.log('beforeCreate')
        console.log(this._data) // undefined
        console.log(this.add) // undefined
    },
    created() {
        console.log('created') 
        console.log(this._data) // {__ob__: Observer}
        console.log(this.add) // ƒ add(){...}
    },
    beforeMount() {
    	console.log('beforeMount')
    },
    mounted() {
    	console.log('mounted')
    },
    beforeUpdate() {
    	// 点击add
    	console.log('beforeUpdate')
    	console.log(this._data.n) // 2 数据更新，视图未更新
    },
    updated() {
    	console.log('updated')
    },
    beforeDestroy() {
    	console.log('beforeDestroy')
    },
    destroyed() {
    	console.log('destroyed')
    },
})
```

