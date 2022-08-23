Function.prototype.MyCall = function (context) {
    if (typeof this !== 'function') {
        throw new Error('error')
    }
    // 获取参数
    let args = [...arguments].slice(1)
    let result = null
    // 核心思想：把调用方法contex的属性去执行，并把得到的结果返回
    context.fn = this
    result = context.fn(args)
    delete context.fn
    return result
}

const Person = {
    name: 'well'
}
function sayName (age) {
    return `name:${this.name},age:${age}`
}
console.log(sayName.MyCall(Person, 18)) // name:well,age:18