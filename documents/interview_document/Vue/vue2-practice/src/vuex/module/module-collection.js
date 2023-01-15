import Module from './module'
import { forEachValue } from "../utils"

export default class ModuleCollection {
    constructor(options) {
        this.root = null
        this.register([], options)
    }
    register(path, rootModule) {
        let newModule = new Module(rootModule)
        if (path.length === 0) {
            this.root = newModule
        } else {
            // 其父亲的[key]
            // let temp = path.slice(0, -1)
            // 取出父亲节点
            let parent = path.slice(0, -1).reduce((memo, current) => {
                return memo.getChild(current)
            }, this.root)
            // 把新的子节点作为父亲节点的children
            parent.addChild([path[path.length-1]], newModule)
        }
        if (rootModule.modules) {
            // 根据kkey递归注册子模块
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module)
            })
        }
    }
}

/* 
this.root = {
    _raw: 用户定义的模块,
    state: 当前模块自己的状态,
    _children: { // 孩子列表
        a: {
            _raw: 用户定义的模块,
            state: 当前模块自己的状态
            _children: {
                c: {
                    ...
                }
            }
        }
    }
}
*/

