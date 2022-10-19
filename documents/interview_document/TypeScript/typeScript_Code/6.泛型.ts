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
async function myFetchApi<ResultType = Record<string, any>>(path: string): Promise<ResultType> {
    const response = await fetch(`https://example.com/api${path}`)
    return response.json()
}
const fetchData = fetchApi('/users') // const myFetchData: Promise<Record<string, any>>
const myFetchData = myFetchApi('/users') // const myFetchData: Promise<Record<string, any>>

// 在函数中使用泛型-参数类型约束
interface Sizeable {
    size: number
}
function trace <T extends Sizeable>(value: T): T {
    return value
}
trace({size: 1})

// 接口和类中的泛型
interface MyInterface<T> {
    field: T
}
class MyClass<T> {
    field: T
    constructor(field: T) {
        this.field = field
    }
}

// 自定义类型中的泛型
type MyIdentityType<T> = T
type TN = MyIdentityType<number>

// 使用泛型创建映射类型
type BooleanFields<T> = {
    [k in keyof T]: boolean
}
type User = {
    email: string
    name: string
}
type UserFetchOptions = BooleanFields<User>
const userFetchOptions: UserFetchOptions = {
    email: true,
    name: false
}

// 使用泛型创建条件类型-基础条件类型
type IsStringType<T> = T extends string ? true : false
type AType = 'abc'
type BType = {
    name: string
}
type ResultA = IsStringType<AType> // true
type ResultB = IsStringType<BType> // false
