import { filter } from './node_modules/lodash-es/lodash.js'

const users = [
    {
        name: 'mike',
        age: 20
    },
    {
        name: 'tom',
        age: 18
    }
]

const filterUser = filter(users, user => user.age > 18)

console.log('ems-browser')
console.log(filterUser)