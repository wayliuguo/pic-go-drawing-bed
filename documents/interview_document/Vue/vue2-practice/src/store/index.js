import Vue from 'vue'
// import Vuex from '@/vuex'
import Vuex from 'vuex'
// import logger from 'vuex/dist/logger.js'

import a from './a'
import b from './b'
import token from './token'

Vue.use(Vuex)

function logger () {
    return function (store) {
        let prevState = JSON.stringify(store.state)
        store.subscribe((mutation, state) => {
            // 所有的更新操作都基于 mutation （状态变化都是通过mutation）
            // 如果直接手动的更改状态，此subcribe 是不会执行的
            console.log('prevState:', prevState)
            console.log('mutation:', JSON.stringify(mutation))
            console.log(JSON.stringify(state))
            prevState = JSON.stringify(state)
        })
    }
}

function persists() {
    return function (store) {
        let local = localStorage.getItem('VUES:state')
        if (local) {
            store.replaceState(JSON.parse(local))
        }
        store.subscribe((mutation, state) => {
            // 这里需要做一个防抖
            localStorage.setItem('VUES:state', JSON.stringify(state))
        })
    }
}


let store = new Vuex.Store({
    plugins: [
        // logger(),
        // persists()
    ],
    // strict: true,
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
        b,
        token
    }
})
console.log('>>>', store)
export default store