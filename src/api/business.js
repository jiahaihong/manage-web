/**
 * 企业管理相关接口
 */

import request from "@/utils/request";
import SERVICE from "./enums";

/**
 * @description: 新版企业列表
 * @param {*}
 * @return {*}
 */
export function searchCorporationListWithCustomer(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/searchCorporationListWithCustomer`,
    method: "get",
    params
  });
}

/**
 * @description: 新版企业合并列表
 * @param {*}
 * @return {*}
 */
export function getCorporationMergeApply(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/corporationMergeApply/getCorporationMergeApply`,
    method: "get",
    params
  });
}

// 生成邀请链接
export function getInviteUrl(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/getInviteUrl`,
    method: "get",
    params
  });
}

/**
 * @description: 企业合并 通过
 * @param {*}
 * @return {*}
 */
export function auditSuccess(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/corporationMergeApply/auditSuccess`,
    method: "get",
    params
  });
}

/**
 * @description: 企业合并 驳回
 * @param {*}
 * @return {*}
 */
export function auditFail(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/corporationMergeApply/auditFail`,
    method: "get",
    params
  });
}

/**
 * @description: 企业合并提交
 * @param {*} data
 * @return {*}
 */
export function submitCorporationMergeApply(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/corporationMergeApply/submitCorporationMergeApply`,
    method: "post",
    data: data
  });
}

// 分页查询企业列表
export function searchCorporationList(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/searchCorporationList`,
    method: "post",
    data: data
  });
}

/**
 * @description: 客户交接
 * @param {*} data
 * @return {*}
 */
export function createCorporation(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/createCorporation`,
    method: "post",
    data: data
  });
}
/**
 * @description: 客户交接 详情页查询
 * @param {*} data
 * @return {*}
 */
export function searchBusinessAuthorization(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/searchBusinessAuthorization`,
    method: "post",
    data: data
  });
}

/**
 * @description: 选择CRM客户
 * @param {*} data
 * @return {*}
 */
export function getBusinessCustomers(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/getBusinessCustomers`,
    method: "get",
    params
  });
}

/**
 * @description: 获取基本信息
 * @param {*} params
 * @return {*}
 */
export function getCustomerDetails(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerInfo/getCustomerDetails`,
    method: "get",
    params
  });
}
/**
 * @description: 更新基本信息(crm拉数据)
 * @param {*} params
 * @return {*}
 */
export function syncCustomerByCode(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/sync/syncCustomerByCode`,
    method: "get",
    params
  });
}

/**
 * @description: 被合并企业模糊查询
 * @param {*} data
 * @return {*}
 */
export function fuzzySearchOldCorporationWithCount(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/corporationMergeApply/fuzzySearchOldCorporationWithCount`,
    method: "get",
    params
  });
}

// 编辑企业
export function updateCorporation(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/updateCorporation`,
    method: "post",
    data: data
  });
}

// 新增或更新企业开户设置
export function setConfigLimit(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/configLimit`,
    method: "post",
    data
  });
}
// 获取客户开户限制详情
export function getCustomerLimitConfig(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/getCustomerLimitConfig`,
    method: "get",
    params
  });
}

/**
 * @description: 获取合同信息
 * @param {*} params
 * @return {*}
 */
export function pageContractInfos(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/contractInfo/pageContractInfos`,
    method: "post",
    data
  });
}

/**
 * @description: 查询客户返点信息
 * @param {*} data
 * @return {*}
 */
export function findList(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/rebateManage/findList`,
    method: "post",
    data
  });
}

export function getContractBusinessType(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/contractInfo/getContractBusinessType`,
    method: "get",
    params
  });
}

/**
 * @description: 根据业务线获取企业
 * @param {*} params
 * @return {*}
 */
export function fuzzySearchCorporationByBusinessLine(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/fuzzySearchCorporationByBusinessLine`,
    method: "post",
    data
  });
}
/**
 * @description: 获取客户情况介绍
 * @param {*} params
 * @return {*}
 */
export function getCustomerInfoDetail(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customer/getCustomerInfoDetail`,
    method: "get",
    params
  });
}

/**
 * @description: 获取客户情况介绍
 * @param {*} params
 * @return {*}
 */
export function saveCustomerInfoDetail(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/customer/saveCustomerInfoDetail`,
    method: "post",
    data
  });
}

/**
 * @description: 风控记录
 * @param {*} params
 * @return {*}
 */
export function pageCustomerNotification(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/customerNotification/pageCustomerNotification`,
    method: "get",
    params
  });
}

// 创建企业
export function createNaturalCorporation(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/createNaturalCorporation`,
    method: "post",
    data: data
  });
}

// 编辑企业
export function simpleUpdateCorporation(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/simpleUpdateCorporation`,
    method: "post",
    data: data
  });
}

// 获取企业联系人邮箱
export function getCorporationEmailOptions(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/listEmailByCorporationCode`,
    method: "get",
    params
  });
}
