import Vue from 'vue'
import Vuex from '@/vuex'
// import Vuex from 'vuex'

import a from './a'
import b from './b'

Vue.use(Vuex)

let store = new Vuex.Store({
    strict: true,
    state: {
        name: 'well',
        age: 18
    },
    mutations: {
        changeAge(state, payload) {
            state.age += payload
        }
    },
    actions: {
        // 第一个参数是store，可以从中解构出commit
        changeAge({commit}, payload) {
            setTimeout(() => {
                commit('changeAge', payload)
            }, 1000);
        }
    },
    getters: {
        myAge(state) {
            return `年龄为${state.age}`
        }
    },
    modules: {
        a,
        b
    }
})
console.log('>>>', store)
export default store