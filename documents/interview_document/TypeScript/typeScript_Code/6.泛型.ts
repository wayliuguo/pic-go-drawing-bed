// 泛型语法
function pickObjectKeys<T, K extends keyof T>(obj: T, keys: K[]) {
    let result = {} as Pick<T, K>
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key]
        }
    }
    return result
}
const language = {
    name: 'ts',
    age: 8,
    extendsions: ['ts', 'tsx']
}
const ageAndExtensions = pickObjectKeys(language, ['age', 'name'])
console.log(ageAndExtensions) // { age: 8, name: 'ts' }  

