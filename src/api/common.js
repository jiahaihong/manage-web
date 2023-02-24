/*
 * @Author: your name
 * @Date: 2021-05-27 10:21:54
 * @LastEditTime: 2023-02-24 11:30:53
 * @LastEditors: Please set LastEditors
 * @Description: 公用接口
 */
import request from '@/utils/request'
import SERVICE from './enums'

// 获取 行业类型
export function getCustomerTypeDict(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/getCustomerTypeDict`,
    method: 'get',
    params,
  })
}

// 获取 大洲 国家结构（当前）
export function listRegionCountry(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/listRegionCountry`,
    method: 'get',
    params,
  })
}

// 获取 大洲 国家结构 (全量)
export function getNationalDictionary(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getNationalDictionary`,
    method: 'get',
    params,
  })
}

// 文件上传
export function uploadFile(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/commonapi/uploadFile`,
    method: 'post',
    data: data,
  })
}

// 获取省市区（bug, 无用接口）
export function getAreaTree(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/commonapi/getAreaTree`,
    method: 'get',
    params,
  })
}

// 获取AM列表 /commonapi/listAMDepartment （bug 无用了）
export function listAMDepartment(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getAmDept`,
    method: 'get',
    params: params,
  })
}

// 获取品牌列表 （bug 无用了）
export function getBrDept(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getBrDept`,
    method: 'get',
    params: params,
  })
}

// 下载账号模板
export function downloadExcelTemplate(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/commonapi/downloadExcelTemplate`,
    method: 'get',
    // responseType: 'blob',
    params,
  })
}
// 获取州/国家接口
export function getContinentCountry(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/commonapi/getContinentCountry`,
    method: 'get',
    params,
  })
}

/**
 * @description: 渠道下拉框 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzySearchChannelWithCount(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/channelManage/fuzzySearchChannelWithCount`,
    method: 'post',
    data: data,
  })
}
/**
 * @description: 产品名称 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzySearchProductInfosWithCount(productName) {
  return request({
    url: `${SERVICE.API_SERVICE}/productManage/fuzzySearchProductInfosWithCount`,
    method: 'post',
    data: { productName },
  })
}

/**
 * @description: 外部用户 模糊查询
 * @param {*} params
 * @return {*}
 */
export function getUserNameAndEmail(userLoginOrName) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/getUserNameAndEmail`,
    method: 'get',
    params: { userLoginOrName },
  })
}

/**
 * @description: 全量MCC 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzyQueryAllMcc(mcc) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/fuzzyQueryAllMcc`,
    method: 'get',
    params: { mcc },
  })
}

/**
 * @description: BmId 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzyQueryAllBmId(BmId) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/fuzzyQueryAllBmId`,
    method: 'get',
    params: { BmId },
  })
}

/**
 * @description: 全量媒体账号 模糊查询
 * @param {*} params accountId
 * @return {*}
 */
export function fuzzyQueryAccountIdOrName(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/fuzzyQueryAccountIdOrName`,
    method: 'get',
    params,
  })
}

/**
 * @description: 开户主体 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzyQueryAllCompany(company) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/fuzzyQueryAllCompany`,
    method: 'get',
    params: { company },
  })
}

/**
 * @description: 渠道编码 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzyQueryChannelAbb(abbName) {
  return request({
    url: `${SERVICE.API_SERVICE}/channelManage/fuzzyQueryChannelAbb`,
    method: 'get',
    params: { abbName },
  })
}

/**
 * @description: 财务ID运营人模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzySearchAllOperator(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/advertiserManage/fuzzySearchAllOperator`,
    method: 'get',
    params,
  })
}

/**
 * @description: tictok Bc
 * @param {*} params
 * @return {*}
 */
export function fuzzyQueryAccountBc(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/fuzzyQueryAccountBc`,
    method: 'get',
    params,
  })
}

/**
 * @description: 获取 云下载文件
 * @param {*} params
 * @return {*}
 */
export function getExportList() {
  return request({
    url: `/complexservice/export/getExportList`,
    method: "get",
    params: { systemCode: 'CSM' }
  })
}

/**
 * @description: 下载 云下载文件
 * @param {*} params
 * @return {*}
 */
export function downloadYunFile(params) {
  return request({
    url: `/complexservice/export/download`,
    method: "get",
    responseType: "blob",
    params
  })
}

