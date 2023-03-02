type person = {
    name: string
}
let p: person = {
    name: 'well'
}
type doubleP = typeof p
let dp: doubleP = {
    name: 'liuguowei'
}