// 爬楼梯方法  ---- 递归版本
function climbStairs(n) {
    // 如果当前是 第 0，1，2 层，直接返回n
    if (n === 0 || n === 1 || n === 2) {
        return n
    }
    return climbStairs(n - 1) + climbStairs(n - 2)
}

// 爬楼梯方法  ----  循环方法
function climbStairs2(n) {
    if (n === 0 || n === 1 || n === 2) {
        return n
    }
    let a = 1; // 当前层的前两层
    let b = 2; // 当前层的前一层
    let result = 0;
    for (let i = 3; i <= n; i++) {
        result = a + b;
        a = b;
        b = result;
    }
    return result
}

console.log(climbStairs(3)) // 3
console.log(climbStairs(4)) // 5
console.log(climbStairs(5)) // 8