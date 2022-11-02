// 扁平化--flat node>12
const flattenDeep = array => array.flat(Infinity)
// 去重
const unique = array => Array.from(new Set(array))
// 排序(升序)
const sort = array => array.sort((a,b) => a-b)

// 函数组合
const compose = (...fns) => (initValue) => fns.reduceRight((y, fn) => fn(y), initValue)

// 组合最后函数
const flatten_unique_sort = compose(sort, unique, flattenDeep)

let arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
console.log(flatten_unique_sort(arr)) //[1,  2, 3,  4,  5,  6, 7,  8, 9, 10, 11, 12, 13, 14]