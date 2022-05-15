// 高阶函数-函数作为参数

// (模拟foreach)
function forEach (arr,fn) {
    for (let i=0; i<arr.length; i++) {
        fn(arr[i])
    }
}
// 测试
/* let arr = [1,3,4,7,8]
forEach(arr, function (item) {
    console.log(item) // 1 3 4 7 8
}) */

// 手写简易版 foreach
Array.prototype.MyForeach = function(fn) {
    for (let i=0; i<this.length; i++) {
        fn(this[i])
    }
}
/* let arr = [1,3,4,7,8]
arr.MyForeach((item) => console.log(item)) // 1 3 4 7 8 */

// 高阶函数-函数作为参数 (模拟filter)
function filter (array,fn) {
    let results = []
    for (let i=0; i<array.length; i++) {
        if (fn(array[i])) {
            results.push(array[i])
        }
    }
    return results
}
// 测试
let arr = [1,3,4,7,8]
let result = filter(arr,function(item) {
    return item % 2 === 0
})
console.log(result) // [4,8]