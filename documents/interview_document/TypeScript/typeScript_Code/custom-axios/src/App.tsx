import React from 'react';
import logo from './logo.svg';
import './App.css';

import axios, { AxiosRequestConfig, AxiosResponse } from './axios'
const baseURL = 'http://localhost:4000'
interface USER {
  name: string,
  age: number
}
const user: USER = {
  name: 'well',
  age: 18
}
interface BODY {
  title: string
}
const body: BODY = {
  title: 'axios ts'
}

/**
 * interceptor = {
 *  onFulfilled: (val: any) => any
 *  onRejected: (error) => error
 * }
 * axios.interceptorse = {
 *  request: [interceptor1,interceptor2,interceptor3],
 *  response: [interceptor1, interceptor2, interceptor3]
 * }
 */
// 请求拦截器：得到结果 “well321” 后面配置的先执行
let request = axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  config.headers && config.headers.name && (config.headers.name += '1')
  return config
})
axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  config.headers && config.headers.name && (config.headers.name += '2')
  return config
})
// 也可以是promise
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      config.headers && config.headers.name && (config.headers.name += '3')
      resolve(config)
      // 如果是 reject 则不会发起请求，直接走发起请求的catch
      // reject('请求失败了') 
    }, 1000);
  })
})
// 弹出配置，如果开启则弹出此配置，得到结果 well32
axios.interceptors.request.eject(request)
// 响应拦截器：得到结果 "拦截器12" 前面配置的先执行
let response = axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
  response.data.name = '拦截器1'
  return response
})
axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
  response.data.name += '2'
  return response
})
// 弹出第一项 得到 结果 "undefined2"
axios.interceptors.response.eject(response)
axios({
  method: 'post',
  url: baseURL + '/todos',
  params: user,
  data: body,
  headers: {
    'Content-Type': 'application/json',
    name: 'well'
  },
  timeout: 1000
}).then((response: AxiosResponse) => {
  console.log(response)
}).catch((err: any) => {
  console.log(err)
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
