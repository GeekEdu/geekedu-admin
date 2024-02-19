import type { Axios, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'antd'
import { clearToken, getToken } from '../../utils/index'

function GoLogin() {
  clearToken()
  window.location.href = '/login'
}

export class HttpClient {
  axios: Axios

  constructor(url: string) {
    this.axios = axios.create({
      baseURL: url,
      timeout: 15000,
      withCredentials: false,
      headers: {
        Accept: 'application/json',
      },
    })

    // 拦截器注册
    this.axios.interceptors.request.use(
      (config) => {
        const token = getToken()
        token && (config.headers.Authorization = `Bearer ${token}`)
        return config
      },
      (err) => {
        return Promise.reject(err)
      },
    )

    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        const status = response.data.status
        const code = response.data.code // 业务返回代码
        const msg = response.data.message // 返回消息

        if (status === 0) {
          return Promise.resolve(response)
        }
        else if (status === 401 || status === 500) {
          message.error('请重新登录')
          GoLogin()
        }
        else {
          message.error(msg)
        }
        return Promise.reject(response)
      },
      // 当http的状态码非0
      (error) => {
        const status = error.response.status
        const errMsg = error.response.data.message
        if (status === 401 || status === 500) {
          message.error('请重新登录')
          GoLogin()
        }
        else if (status === 400) {
          message.error(errMsg)
        }
        else if (status === 404) {
          // 跳转到404页面
        }
        else if (status === 403) {
          // 跳转到无权限页面
        }
        else if (status === 500) {
          // 跳转到500异常页面
        }
        return Promise.reject(error.response)
      },
    )
  }

  get(url: string, params: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(url, {
          params,
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }

  destroy(url: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .delete(url)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }

  post(url: string, params: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .post(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }

  put(url: string, params: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .put(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }

  request(config: object) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(config)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }
}

const APP_URL = import.meta.env.VITE_APP_URL || ''

const client = new HttpClient(APP_URL)

export default client
