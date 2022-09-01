const PENDING = 'pengding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class myPromise {
    constructor (executor) {
        // 保存 promise 的状态
        this.state = PENDING
        // 成功结果
        this.value = undefined
        // 失败结果
        this.reason = undefined
        // resolve 方法
        const resolve = (value) => {
            if (this.state = PENDING) {
                this.state = FULFILLED
                this.value = value
            }
        }
        const reject = (reason) => {
            if (this.state = PENDING) {
                this.state = REJECTED
                this.reason = reason
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then (onFulfilled, onRejected)
}

const promise = new myPromise ((resolve, reject) => {
    resolve(1)
})
console.log(promise)