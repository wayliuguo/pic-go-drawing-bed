import { forEachValue } from '../utils'
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
    forEachGetter(fn) {
        if (this._rawModule.getters) {
            forEachValue(this._rawModule.getters, fn)
        }
    }
    forEachMutation(fn) {
        if (this._rawModule.mutations) {
            forEachValue(this._rawModule.mutations, fn)
        }
    }
    forEachAction(fn) {
        if (this._rawModule.actions) {
            forEachValue(this._rawModule.actions, fn)
        }
    }
    forEachChild(fn) {
        forEachValue(this._children, fn)
    }
}