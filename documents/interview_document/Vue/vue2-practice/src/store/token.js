import * as Types from '@/store/action-types'

export default {
    state: {
        tokens: []
    },
    mutations: {   
        // 设置 token
        [Types.SET_TOKEN](state, token) {
            state.tokens = [...state.tokens, token]
        },
        // 清空token
        [Types.CLEAR_TOKEN](state) {
            // 执行所有的axios取消方法
            state.tokens.forEach(token => {
                console.log('执行cancletoken')
                token()
            })
            // 清空列表
            state.token = []
        }
    }
}