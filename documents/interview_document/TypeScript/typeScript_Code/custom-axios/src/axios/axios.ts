import { AxiosRequestConfig, AxiosResponse } from "./types";
import AxiosInterceptorManager, { Interceptors } from "./AxiosInterceptorManager";
import qs from 'qs'
import parseHeaders from "parse-headers";
export default class axios<T> {
    public intercetors = {
        request: new AxiosInterceptorManager<AxiosRequestConfig>(),
        response: new AxiosInterceptorManager<AxiosResponse<T>>()
    }
    // T 用来限制响应对象response里的参数
    request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T> | AxiosResponse<T>> {
        // return this.dispatchRequest(config)
        // Interceptors<AxiosRequestConfig | AxiosResponse<T>
        const chain: Array<Interceptors<any>> = [
            {
                onFulfilled: this.dispatchRequest
            }
        ]
        // Interceptors<AxiosRequestConfig>
        this.intercetors.request.interceptors.forEach((interceptor) => {
            interceptor && chain.unshift(interceptor)
        })
        // Interceptors<AxiosResponse<T>>
        this.intercetors.response.interceptors.forEach((interceptor) => {
            interceptor && chain.push(interceptor)
        })
        let promise: any = Promise.resolve(config)
        while(chain.length) {
            const {onFulfilled, onRejected} = chain.shift()!
            promise = promise.then(onFulfilled, onRejected)
        }
        return promise
    }
    // 定义一个派发请求的方法
    dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return new Promise<AxiosResponse<T>>(function(resolve, reject) {
            let request = new XMLHttpRequest()
            let { method, url, params, headers, data, timeout } = config
            if (params && typeof params === 'object') {
                params = qs.stringify(params)
                // !：断言：左侧的值一定有值
                url += (url!.indexOf("?") === -1 ? '?' : '&') + params
            }
            request.open(method!, url!, true)
            request.responseType = 'json'
            // 指定一个状态变更函数
            request.onreadystatechange = function () {
                // 0 1 2 3 4: 完成
                if (request.readyState === 4 && request.status !== 0) {
                    if (request.status >= 200 && request.status <300) {
                        let response: AxiosResponse<T> = {
                            data: request.response ? request.response : request.responseText,
                            status: request.status,
                            statusText: request.statusText,
                            // content-type=xx;content-length=xx => contetn-type:xx,content-length:xx
                            headers: parseHeaders(request.getAllResponseHeaders()),
                            config,
                            request
                        }
                        resolve(response)
                    } else {
                        reject(`Error: Request failed with status code ${request.status}`)
                    }
                }
            }
            if (headers) {
                for (let key in headers) {
                    request.setRequestHeader(key, headers[key])
                }
            }
            let body: string | null = null
            if (data) {
                body = JSON.stringify(data)
            }
            if (timeout) {
                request.timeout = timeout
                request.ontimeout = function() {
                    reject(`Error:timeout of ${timeout}ms exceeded`)
                }
            }
            request.onerror = function () {
                reject('net::ERR_INTERNET_DISCONNECTED')
            }
            request.send(body)
        })
    }
}