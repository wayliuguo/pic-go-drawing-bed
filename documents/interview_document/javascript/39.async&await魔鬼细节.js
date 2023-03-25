async function testC () {
    return new Promise((resolve, reject) => {
        resolve()
    })
} 

testC().then(() => console.log(1));
Promise.resolve()
    .then(() => console.log(2))
    .then(() => console.log(3))
    .then(() => console.log(4))

// (等待两个then)最终结果👉: 2 3 1 4
