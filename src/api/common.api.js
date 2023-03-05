/**
 * 通用API
 */
import request from "@/utils/request";
import SERVICE from "./enums";

// 菜单列表
export function getResourceTree() {
  /** 说明
   * type: 1(目录), 2(菜单), 3(按钮), 4(),
   * webTpye: 1(正常交互), 2(下滑交互)
   */
  return request({
    url: "/authorityservice/resource/getUserResourceTree?systemCode=NCS",
    method: "get"
  });
}

// 获取时区
export function getTimeZones(params) {
  return request({
    url: "/accountservice/google/getTimeZones",
    method: "get",
    params
  });
}

// 开户时提供选择的已授权的MCC列表
export function getAuthedMccManagerList(params) {
  return request({
    url: "/accountservice/google/getAuthedMccManagerList",
    method: "get",
    params
  });
}

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: "/authorityservice/role/getRoleList",
    method: "get",
    params
  });
}

// 获取时区（其他媒体）
export function getOtherMediaTimeZones(params) {
  return request({
    url: "/accountservice/mediaOpenAccountManage/getTimeZones",
    method: "get",
    params
  });
}

// 获取地区（其他媒体）
export function getOtherMediaCountry(params) {
  return request({
    url: "/accountservice/mediaOpenAccountManage/getDictCountry",
    method: "get",
    params
  });
}
// 获取行业类型--tiktok
export function getIndustryTypeList(params = { type: 3 }) {
  return request({
    url: "/accountservice/tiktok/getDicOpenAccount",
    method: "get",
    params
  });
}
// 获取时区--tiktok
export function getTimezoneList(params) {
  return request({
    url: "/accountservice/tiktok/getDicOpenAccount",
    method: "get",
    params
  });
}
// 获取国家地区--tiktok
export function getCountryCodeList(params = { type: 1 }) {
  return request({
    url: "/accountservice/tiktok/getDicOpenAccount",
    method: "get",
    params
  });
}

// 获取所有媒体列表
export function getAllMediaList(params) {
  return request({
    url: `${SERVICE.API_CUSTOMER}/mediaManage/listMediaInfo`,
    method: "get",
    data: params
  });
}

// 判断是否是预付客户（预付客户使用钱包）
export function getIsUseWallet(params) {
  return request({
    url: `/accountservice/wallet/ifUseWallet`,
    method: "get",
    data: params
  });
}

// 媒体平台列表
export function getListPlatform(data) {
  return request({
    url: `/customerservice/mediaManage/pageMediaInfo`,
    method: "post",
    data
  });
}

// 企业列表
export function getCorporationList(data) {
  return request({
    url: `/customerservice/corporation/fuzzySearchCorporationWithCount`,
    method: "post",
    data
  });
}
