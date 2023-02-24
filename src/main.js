/*
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-24 13:31:14
 * @LastEditors: Please set LastEditors
 * @Description: 主文件
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Cookies from 'js-cookie'

import VueClipboard from 'vue-clipboard2'
import "./theme/index.css";
import ElementUI from 'element-ui'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

/**
 * @description: dart-sass打包有问题，暂时不用
 * @param {*}
 * @return {*}
 */
// import '@/styles/element-variables.scss'

// import 'element-ui/lib/theme-chalk/index.css'

import "@/assets/iconfont/iconfont.js"; // 引入iconfont
import '@/styles/index.scss' // global css

import GlobalEnum from "./utils/enum";
import GlobalMethod from "./utils/methods";

import '@/icons' // icon

import JSEncrypt from 'jsencrypt'

/**
 * @description: dayjs的体积比moment小很多,警告： 不要使用moment
 * @param {*}
 * @return {*}
 */
import dayjs from "dayjs";

Vue.use(VueClipboard)
Vue.use(ElementUI, { size: "small" });

/* ----- 全局注册 ----- */
Vue.prototype.$dayjs = dayjs;

/* 全局枚举 */
Vue.prototype.$enum = GlobalEnum;

/* 全局方法 */
for (const method in GlobalMethod) {
  Vue.prototype[method] = GlobalMethod[method];
}

Vue.prototype.$Cookies = Cookies
Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  // 如何连接线上，
  /**
   * @description: 配置cookie， 连接线上
   * @description: 切记提交gitlab 需要置灰
   */
  // const TGC = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbk5hbWUiOiJnZW9yZ2UucWlhb0B5ZWFobW9iaS5jb20iLCJpc3MiOiJTU08tQ0VOVEVSIiwiZXhwIjoxNjIyNjA0NTU2LCJpYXQiOjE2MjI2MDA5NTZ9.RTTzj2zhb_wrWLc0Vsb-ZjwvCvrVYzXXYvneahKwtIE'
  // Cookies.set("TGC", TGC)
}

// 注册rsa加密方法
Vue.prototype.$getRsaCode = function(str) {
  // 模板字符串 引用 rsa 公钥
  const pubKey = `-----BEGIN PUBLIC KEY-----
 MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHOCQ3N8UuH6oPIZS4QEBQlShEZwRZtNEH9GGcyfDNYv5GR2EeWoZzo9xGLc4NLbwOQsBRYabKkcSm0P9CcYfjrJTAwfTuEI0tLk3SEs52XH7bxxracp66aubxrC7bAOt+hmiEVAMF/11ZrrzG50n2zpGlVeAZuK21O6rVTYsitwIDAQAB
  -----END PUBLIC KEY-----`
  const encryptStr = new JSEncrypt()
  // 设置 加密公钥
  encryptStr.setPublicKey(pubKey)
  // 进行加密
  const data = encryptStr.encrypt(str.toString())
  return data
}

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
