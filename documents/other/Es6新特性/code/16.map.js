const m = new Map()
const tom = { name: 'tom'}

m.set(tom, 90)
console.log(m)
console.log(m.get(tom))
console.log(m.has(tom))
console.log(m.delete(tom))
m.clear()
console.log(m)