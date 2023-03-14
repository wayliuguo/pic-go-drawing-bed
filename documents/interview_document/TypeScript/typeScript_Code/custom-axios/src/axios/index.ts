import Axios from './axios'

// 可以创建一个axios实例，axios其实就是一个函数
function createInstance() {
    let context: Axios
    
    
    = new Axios() // this 指针指向上下文
    // 让request 方法里的this 永远指向context 也就是 new Axios()
    let instance = Axios.prototype.request.bind(context)

    // 把Axios的类的实例和类的原型上的方法属性都拷贝到了instance上，也就是request方法上
    instance = Object.assign(instance, Axios.prototype, context)
    return instance
}

let axios = createInstance()

export default axios