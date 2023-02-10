import History from "./base";

const ensureHash = () => {
    if (!window.location.hash) {
        window.location.hash = '/'
    }
}

const getHash = () => {
    return window.location.hash.slice(1)
}
export default class Hash extends History {
    constructor(router) {
        super(router)
        console.log('hashRouter', router)
        // hash 路由初始化的时候需要增加一个默认的hash值 /#/
        ensureHash()
    }
    getCurrentLocation() {
        return getHash()
    }

    setUpListener() {
        window.addEventListener('hashchange', () => {
            // 等待hash值变化后再去切换组件
            this.transitionTo(getHash())
        })
    }
}