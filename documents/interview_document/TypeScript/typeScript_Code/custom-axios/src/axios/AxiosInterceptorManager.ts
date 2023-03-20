interface OnFulfilled<V> {
    (value: V): V | Promise<V> 
}
interface OnRejected {
    (error: any):  any
}

export interface Interceptors<V> {
    onFulfilled?: OnFulfilled<V> // 成功的回调
    onRejected?: OnRejected // 失败的回调
}

// T 可能AxiosRequestConfig 可以能是AxiosResponse
export default class AxiosInterceptorManager<V> {
    public interceptors: Array<Interceptors<V> | null> = []
    // 每当调用的时候可以向拦截器管理器中添加一个拦截器
    use(onFulfilled?: OnFulfilled<V>, onRejected?: OnRejected): number {
        this.interceptors.push({
            onFulfilled,
            onRejected
        })
        return this.interceptors.length - 1
    }
    eject(id: number) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}