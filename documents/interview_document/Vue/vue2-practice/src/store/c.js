export default {
    namespaced: true,
    state: {
        name: 'c',
        age: 200
    },
    getters: {
        cAge(state) {
            return `年龄为${state.age}`
        }
    },
    mutations: {
        changeAge(state, payload) {
            state.age += payload
        }
    }
}