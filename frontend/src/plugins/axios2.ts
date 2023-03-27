import { $env } from '@/env'
import axios from 'axios'
import { ElNotification } from 'element-plus'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: 'http://175.41.233.153:3000',
}

const http = axios.create(config)

http.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    const respData = response.data

    if (respData.code != 0) {
      return Promise.reject(new Error(respData.msg))
    }

    return respData
  },
  function (error) {
    ElNotification({
      title: 'Error',
      message: `Fail: ${error.message}`,
      type: 'error',
    })

    // Do something with response error
    return Promise.reject(error)
  }
)

export default http
