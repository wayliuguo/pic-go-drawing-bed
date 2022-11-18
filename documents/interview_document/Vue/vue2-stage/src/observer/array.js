// arrayMethods.__proto__ = Array.prototype
let oldArrayProrotype = Array.prototype
export let arrayMethods = Object.create(oldArrayProrotype)

let methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    // 用户调用的，如果是以上七个方法，则使用自己重写的，否则用原来的数组方法
    arrayMethods[method] = function (...args) {
        // vm.name.push(×××), 则this表示vm
        oldArrayProrotype[method].call(this, ...args)
        // 新增的内容
        let inserted
        // 根据当前数组获取到observe实例
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.splice(2)
                break
            default:
                break
        }
        // 如果有新增的内容要进行继续劫持
        if (inserted) {
            ob.observeArray(inserted)
        }
        // 数组的observer.dep 数组
        ob.dep.notify()
    }
})