// Object.assign()
const source1 = {
    a: 's1a',
    b: 's1b'
}
const source2 = {
    a: 's2a',
    b: 's2b',
    c: 's2c'
}

const target = {
    a: 'ta',
    c: 'tc'
}

// const result = Object.assign(target, source2, source1)
// console.log(result) // { a: 's1a', c: 's2c', b: 's1b' }

const result = Object.assign(target, source1, source2)
console.log(result) // { a: 's2a', c: 's2c', b: 's2b' }
console.log(result ===  target) // true