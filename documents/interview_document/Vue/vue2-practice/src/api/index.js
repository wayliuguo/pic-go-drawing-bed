import http from "@/utils/axios"

// 设置接口 state => action-types => api => actions => mutations
export const fetchTodos = () => http.get('/todos')