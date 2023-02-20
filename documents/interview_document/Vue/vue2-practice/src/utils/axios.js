import axios from 'axios'
import store from '../store/index'
import * as Types from '@/store/action-types'

class HttpRequest {
    constructor() {
        this.baseURL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000/'
        this.timeout = 3000
        // loading 需要加
        this.queue = {} // 专门用来维护请求队列 {'/':true}
        // 页面切换，需要取消请求
    }
    // 通过 request 方法来进行请求操作
    request(options) {
        // 每次请求可以创建一个新实例，如果业务不复杂可以不创建实例，直接使用axios
        let instance = axios.create()
        // 默认配置项
        let config = {
            baseURL: this.baseURL,
            timeout: this.timeout,
            ...options
        }
        // 拦截器
        this.setInterceptor(instance, config.url)
        return instance(config) // 产生的是一个 promise axios()
    }
    // 拦截器
    setInterceptor(instance, url) {
        instance.interceptors.request.use((config) => {
            // 开启loading
            if (!Object.keys(this.queue).length) {
                console.log('开启loading...')
                this.toast = vant.Toast.loading({
                    duration: 0, // 持续展示 toast
                    forbidClick: true,
                    message: '加载中'
                });
            }

            // 可以记录请求的取消函数
            let CancleToken = axios.CancelToken
            config.cancelToken = new CancleToken(c => {
                // 存到vuex 中，页面切换的时候，组件销毁的时候执行
                // c 就是当前取消请求的token
                store.commit(Types.SET_TOKEN, c)
            }) 
            this.queue[url] = true
            // 扩展请求 axios.get('×××', config)
            // 此拦截器拦截的return会作为最新的配置 
            return config
        })

        instance.interceptors.response.use((res) => {
            delete this.queue[url]
            
            if (!Object.keys(this.queue).length) {
                // close loading
                console.log('关闭loading...')
                this.toast?.clear()
            }

            // 根据接口状态做不同的事情
            if (res?.data?.data || true) {
                return res
            } else {
                return Promise.reject(res.data)
            }

        }, (err) => {
            delete this.queue[url]
            if (!Object.keys(this.queue).length) {
                // close loading
                console.log('关闭loading...')
                this.toast?.clear()
            }
            return Promise.reject(err)
        })
    }
    get(url, data) { // url, {} axios.get('/×××', {params: ×××})
        return this.request({
            url,
            method: 'get',
            ...data
        })
    }
    post(url, data) { // url, {} axios.get('/×××', {data})
        return this.request({
            url,
            method: 'post',
            data
        })
    }
}

export default new HttpRequest