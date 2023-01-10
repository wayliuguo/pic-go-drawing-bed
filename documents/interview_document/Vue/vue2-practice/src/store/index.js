import Vue from 'vue'
import Vuex from '@/vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        name: 'well',
        age: 18
    },
    mutations: {

    },
    actions: {

    },
    getters: {
        myAge(state) {
            return `年龄为${state.age}`
        }
    },
    modules: {

    }
})