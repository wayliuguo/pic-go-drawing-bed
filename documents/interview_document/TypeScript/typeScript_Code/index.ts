function getUser(name: string, age: number) {
    return {
        name,
        age
    }
}
type GetUserType = typeof getUser

type MyParameters<T extends (...args: any) => any> =
    T extends (...args: infer P) => any ? P : never

// type parametersUser = [name: string, age: number]
type parametersUser = Parameters<GetUserType>
type MyParametersUser = MyParameters<GetUserType>
let u1:parametersUser= ['123', 18]
let u2:MyParametersUser = ['well', 18]
