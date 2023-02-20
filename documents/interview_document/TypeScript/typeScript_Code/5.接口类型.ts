export {}

// 接口定义
interface Info {
    firstName: string
    lastName: string
}

const getFullName = ({ firstName, lastName }: Info) => {
    return `${firstName}${lastName}`
}

// 接口属性-可选类型
interface Vegetables {
    color?: string
    type: string
}
const getVegetables = ({ color, type }: Vegetables) => {
    return `${color ? color + ' ' : ''}${type}`
}
getVegetables({color: 'red', type: 'long'})
// 接口属性-只读类型
interface Role {
    readonly 0: string
    readonly 1: string
}
const role: Role = {
    0: 'super_admin',
    1: 'admin'
}
console.log(role[1]) // admin
// 接口属性-多余属性检查-使用类型断言
getVegetables({
    type: 'tomato',
    size: 12,
    price: 6
} as Vegetables)

// 接口属性-多余属性检查-添加索引签名
interface VegetablesProps {
    color: string
    type: string
    [prop: string]: string | number
}
const getVegetablesProps = ({ color, type }: VegetablesProps) => {
    return `${color ? color + ' ' : ''}${type}`
}
getVegetablesProps({
    color: 'red',
    type: 'tomato',
    size: 12,
    price: 6
})

// 接口使用——定义函数类型
interface AddFunc {
    (x: number, y: number): number
}
// 类型别名
type AddFuncType = (x: number, y: number) => number

// 接口使用——定义索引类型
interface RoleDic {
    [id: string]: string
}

const roleDic: RoleDic = {
    0: 'super_admin',
    1: 'admin'
}

// 高级用法——继承接口
interface Books {
    name: string
}
interface Cateory {
    cateory: string
}
interface MathBook extends Books {
    price: number
}
interface EngBook extends Books {
    size: number
}
const myMathBook: MathBook = {
    name: '数学书',
    price: 20
}
interface ChiBook extends Books, Cateory {
    start: number
}