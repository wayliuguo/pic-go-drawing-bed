const bar = 'well'

const obj = {
    foo: 123,
    // bar: bar,
    bar,
    method1: function() {
        console.log(123)
    },
    method2() {
        console.log(123)
    },
    [bar]: 'liuguowei'
}

console.log(obj[bar]) // liuguowei