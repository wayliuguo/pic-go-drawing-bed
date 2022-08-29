let arr = [1, [2, [3, 4, 5]]]
// 递归实现
function flatten (arr) {
    let result = []
    for (let i=0; i<arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result
}
console.log(flatten(arr)) // [ 1, 2, 3, 4, 5 ]
