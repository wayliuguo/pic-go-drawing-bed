type Proxy<T> = {
    get(): T,
    set(value: T): void
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>
}
function proxify<T>(obj: T):Proxify<T> {
    let result = <Proxify<T>>{}
    for (const key in obj) {
        Object.defineProperty(result, key, {
            get: () => {
                return obj[key]
            },
            set: (value) => {
                console.log('set', key, value)
                obj[key] = value
            }
        })
    }
    return result
}

interface Props {
    name: string,
    age: number
}
let props: Props = {
    name: 'well',
    age: 18
}
let proxyProps: any = proxify<Props>(props)
proxyProps.name = 'liuguowei'
console.log(proxyProps.name)