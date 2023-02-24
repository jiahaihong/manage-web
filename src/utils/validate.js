/*
 * @Author: your name
 * @Date: 2023-02-24 13:29:55
 * @LastEditTime: 2023-02-24 13:29:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yeahmedia-webd:\d_personal\00job\manage-web\src\utils\validate.js
 */
/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2021-04-30 11:20:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \yeahmedia-webc:\AAPerson\Bjob\business-admin\src\utils\validate.js
 */
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 邮箱
const email = /^[A-Za-z0-9\u4e00-\u9fa5\.\-\_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

// 身份证
const ident = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 正数
const integer = /^\d+(\.\d{1,2})?$/

// 密码
const isPsw = /^(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+._~!@#$%^&*()]{8,20}$/

export default {
  email,
  ident,
  integer,
  isPsw,
}
