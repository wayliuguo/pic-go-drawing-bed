export default {
    state: {
        name: 'b',
        age: 'b10'
    },
    getters: {
        bAge(state) {
            return `年龄为${state.age}`
        }
    }
}