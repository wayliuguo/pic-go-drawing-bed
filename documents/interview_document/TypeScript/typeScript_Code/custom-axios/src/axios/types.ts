export type Methods = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS'

export interface AxiosRequestConfig {
    url?: string
    method?: Methods
    // params: Record<string, any>
    params?: any,
    headers?: Record<string, any>,
    data?: Record<string, any>,
    timeout?: number
}

// Axios.prototype.request 这个方法
// Promise 的泛型T代表此promise变成成功态后resolve的值 resolve(value)
export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
}

// 泛型T代表响应体的类型
export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers?: Record<string, any>
    config?: AxiosRequestConfig
    request?: XMLHttpRequest
}