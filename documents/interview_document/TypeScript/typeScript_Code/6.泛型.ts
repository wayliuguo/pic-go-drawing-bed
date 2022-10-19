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

// 在函数中使用泛型-分配泛型参数
function identity<T>(value: T): T {
    return value
}
// 显式指明与非显式指明
let myresult = identity<number>(123)
myresult = identity(123)

// 在函数中使用泛型-直接传递类型参数
type ProgrammingLanguage = {
    name: string
}
const result2 = identity<ProgrammingLanguage>({name: 'ts'})
async function fetchApi<ResultType>(path: string): Promise<ResultType> {
    const response = await fetch(`https://example.com/api${path}`)
    return response.json()
}

// 在函数中使用泛型-默认类型参数
