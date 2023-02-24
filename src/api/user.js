/**
 * 用户相关接口
 */
import request from "@/utils/request";
import SERVICE from "./enums";

/**
 * @description: 获取当前用户信息
 * @param {*}
 * @return {*}
 */
export function getCurrentUserInfo() {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/getCurrentUserInfo`,
    method: "get"
  });
}

/**
 * @description: 获取当前用户 头像
 * @param {*}
 * @return {*}
 */
export function getAvatar() {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/getAvatar`,
    method: "post"
  });
}

/**
 * @description: 对接商务 模糊查询
 * @param {*} params
 * @return {*}
 */
export function fuzzyUserInfo(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/fuzzyUserEmail`,
    method: "get",
    params: params
  });
}

// 获取企业用户列表
export function listRegisterUser(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/user/listRegisterUser`,
    method: "get",
    params: params
  });
}
// 获取内部用户列表
export function listAdminUser(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/user/listAdminUser`,
    method: "get",
    params: params
  });
}
// 创建注册用户 (bug 未用过)
export function addRegisterUser(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/user/addRegisterUser`,
    method: "post",
    data: data
  });
}
// 更新注册用户 (bug 未用过)
export function updateRegisterUser(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/user/updateRegisterUser`,
    method: "post",
    data: data
  });
}

// 更新内部用户
export function updateAdminUser(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/user/updateAdminUser`,
    method: "post",
    data: data
  });
}

// 获取角色列表(内部用户)
export function listUserRole(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/user/listUserRole`,
    method: "get",
    params: params
  });
}
// 获取企业列表
export function fuzzySearchCorporation(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/fuzzySearchCorporation`,
    method: "get",
    params: params
  });
}

// 外部用户列表
export function getOutUserList(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/pageOutUserInfos`,
    method: "post",
    data: data
  });
}

// 外部企业列表
export function getOutCorporationList(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/corporation/fuzzySearchCorporationWithCount`,
    method: "post",
    data: data
  });
}

// 获取企业下的组织树
export function getOutOrgTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getOrgTreeCyCorporationCode`,
    method: "get",
    params: params
  });
}

/**
 * @description: 获取公司组织建构
 * @param {*} params
 * @return {*}
 */
export function getOrgTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getOrgTree`,
    method: "get",
    params: {
      useSign: false,
      ...params
    }
  });
}

/**
 * @description: 获取公司组织建构 (当前用户权限有的)
 * @param {*} params
 * @return {*}
 */
export function getUserCurLowerOrgTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getUserCurLowerOrgTree`,
    method: "get",
    params: params
  });
}

// 添加组织节点
export function addCorOrgNode(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/addCorOrgNode`,
    method: "post",
    data
  });
}
// 编辑组织节点
export function editOrgNode(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/editOrgNode`,
    method: "post",
    data
  });
}
// 删除组织节点
export function deleteOrgNode(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/deleteOrgNode`,
    method: "post",
    data
  });
}

// 获取企业角色列表
export function getCorporationRoles(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/role/getCorporationRoles`,
    method: "post",
    data: data
  });
}

// 添加用户
export function addUser(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/addUser`,
    method: "post",
    data: data
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/updateUser`,
    method: "post",
    data: data
  });
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/resetPassword`,
    method: "post",
    data: data
  });
}

// 离职一键移交
export function userTransferAssets(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/userResign`,
    method: "post",
    params
  });
}
