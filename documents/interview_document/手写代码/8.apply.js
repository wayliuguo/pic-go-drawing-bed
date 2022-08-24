Function.prototype.MyApply = function (context) {
    if (typeof this !== 'function') {
        throw new Error('error')
    }
    let result = null
    context.fn = this
    if (arguments[1]) {
        result = context.fn(arguments[1])
    } else {
        result = context.fn(...arguments[1])
    }
    delete context.fn
    return result
}

const Person = {
    name: 'well'
}
function sayName () {
    return this.name
}
console.log(sayName.MyApply(Person, ['well'])) // well