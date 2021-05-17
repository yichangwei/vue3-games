import axios from 'axios'
import { ElMessage } from 'element-plus'

axios.defaults.baseURL = ''
axios.defaults.timeout = 30000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(
  config => {
    // form数据headers处理
    if (config.data instanceof FormData) {
      Object.assign(config.headers, { headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' } })
    }
    return config
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  response => {
    const { code, msg } = response.data
    // 统一错误处理
    if (code && code !== '200') {
      ElMessage.error(msg)
    }
    return response.data
  }, error => {
    console.error(`response error: ${error}`)
    return Promise.reject(error)
  },
)
