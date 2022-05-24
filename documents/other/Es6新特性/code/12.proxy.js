const person = {
    name: 'well',
    age: 18
}

const personProxy = new Proxy(person, {
    get (target, property) {
        return property in target ? target[property] : 'undefined'
    },
    set (target, property, value) {
        target[property] = value
        console.log(target) // { name: 'well', age: 18, sex: 1 }
    }
})

console.log(personProxy.name) // well
personProxy.sex = 1

// 重写数组方法
const list = []

const listProxy = new Proxy(list, {
    set (target, property, value) {
        console.log(target, property, value) // [ 100 ] length 1
        target[property] = value
        return true
    }
})
listProxy.push(100)