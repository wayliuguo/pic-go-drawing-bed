let arr = [1,2,3,4,5,6,7,8,9,10]
// reduce
let sum = arr.reduce((total, i) => total += i, 0)
console.log(sum)

// 递归
function add (arr) {
    if (arr.length === 1) return arr[0]
    return arr[0] + add(arr.slice(1)) 
}
console.log(add(arr))