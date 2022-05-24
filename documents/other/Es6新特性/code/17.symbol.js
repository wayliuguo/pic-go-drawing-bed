/* // shared.js
const cache = {}
// a.js
cache['foo'] = 1
// b.js
cache['foo'] = 2
 */

// Symbol
const obj = {}
obj[Symbol('foo')] = '123'
obj[Symbol('foo')] = '456'
console.log(obj) // { [Symbol(foo)]: '123', [Symbol(foo)]: '456' }
console.log(obj[Symbol('foo')] === obj[Symbol('foo')]) // true
console.log(Symbol('foo') === Symbol('foo')) // false