// 模拟常用的高阶函数 map、every、some

// map
const map = function(arr,fn) {
    let result = []
    for(let val of arr) {
        result.push(fn(val))
    }
    return result
}
// 测试
/* let arr = [1,2,3,4]
let mapResult = map(arr,(v) => v*v)
console.log(mapResult) // [ 1, 4, 9, 16 ] */

// ervery
const every = function(arr,fn) {
    let result = true
    for (let val of arr) {
        result = fn(val)
        if (!result) {
            break
        }
    }
    return result
}
/* // 测试
let arr = [11,12,14]
let ereryResult = every(arr, v=> v>10)
console.log(ereryResult) // true */

// some
const some = ((arr,fn) => {
    let result = false
    for (let val of arr) {
        result = fn(val)
        if (result) {
            break
        }
    }
    return result
})
// 测试
let arr = [1,3,4,9,5]
let someResult = some(arr,v => v%2 === 0)
console.log(someResult) // true