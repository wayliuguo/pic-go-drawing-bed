import { isObject } from "../utils";

class Observer {
    // 对对象中的所有属性进行劫持
    constructor (data) {
        this.walk(data)
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

// vue2 会对对象进行遍历，将每个属性使用defineProperty 重新定义，导致性能差
function defineReactive(data, key, value) {
    // 如果value是一个对象，则继续递归进行劫持
    observe(value) 
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newV) {
            // 如果用户赋值一个新对象，需要将这个对象进行劫持
            observe(newV)
            value = newV
        }
    })
}

export function observe(data) {
    // 如果是对象才观察（省略对数组进行处理）
    if (!isObject(data)) {
        return
    }
    
    // 默认最外层 data 必须是一个对象
    return new Observer(data)
}