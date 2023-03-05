/**
 * 公司模块相关API
 */
import request from "@/utils/request";
import SERVICE from "./enums";

// ==============合同相关

// 获取合同列表
export function getContractInfo(params) {
  return request({
    url: `${SERVICE.API_CUSTOMER}/assets/getContractInfo`,
    method: "post",
    data: params
  });
}
// 获得合同详情
export function getContractDetail(params) {
  return request({
    url: `${SERVICE.API_CUSTOMER}/assets/getContractByCode`,
    method: "get",
    params
  });
}

// 下载合同/协议
export function downloadContract(params) {
  return request({
    url: `${SERVICE.API_CUSTOMER}/assets/downloadContract`,
    method: "get",
    params,
    responseType: "blob"
  });
}

// ==============角色相关

// 获得角色菜单树
export function getResourceTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/resource/getResourceTree`,
    method: "get",
    params
  });
}

// 添加角色
export function postAddRole(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/role/addRole`,
    method: "post",
    data: params
  });
}

// 编辑角色
export function postEditRole(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/role/editRole`,
    method: "post",
    data: params
  });
}

// 查询角色
export function getRoleList(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/role/getRoleList`,
    method: "get",
    params
  });
}
// 删除角色
export function postDeleteRole(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/role/deleteRole`,
    method: "post",
    data: params
  });
}
// 查询单个角色权限
export function getRoleResourceIds(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/role/getRoleResourceIds`,
    method: "get",
    params
  });
}

// 成员管理================================================================================

// 获取企业组织树
export function getOrgTree(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getOrgTree`,
    method: "get",
    params
  });
}
// 添加组织节点
export function addOrgNode(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/addOrgNode`,
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
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}
// 获取组织下的用户
export function getOrgUser(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getOrgUser`,
    method: "get",
    params
  });
}
// 添加用户
export function addOrgUser(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/addUser`,
    method: "post",
    data
  });
}
// 编辑用户
export function updateUser(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/updateUser`,
    method: "post",
    data
  });
}

// 资产授权===================================

// 获取每个人能看到的用户列表
export function getOrgPerson(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getOrgPerson`,
    method: "get",
    params
  });
}

// 查询客户
export function searchCustomerList(data) {
  return request({
    url: `/customerservice/customerManage/searchCustomerList`,
    method: "post",
    data
  });
}

// 保存组织客户关系
export function saveCustomerAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveCustomerAssetRel`,
    method: "post",
    data
  });
}

// 分页获取财务ID
export function getPageAdvertiser(params) {
  return request({
    url: `/customerservice/advertiserManage/pageAdvertiser`,
    method: "get",
    params
  });
}

// 保存组织财务ID关系
export function saveAdvAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveAdvAssetRel`,
    method: "post",
    data
  });
}

// 渠道列表
export function postListChannel(data) {
  return request({
    url: `/customerservice/channelManage/listChannel`,
    method: "post",
    data
  });
}
// 保存组织渠道关系
export function saveChannelAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveChannelAssetRel`,
    method: "post",
    data
  });
}

// 获取产品信息
export function getProductInfos(params) {
  return request({
    url: `/customerservice/productManage/getProductInfos`,
    method: "get",
    params
  });
}

// 保存组织产品关系
export function saveProductAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveProductAssetRel`,
    method: "post",
    data
  });
}

// 财务ID授权关系
export function getAdvAuthInfo(advId, id) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getAdvAuthInfo`,
    method: "get",
    params: {
      advId: advId,
      orgId: id
    }
  });
}

// 产品授权关系
export function getProductAuthInfo(productId, id) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getProductAuthInfo`,
    method: "get",
    params: {
      productId: productId,
      orgId: id
    }
  });
}

// 渠道授权关系
export function getChannelAuthInfo(channelId, id) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getChannelAuthInfo`,
    method: "get",
    params: {
      channelId: channelId,
      orgId: id
    }
  });
}

// 客户授权关系
export function getCustomerAuthInfo(customerId, id) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getCustomerAuthInfo`,
    method: "get",
    params: {
      customerId: customerId,
      orgId: id
    }
  });
}

