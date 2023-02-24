type Lihua = {
    name: string
}
type xiaoming = {
    name: string
}
type bool = Lihua extends xiaoming ? 'yes' : 'no'
// let flag: bool = 'no' // 不能将类型“"no"”分配给类型“"yes"”
let flag: bool = 'yes'

interface LengthWise {
    length: number
}
function logger<T extends LengthWise>(val: T) {
    console.log(val.length)
}

function reflectSpecified<P extends number | string | boolean>(param: P): P {
    return param
}
reflectSpecified(1)
reflectSpecified('1')
reflectSpecified(false)
// reflectSpecified({}) // 类型“{}”的参数不能赋给类型“string | number | boolean”的参数
