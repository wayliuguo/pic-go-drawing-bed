//  Promise 基本示例

const promise = new Promise(function (resolve, reject) {
    // 这里用于“兑现”承诺
    // ...
    resolve(100) // 承诺达成，把状态由pending =》 fullFilled
})

// 通过then()方法定义 fullFilled 的回调函数(onFufilled)和 rejected 的回调函数(onRejected)
promise.then(function(value) {
    console.log('resolved', 100)
}, function (err) {
    console.log('rejected', err)
})

// resolved 100