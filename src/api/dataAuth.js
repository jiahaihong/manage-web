/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2021-07-21 19:25:45
 * @LastEditors: Please set LastEditors
 * @Description: 数据授权相关接口 (bug 未使用)
 */

import request from "@/utils/request";
import SERVICE from "./enums";

// 分页客户列表
export function searchCustomerList(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/searchCustomerList`,
    method: "post",
    data
  });
}

// 分页查询权限用户列表
export function getList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/datapermission/pageUserDataPermission`,
    method: "get",
    params
  });
}
// 数据授权
export function dataAuthorize(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/datapermission/${data.dataType}/dataAuthorize`,
    method: "post",
    data
  });
}

// 移除数据授权
export function removeAuthorize(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/datapermission/${data.dataType}/removeAuthorize`,
    method: "post",
    data
  });
}

