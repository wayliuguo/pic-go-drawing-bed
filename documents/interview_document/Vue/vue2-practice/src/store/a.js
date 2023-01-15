export default {
    namespaced: true,
    state: {
        name: 'a',
        age: 20
    },
    getters: {
        aAge(state) {
            return `年龄为${state.age}`
        }
    },
    mutations: {
        changeAge(state, payload) {
            state.age += payload
        }
    }
}