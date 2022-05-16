function compose(...args) {
    return function(value) {
        // reduce:对数组中的每一个元素执行提供的函数，并汇总成单个结果
        return args.reverse().reduce(function(acc,fn) {
            return fn(acc)
        },value) // 把value作为acc的初始值
    }
}

const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()

const f = compose(toUpper,first,reverse)
console.log(f(['one','two','three'])) // THREE
