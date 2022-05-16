// lodash 的缓存

// 引入 lodash
const _ = require('lodash')
function getArea (r) {
    console.log(r)
    return Math.PI * r * r
}
// 测试
/* let getAreaWithMemory = _.memoize(getArea)
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4)) */
// 输出
//4
//50.26548245743669
//50.26548245743669
//50.26548245743669
// 解析：4 只打印一次，证明缓存了

// 模拟 memoize 的实现
function memoize (f) {
    let cache = {}
    return function() {
        console.log(arguments)  //[Arguments] { '0': 4 }
        let key = JSON.stringify(arguments) // 把参数转为字符串 
        console.log(key) // {"0":4}
        cache[key] = cache[key] || f.apply(f,arguments)
        console.log(cache) // { '{"0":4}': 50.26548245743669 }
        return cache[key]
    }
}
let getAreaWithMemory = memoize(getArea)
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))