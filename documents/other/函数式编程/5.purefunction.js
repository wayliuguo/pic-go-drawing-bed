// 纯函数和不纯函数
// slice splice

let array = [1, 2, 3, 4, 5]

// slice
console.log(array.slice(0, 3)) // [ 1, 2, 3 ]
console.log(array.slice(0, 3)) // [ 1, 2, 3 ]
console.log(array.slice(0, 3)) // [ 1, 2, 3 ]

// splice
console.log(array.splice(0, 3)) // [ 1, 2, 3 ]
console.log(array.splice(0, 3)) // [4, 5]
console.log(array.splice(0, 3)) // []