import History from "./base";

export default class HTML5History extends History {
    constructor(router) {
        super(router)
    }
    getCurrentLocation() {
        // 获取路径
        return window.location.pathname
    }
    setUpListener() {
        window.addEventListener('popstate', () => {
            this.transitionTo(window.location.pathname)
        })
    }

    pushState() {
        history.pushState({}, null, location)
    }
}