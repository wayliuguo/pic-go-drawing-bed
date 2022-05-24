const obj = {
    foo: 123,
    bar: 456
}

const proxy = new Proxy(obj, {
    get(target, property) {
        return Reflect.get(target, property) // 默认
    }
})

const user = {
    name: 'well',
    age: 18
}

/* console.log('name' in user)
console.log(delete user['age'])
console.log(Object.keys(user)) */
console.log(Reflect.has(user, 'name')) // true
console.log(Reflect.deleteProperty(user, 'age')) // true
console.log(Reflect.ownKeys(user)) // [ 'name' ]
