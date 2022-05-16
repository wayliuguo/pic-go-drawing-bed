function compose (f,g) {
    return function (value) {
        return f(g(value))
    }
}

function reverse (arr) {
    return arr.reverse()
}
function first (arr) {
    return arr[0]
}

const last = compose(first,reverse)
console.log(last([1,2,4,6])) // 6