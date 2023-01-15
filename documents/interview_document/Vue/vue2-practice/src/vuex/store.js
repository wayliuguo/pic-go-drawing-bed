import { Vue } from './install'
import { forEachValue } from './utils'
import ModuleCollection from './module/module-collection'

class Store {
    constructor(options) {
        // 对用户的参数进行格式化操作（树）
        let r =new ModuleCollection(options)
        console.log(r)
    }
}

export default Store