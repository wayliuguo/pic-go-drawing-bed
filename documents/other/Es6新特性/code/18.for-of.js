const arr =  [1, 2, 3, 4, 5]

for (const item of arr) {
    if (item > 2) {
        break
    }
    console.log(item) // 1 2
}

const m = new Map()
m.set('foo', 123)
m.set('bar', 456)

for (const [key, value] of m) {
    console.log(key, value)
}

