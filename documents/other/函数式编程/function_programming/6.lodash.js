// 引入 lodash
const _ = require('lodash')

const arr = ['jack','tom','lucy','well']

console.log(_.first(arr)) // jack
console.log(_.last(arr))  // well
console.log(_.toUpper(arr))  // JACK,TOM,LUCY,WELL
console.log(_.reverse(arr)) // [ 'well', 'lucy', 'tom', 'jack' ]
const r  = _.each(arr, (item, index) => {
    console.log(item,index) // well 0 lucy 1 tom 2 jack 3
})
console.log(r) // [ 'well', 'lucy', 'tom', 'jack' ]