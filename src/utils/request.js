/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-24 13:58:24
 * @LastEditors: Please set LastEditors
 * @Description: 封装axios文件
 */
import axios from 'axios'
import Cookies from "js-cookie";
import { Message, Notification } from 'element-ui'
import store from '../store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      Object.keys(config.params || {}).map((key) => {
        typeof config.params[key] === 'string' &&
          (config.params[key] = config.params[key].replace(
            /(^\s*)|(\s*$)/g,
            ''
          ))
      })
      config.params = {
        _t: new Date().getTime(),
        ...config.params,
      }
    }

    if (Cookies.get('TGC')) {
      config.headers['TGC'] = Cookies.get('TGC')
    }
    return config
  },
  (error) => {
    Notification.error({
      title: '错误',
      message: '加载超时',
      offset: 80,
    })
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (
      [200, 402].includes(res.code) ||
      response.config.responseType === 'blob'
    ) {
      return res
    } else {
      /**
       * @description: 400：参数失效
       */

      /**
       * @description: 402：代表特殊错误码，res.msg是json格式的数组
       */
      if ([405, 403].includes(res.code)) {
        store.dispatch('user/logout')
        return
      }
      if (/^\[/.test(res.msg) && res.code == 10801) {
        res.msg = res.msg.replace('[', '').replace(']', '')
      }
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000,
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
