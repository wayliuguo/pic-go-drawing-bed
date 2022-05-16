// 纯函数
/* function checkAge (min, age) {
    return age >= mini
} */

// 柯里化
function checkAge (min) {
    return function (age) {
        return age>=min
    }
}
// es6 写法
//let checkAge = min => (age => age >= min)

let checkAge18 = checkAge(18)
console.log(checkAge18(20)) // true
console.log(checkAge18(15)) // false