// 离职一键移交
export function userTransferAssets(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/userResign`,
    method: "post",
    data
  });
}

// 移交企业管理员
export function handOverToAdministrator(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/handOverToAdministrator`,
    method: "post",
    data
  });
}

// 获取邀请链接
export function getInviteMemberUrl() {
  return request({
    url: `${SERVICE.API_AUTHORITY}/user/getInviteUrl`,
    method: "get"
  });
}

// 获取成员基本信息
export function getSelfUserInfo(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getSelfOrgUser`,
    method: "get",
    params
  });
}

// 移交客户资产
export function moveCustomerAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveCustomerAssetRel`,
    method: "post",
    data
  });
}

// 移交财务ID资产
export function moveAdvAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveAdvAssetRel`,
    method: "post",
    data
  });
}

// 移交渠道资产
export function moveChannelAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveChannelAssetRel`,
    method: "post",
    data
  });
}

// 移交产品资产
export function moveProductAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveProductAssetRel`,
    method: "post",
    data
  });
}

// 删除客户资产
export function deleteUserCustomerAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserCustomerAssetRel`,
    method: "post",
    data
  });
}

// 删除财务ID资产
export function deleteUserAdvAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserAdvAssetRel`,
    method: "post",
    data
  });
}

// 删除渠道资产
export function deleteUserChannelAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserChannelAssetRel`,
    method: "post",
    data
  });
}

// 删除产品资产
export function deleteUserProductAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserProductAssetRel`,
    method: "post",
    data
  });
}

// 获取账号授权关系
export function getAccountAuthInfo(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getAccountAuthInfo`,
    method: "get",
    params
  });
}

// 保存账号账号关系
export function saveAccountAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveAccountAssetRel`,
    method: "POST",
    data
  });
}

// 分页获取外部账号广告账号
export function pageAccountOfOther(data) {
  return request({
    url: `${SERVICE.API_CUSTOMER}/mediaAccountManage/pageAccountOfOther`,
    method: "post",
    data
  });
}

// 移交账号资产
export function moveAccountAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveAccountAssetRel`,
    method: "post",
    data
  });
}

// 删除账号资产
export function deleteUserAccountAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserAccountAssetRel`,
    method: "post",
    data
  });
}

// 资产分配-获取合同列表
export function getContractInfos(params) {
  return request({
    url: `/customerservice/contractInfo/getContractInfos`,
    method: "get",
    params
  });
}

// 合同授权关系
export function getContractAuthInfo(contractId, id) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getContractAuthInfo`,
    method: "get",
    params: {
      contractId: contractId,
      orgId: id
    }
  });
}

// 保存组织合同关系
export function saveContractAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveContractAssetRel`,
    method: "post",
    data
  });
}

// 移交合同资产
export function moveContractAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveContractAssetRel`,
    method: "post",
    data
  });
}

// 删除合同资产
export function deleteUserContractAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserContractAssetRel`,
    method: "post",
    data
  });
}

// 资产分配-获取企业列表
export function getBusinessInfos(data) {
  return request({
    url: `/customerservice/corporation/searchAuthedCorporation`,
    method: "post",
    data
  });
}

// 企业授权关系
export function getBusinessAuthInfo(corporationId, id) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/getCorporationAuthInfo`,
    method: "get",
    params: {
      corporationId: corporationId,
      orgId: id
    }
  });
}

// 保存组织企业关系
export function saveBusinessAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/saveCorporationAssetRel`,
    method: "post",
    data
  });
}

// 移交企业资产
export function moveBusinessAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/moveCorporationAssetRel`,
    method: "post",
    data
  });
}

// 删除企业资产
export function deleteUserBusinessAssetRel(data) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/assets/deleteUserCorporationAssetRel`,
    method: "post",
    data
  });
}

// 获取部门基本信息
export function getOrgInfo(params) {
  return request({
    url: `${SERVICE.API_AUTHORITY}/org/getSelfOrgInfo`,
    method: "get",
    params
  });
}
