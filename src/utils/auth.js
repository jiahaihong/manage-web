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

