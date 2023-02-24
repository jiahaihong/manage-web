/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-01-03 16:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 系统管理相关接口
 */

import request from '@/utils/request'
import SERVICE from './enums'

/**
 * @description: 分页查询操作日志
 * @param {*} params
 * @return {*}
 */
export function getLogInfos(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/log/getLogInfos`,
    method: 'get',
    params,
  })
}

/**
 *
 * 媒体配置
 */

// 媒体列表
export function getListPlatform(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaManage/pageMediaInfo`,
    method: 'post',
    data,
  })
}
// 添加媒体
export function addPlatform(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaManage/saveMediaInfo`,
    method: 'post',
    data,
  })
}
// 编辑媒体
export function updatePlatform(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaManage/updateMediaInfo`,
    method: 'post',
    data,
  })
}

/**
 * @description: 部门查询
 * @param {*} params
 * @return {*}
 */
export function queryConfigDtos(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/dept/queryConfigDtos`,
    method: 'get',
    params,
  })
}

/**
 * @description: 部门查询新增
 * @param {*} data
 * @return {*}
 */
export function saveConfigs(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/dept/saveConfigs`,
    method: 'post',
    data,
  })
}

/**
 * @description: 部门查询更新
 * @param {*} data
 * @return {*}
 */
export function updateConfigs(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/dept/updateConfigs`,
    method: 'post',
    data,
  })
}

/**
 * @description: 全部部门接口
 * @param {*} data
 * @return {*}
 */
export function fuzzySearchDepartment(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/dept/fuzzySearchDepartment`,
    method: 'get',
    params,
  })
}

/**
 *
 * 菜单配置
 */
// 获取子系统列表
export function getChildSystem(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/getChildSystem`,
    method: 'get',
    params,
  })
}
// 获取指定子系统菜单树
export function getSystemResources(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/getSystemResources`,
    method: 'get',
    params,
  })
}
// 添加资源
export function addSysResource(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/addSysResource`,
    method: 'post',
    data,
  })
}
// 编辑资源
export function editSysResource(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/editSysResource`,
    method: 'post',
    data,
  })
}

// 删除资源
export function delResourceTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/delResourceTree`,
    method: 'delete',
    params,
  })
}
/**
 * @description: 权限包 查询
 * @param {*}
 * @return {*}
 */
export function getAuthPackList(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/getAuthPackList`,
    method: "get",
    params,
  });
}

/**
 * @description: 获取可选资源树 查询;编辑和添加后 接口不一致
 * @param {*}
 * @return {*}
 */
export function getActiveAuthPack(params, isEdit = false) {
  const name = isEdit ? 'getEditActiveAuthPack' : 'getAddActiveAuthPack'
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/${name}`,
    method: "get",
    params,
  });
}

/**
 * @description: 添加权限包
 * @param {*}
 * @return {*}
 */
export function addAuthPack(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/addAuthPack`,
    method: "post",
    data,
  });
}

/**
 * @description: 编辑权限包
 * @param {*}
 * @return {*}
 */
export function editAuthPack(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/editAuthPack`,
    method: "post",
    data,
  });
}

/**
 * @description: 获取单个权限包
 * @param {*}
 * @return {*}
 */
export function getAuthPackInfo(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/getAuthPackInfo`,
    method: "get",
    params
  });
}

/**
 * @description: 查看权限包
 * @param {*}
 * @return {*}
 */
export function getPackHaveResource(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/getPackHaveResource`,
    method: "get",
    params
  });
}

/**
 * @description: 企业权限包
 * @param {*}
 * @return {*}
 */
export function getCorporationAuthPack(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/getCorporationAuthPack`,
    method: "get",
    params
  });
}

/**
 * @description: 发布
 * @param {*}
 * @return {*}
 */
export function deployAuthPack(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/authPack/deployAuthPack`,
    method: "post",
    data,
  });
}

/**
 * @description: 获取接口应用申请列表
 * @param {*}
 * @return {*}
 */
export function clientManagePage(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/clientManage/page`,
    method: "get",
    params
  });
}

/**
 * @description: 审核创建应用 通过
 * @param {*}
 * @return {*}
 */
export function clientManageAuditPass(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/clientManage/audit/pass`,
    method: "post",
    params,
  });
}
/**
 * @description: 审核创建应用 通过
 * @param {*}
 * @return {*}
 */
export function clientManageAuditReject(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/clientManage/audit/reject`,
    method: "post",
    params,
  });
}

/**
 * @description: 审核创建应用 查看
 * @param {*}
 * @return {*}
 */
export function clientView(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/scope/urls`,
    method: "get",
    params
  });
}

/**
 * @description: 对外开发接口 获取必填的URL
 * @param {*} data
 * @return {*}
 */
export function clienUrlsChecked(data) {
  return request({
    url: '/customerservice/scope/urls/checked',
    method: 'post',
    data
  });
}
