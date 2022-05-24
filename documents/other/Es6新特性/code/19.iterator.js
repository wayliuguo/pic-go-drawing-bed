const arr =  ['foo', 'bar']

const iterator = arr[Symbol.iterator]()
console.log(iterator.next()) // { value: 'foo', done: false }
console.log(iterator.next()) // { value: 'bar', done: false }   
console.log(iterator.next()) // { value: undefined, done: true }