/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-02-11 12:02:39
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \yeahmedia-webc:\AAPerson\Bjob\business-admin\src\api\customer.js
 */
/**
 * 客户相关接口
 */
import request from "@/utils/request";
import SERVICE from './enums'
// 模糊搜索客户
export function getCustomerList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/fuzzySearch`,
    method: "get",
    params
  });
}
// 模糊搜索全部客户
export function getAllCustomerList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/fuzzyAllSearch`,
    method: "get",
    params
  });
}
// 模糊搜索合同编码
export function getAllContractList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/contractInfo/fuzzyQueryContractCodeOrName`,
    method: "get",
    params
  });
}
// 模糊搜索合同
export function getContractList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/fuzzySearchContract`,
    method: "get",
    params
  });
}

// 根据客户编码获取财务ID信息
export function getAdvertiserListByCustomer(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/getAdvertiserInfoListByCustomer`,
    method: "get",
    params
  });
}

// 根据客户获取主体
export function getCustomerMainListByCustomerCode(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/getCustomerMainListByCustomerCode`,
    method: "get",
    params
  });
}

// 根据主体获取合同
export function getContractInfoListByCustomer(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/getContractInfoListByCustomer`,
    method: "get",
    params
  });
}

// 根据客户id获取合同
export function getContractInfoListByCustomerMain(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerManage/getContractInfoListByCustomerMain`,
    method: "get",
    params
  });
}

// 根据主体获取某个媒体平台账号
export function checkAccount(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/customer/adaccount/search`,
    method: "post",
    data
  });
}
