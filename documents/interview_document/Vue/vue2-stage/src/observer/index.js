import { isObject } from "../utils";
import { arrayMethods } from './array'
import { Dep } from './dep'

// 如果给对象新增一个属性不会触发视图更新（需要用$set）
// 给对象本身也增加一个dep进行存储watcher，如果增加一个属性手动的触发watcher的更新
class Observer {
    // 对对象中的所有属性进行劫持
    constructor (data) {
        // 数据可能使数组或者对象
        this.dep = new Dep()
        // 使__ob__属性不可枚举，如果不这么做，data会一直是一个对象，则溢栈
        // 这里把__ob__挂载在实例上，同时此属性不可枚举
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        // 如果是数组，则进行数组劫持的逻辑
        // 对数组原来的方法进行改写
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods
            // 如果数组中的数据是对象类型，需要监控对象的变化
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    observeArray(data) {
        // 对数组中的数组 数组中的对象再次劫持
        data.forEach(item => {
            observe(item)
        })
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function dependArray (value) {
    for (let i=0; i<value.length; i++) {
        let current = value[i]
        // current 是数组里面的数组
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) {
            // 取外层数组要将数组里面的也进行依赖收集
            dependArray(current)
        }
    }
}

// vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
function defineReactive(data, key, value) {
    // 如果value是一个对象，则继续递归进行劫持
    let childOb = observe(value) 
    // 每个属性都有一个dep属性
    // 创建dep实例，下面的setter和getter可以通过闭包访问到
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            // 取值时将watcher和dep对应起来
            if (Dep.target) {
                // 收集依赖
                dep.depend()
                // childOb 可能是数组或者对象，后续写$set方法需要触发他自己的更新
                if (childOb) {
                    // 让数组和对象也记录watcher
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newV) {
            // 如果用户赋值一个新对象，需要将这个对象进行劫持

            // 如果新旧值相同则return
            if (newV === value) return 
            observe(newV)
            value = newV
            dep.notify() // 通知渲染Watcher 去更新
        }
    })
}

export function observe(data) {
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