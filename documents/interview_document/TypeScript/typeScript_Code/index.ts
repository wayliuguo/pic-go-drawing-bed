interface Company {
    id: number,
    name?: string
    salary?: number
}

/* type RequiredCompany = {
    id: number;
    name: string;
    salary: number;
} */
type RequiredCompany = Required<Company>

// 自定义实现
type MyRequired<T> = {
    [P in keyof T]-?: T[P]
}
type MyRequiredCompany = MyRequired<Company>