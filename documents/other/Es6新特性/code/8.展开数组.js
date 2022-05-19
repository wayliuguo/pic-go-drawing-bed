const arr = [1, 2, 3]

// log 方法是console 对象调用的，把log指向 console
console.log.apply(console, arr) // 123

console.log(...arr) // 123