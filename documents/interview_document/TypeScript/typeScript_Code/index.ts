type A = null | undefined | string

type MyNonNullable<T> = T extends null | undefined ? never : T
type T0 = NonNullable<A> // type T0 = string
type MT0 = NonNullable<A> // type MT0 = string

let t0: T0 = 'well'
let tt0: MT0 = 'well'