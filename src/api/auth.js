/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-01-04 16:08:15
 * @LastEditors: tracy.sun
 * @Description: 权限
 */
import request from "@/utils/request";
import SERVICE from "./enums";

// 登录
export function login(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/auth/sso/login`,
    method: "post",
    data
  });
}
// 登出
export function logout(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/auth/logout`,
    method: "get",
    params
  });
}

// 获取菜单列表
export function getUserResource(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/getUserResourceTree`,
    method: "get",
    params
  });
}

/**
 * @description: 全部菜单
 * @param {*} params
 * @return {*}
 */
export function getResourceTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/getResourceTree`,
    method: "get",
    params
  });
}
