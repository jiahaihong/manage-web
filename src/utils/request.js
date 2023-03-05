/*
 * @Author: your name
 * @Date: 2020-12-03 14:28:01
 * @LastEditTime: 2022-09-07 17:56:51
 * @LastEditors: tracy.sun
 * @Description: axios 封装文件
 */
import axios from "axios";
import { message } from "ant-design-vue";
import store from "../store";

const service = axios.create({
  baseURL: "/api"
});

service.interceptors.request.use(
  config => {
    config.headers["TGC"] = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg0MjcxMTM3NTU0MTI5NTgxMzYifQ.eyJlbWFpbCI6Imdlb3JnZS5xaWFvQHllYWhtb2JpLmNvbSIsIm5hbWUiOiJHZW9yZ2Uo5LmU5p2wKSIsIm1vYmlsZSI6IjE4NjkwNDU0MDU0IiwiZXh0ZXJuYWxJZCI6IjA2QjI5QTY4LTVBQUItNDlDQy05MkI3LTU3QThCOERBOTQzOSIsInVkQWNjb3VudFV1aWQiOiI1YTEzOTAzYzVlMmU4YThjYjhkZDY3YTkxZTA4YjIxMDB5U2FxZ01ZdUNaIiwib3VJZCI6IjNGREE0MDFGLTJDRjktNDgyNC04N0MxLUNDNkJBMzAwNTE4OSIsIm91TmFtZSI6IlllYWhNZWRpYeS4reWPsOe7hCIsIm9wZW5JZCI6bnVsbCwiaWRwVXNlcm5hbWUiOiJnZW9yZ2UucWlhbyIsInVzZXJuYW1lIjoiZ2VvcmdlLnFpYW8iLCJhcHBsaWNhdGlvbk5hbWUiOiJZZWFobWVkaWEtRGV2IiwiZW50ZXJwcmlzZUlkIjoiYTAxIiwiaW5zdGFuY2VJZCI6ImEwMSIsImFsaXl1bkRvbWFpbiI6IiIsImV4dGVuZEZpZWxkcyI6e30sImV4cCI6MTY3ODA2OTA0MywianRpIjoiUFl3bGZrLTJ4eEx3Z3R3NkdWT0xpdyIsImlhdCI6MTY3Nzk4MjY0MywibmJmIjoxNjc3OTgyNTgzLCJzdWIiOiJnZW9yZ2UucWlhbyIsImlzcyI6Imh0dHA6Ly9zc290ZXN0LnltdGVjaC5pbmZvLyIsImF1ZCI6ImEwMXBsdWdpbl9qd3QxOCJ9.kP24HsqQF89giwDXIbzW4rN463_hQ513tRrLsCbRxZWOFam-cnG1i6v7pnyKDbMLgu3HVT2M0P7O2Q3SlaDPxK88F6FajjwltxSCzGUzK83TwRtAuCt9LhF_VDdh-vipf4VIhUQ_2UisrdIQU3mQD22bKDfFxbP_NLQAXOOqo1TxI08Cxg-lbVwgG7MxmQF7JHck-7RK8C3ehnNMGutY1KQmFmQfQ_j7NOQFTq_PCx1grJlzs5URjACHqObZHlfb5MQC1Rp_jGfvFoHLG6qAD7J0gC22kkqiBT1-a_gPmQ4SVrib3obrxXPzmdCHtRtpaACCP1QwkKuRpB22Ux5u7Q";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code === 200 || response.config.responseType === "blob") {
      return res;
    } else {
      if ([401, 402, 403, 405].includes(res.code)) {
        store.dispatch("user/logout");
        return;
      }
      message.error(res.msg || res.message);
      return Promise.reject(new Error(res.msg || "Error"));
    }
  },
  error => {
    // message.error(error.message);
    return Promise.reject(error);
  }
);

export default service;
