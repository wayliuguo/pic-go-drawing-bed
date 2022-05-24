const s = new Set()

// 链式调用
s.add(1).add(2).add(3)
// 遍历
s.forEach( i => console.log(i))
for (let i of s) {
    console.log(i)
}
// size
console.log(s.size) // 3
// has
console.log(s.has(100)) // false
// delete
s.delete(3)
console.log(s) // Set(2) { 1, 2 }
// clear
s.clear() // Set(0) {} 
console.log(s)

// 数组去重
const arr = [1,1,2,3,2]
const result = [...new Set(arr)]
console.log(result) // [ 1, 2, 3 ] 