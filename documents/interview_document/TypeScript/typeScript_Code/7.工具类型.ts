export {}
// 基本知识
// 1.typeof
let tom = {
    name: 'tom',
    age: 18,
    gender: 'male'
}
type PeopleType = typeof tom
/* type PeopleType = {
    name: string;
    age: number;
    gender: string;
} */
type nameType = typeof tom.name
// type nameType = string

// 2.keyof
interface Person {
    name: string
    age: number
    gender: 'male' | 'female'
}
type PersonKey = keyof Person // 'name' || 'age' || 'gender'
function getValueByKey(p: Person, key: PersonKey) {
    return p[key]
}
let val = getValueByKey({
    name: 'tom',
    age: 18,
    gender: 'male'
}, 'name')
console.log(val) // tom

