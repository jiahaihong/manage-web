/*
 * @Author: tracy.sun
 * @Date: 2021-06-17 10:55:08
 * @LastEditors: tracy.sun
 * @LastEditTime: 2023-02-21 18:43:18
 * @Description:
 */
const TokenKey = "business_admin_token";

// 跳转登录页
export function JUMP_LOGIN_URL() {
  const test = "http://test.business.yeahmobi.com/login";
  const dev = "http://dev.business.yeahmobi.com/login";
  const online = "https://business.cyberklick.com.cn/login";
  const url = location.origin;
  let href = "";
  const isHttps = url.includes("https");
  if (isHttps) {
    href = online;
  } else {
    const isDev = url.includes("http://dev");
    href = isDev ? dev : test;
  }
  window.location.href = `${href}?redirectUri=${encodeURI(location.href)}`;
}

// 获取客户中心地址
export function GET_CYBERKLICK() {
  const test = "http://test.media.yeahmobi.com";
  const dev = "http://dev.media.yeahmobi.com";
  const online = "https://media.cyberklick.com.cn";
  const url = location.origin;
  const isHttps = url.includes("https");
  if (isHttps) {
    return online;
  } else {
    const isDev = url.includes("http://dev");
    return isDev ? dev : test;
  }
}

export function getToken() {
  // return Cookies.get(TokenKey)
  return window.localStorage.getItem(TokenKey);
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return window.localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  window.localStorage.removeItem(TokenKey);
}
