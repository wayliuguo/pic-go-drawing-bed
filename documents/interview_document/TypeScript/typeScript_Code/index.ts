interface Company {
    id: number,
    name?: string
    salary?: number
}
// 自定义实现
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
}
type ReadOnlyPerson = Readonly<Company>
/* 
type ReadOnlyPerson = {
    readonly id: number;
    readonly name?: string | undefined;
    readonly salary?: number | undefined;
}
*/
let c: ReadOnlyPerson = {
    id: 0
}
// c.id = 2 // Cannot assign to 'id' because it is a read-only property