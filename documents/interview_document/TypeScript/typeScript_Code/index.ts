/**
 * 自定义实现
 * 1. infer 在这里用于提取函数类型的返回值
 * 2.ReturnType<T> 只是将 infer R 从参数位置移动到返回值位置，因此此时 R 即是表示待推断的返回值类型
 */
type MyReturnType<T extends (...args: any[]) => any> = T extends (
    ...args: any[]
) => infer R ? R : any

function getUser(name: string, age: number) {
    return {
        name,
        age
    }
}
/**
 * type GetUserType = (name: string, age: number) => {
    name: string;
    age: number;
   }
 */
type GetUserType = typeof getUser
/**
 * type ReturnUser/MyReturnUser = {
    name: string;
    age: number;
  }
 */
type ReturnUser = ReturnType<GetUserType>
type MyReturnUser = MyReturnType<GetUserType>
let u: ReturnUser = {
    name: 'well',
    age: 18
}