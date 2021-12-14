### vue模板语法

1. 插值语法：
   - 功能：用于解析标签体内容。
   - 写法：{{xxx}}，xxx是js表达式，且可以直接读取到data中的所有属性。
2. 指令语法：
   - 功能：用于解析标签（包括：标签属性、标签体内容、绑定事件.....）。
   - 举例：v-bind:href="xxx" 或  简写为 :href="xxx"，xxx同样要写js表达式，且可以直接读取到data中的所有属性。

### 事件处理

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

### 计算属性computed:{}

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

### 监视属性watch:{}

1. 当被监视的属性变化时, 回调函数自动调用, 进行相关操作
2. 监视的属性必须存在，才能进行监视！
3. 监视的两种写法：
   - new Vue时传入watch配置
   - 通过vm.$watch监视

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
// 
```

