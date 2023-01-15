export default class Module {
    constructor(rawModule) {
        this._children = {}
        this._rawModule = rawModule
        this.state = rawModule.state
    }
    getChild(key) {
        return this._children[key]
    }
    addChild(key, module) {
        this._children[key] = module
    }
}