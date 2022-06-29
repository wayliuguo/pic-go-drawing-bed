import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
import { filter } from 'lodash-es'

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
