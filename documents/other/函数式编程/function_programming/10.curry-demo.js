const _ = require('lodash')

const match = _.curry(function (reg, str) {
    return str.match(reg)
})

const haveSpace = match(/\s+/g)
const haveNumber = match(/\d+/g)
console.log(haveSpace('helloworld')) // null
console.log(haveNumber('123abc')) // ['123' ]

const filter = _.curry(function(func, array) {
    return array.filter(func)
})
console.log(filter(haveSpace, ['Join JSON', 'WELL'])) //[ 'Join JSON' ]
const filterSpace = filter(haveSpace)
console.log(filterSpace(['Join JSON', 'WELL'])) //[ 'Join JSON' ]