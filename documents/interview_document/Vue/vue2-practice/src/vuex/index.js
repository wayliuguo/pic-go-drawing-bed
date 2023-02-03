import {install} from './install'
import Store from './store'
function mapState (arrList) {
    let obj = {}
    for (let i=0; i<arrList.length; i++) {
        let stateName = arrList[i]
        obj[stateName] = function() {
            return this.$store.state[stateName]
        }
    }
    return obj
}
function mapGetters (arrList) {
    let obj = {}
    for (let i=0; i<arrList.length; i++) {
        let getterName = arrList[i]
        obj[getterName] = function() {
            return this.$store.getters[getterName]
        }
    }
    return obj
}
function mapMutations (arrList) {
    let obj = {}
    for (let i=0; i<arrList.length; i++) {
        let type = arrList[i]
        obj[type] = function(payload) {
            this.$store.commit(type, payload)
        }
    }
    return obj
}
function mapActions (arrList) {
    let obj = {}
    for (let i=0; i<arrList.length; i++) {
        let type = arrList[i]
        obj[type] = function(payload) {
            this.$store.dispatch(type, payload)
        }
    }
    return obj
}
export {
    install,
    Store,
    mapState,
    mapGetters,
    mapMutations,
    mapActions
}