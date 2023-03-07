interface Company {
    id: number,
    name: string
}
interface Person {
    id: number,
    name: string,
    company: Company
}
type DeepPartial<T> = {
    [U in keyof T] ?: T[U] extends object ? DeepPartial<T[U]> : T[U]
}

type PartialPerson = Partial<Person>
/**
 * type PartialPerson = {
    id?: number | undefined;
    name?: string | undefined;
    company?: Company | undefined;
  }
 */
let p: PartialPerson = {
    // 类型“{}”缺少类型“Company”中的以下属性: id, name
    // 这里如果属性是对象，如果写了此属性，其内层不是可选属性
    // company: {}
}
// 使用自定义深度遍历使深层属性也是可选属性
type DeepPartialPerson = DeepPartial<Person>
/* 
  type DeepPartialPerson = {
    id?: number | undefined;
    name?: string | undefined;
    company?: DeepPartial<Company> | undefined;
  }
*/
let dp: DeepPartialPerson = {
    company: {}
}