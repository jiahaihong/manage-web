import request from "@/utils/request";
import SERVICE from "./enums";

// // 获取账号前面参数
// export function getAccountBaseUrl() {
//   const name = _this.history.current.name || '';
//   if (['FBK', 'GGL', 'TTK', 'JTT'].includes(name)) {
//     return name + "accountManage";
//   }
//   return 'mediaAccountManage'
// }

// 所有媒体获取账号列表
export function getAccountList(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/pageAccount`,
    method: "post",
    data
  });
}

// 导入账号列表
export function importAccount(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/importAccount`,
    method: "post",
    data
  });
}

// 导出账号 (用于twitter、pintereset、snapchat、bing等全部)
export function exportAccount(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/exportAccount`,
    method: "post",
    data
  });
}

// 获取未绑定账号数量 (关联新账户弹框)
export function getUnbindAccountCount(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getUnbindAccountCount`,
    method: "get",
    params
  });
}

// 模糊搜素未绑定账号 (关联新账户弹框)
export function fuzzyUnbindAccount(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/fuzzyUnbindAccount`,
    method: "get",
    params
  });
}

// 关联账号 (关联账号弹框)
export function bindAccount(data, params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/bindAdvertiserId`,
    method: "post",
    data,
    params
  });
}

// 关联账号 (关联账号弹框)
export function batchBindAdvertiserId(data, params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/batchBindAdvertiserId`,
    method: "post",
    data,
    params
  });
}

// 转移财务ID提交审核 (转移财务ID弹框)
export function submitExchangeAdvertiser(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/submitExchangeAdvertiser`,
    method: "post",
    data
  });
}

// 查询某个财务ID下账号数量 (转移财务ID弹框 修改账号状态弹窗)
export function getAdvAccountNumberByMedia(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/advertiserManage/getAdvAccountNumberByMedia`,
    method: "get",
    params
  });
}

// 转移财务ID审核列表 (转移财务ID审核列表)
export function searchExchangeAdvertisers(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/searchExchangeAdvertisers`,
    method: "post",
    data
  });
}

// 修改状态记录 (变更记录弹框)
export function getStatusLogByAccount(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getStatusLogByAccount`,
    method: "get",
    params
  });
}

// 财务ID转移记录 (变更记录弹框)
export function searchExchangeAccountLogs(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/searchExchangeAccountLogs`,
    method: "post",
    data
  });
}

// 修改账号状态 (修改账号弹框)
export function modifyAccountStatus(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/modifyAccountStatus`,
    method: "post",
    data
  });
}

// 保存标记账号状态 (标记账号弹框)
export function modifyAccountOperatingType(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/modifyAccountOperatingType`,
    method: "post",
    data
  });
}

// 查询业务类型修改记录 (标记账号弹框)
export function getModifyOperatingTypeLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyOperatingTypeLog`,
    method: "get",
    params
  });
}

// 查询业务类型修改记录 对应的账号修改数量 (标记账号弹框)
export function getModifyOperatingTypeLogAccountList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyOperatingTypeLogAccountList`,
    method: "get",
    params
  });
}

// 获取修改账号记录(修改账号弹框)
export function getModifyStatusLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyStatusLog`,
    method: "get",
    params
  });
}

// 查看账号状态修改批次操作的账号 (转移账号弹窗 )
export function getModifyStatusByBatchNo(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyStatusByBatchNo`,
    method: "get",
    params
  });
}

// 分页查询审核账号 (转移账号弹窗 )
export function searchExchangeAccounts(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/searchExchangeAccounts`,
    method: "post",
    data
  });
}

/**
 * @description: 导出 转移账号弹窗
 * @param {*} data
 * @return {*}
 */
export function exportExchangeAccounts(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/exportExchangeAccounts`,
    method: "post",
    data,
    responseType: "blob"
  });
}

// 导入更新状态账号列表
export function importModifyAccountList(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/importModifyAccountList`,
    method: "post",
    data
  });
}

// 批量转移广告主审核数据分析
export function batchAdvertiserDataAnalysis(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/batchAdvertiserDataAnalysis`,
    method: "post",
    data
  });
}

// 导出 更新状态账号列表
export function exportModifyAccountStatusResult(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/exportModifyAccountStatusResult`,
    method: "get",
    params,
    responseType: "blob"
  });
}

// 批量转移账号，导出分析结果
export function advExportAnalysisData(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/advExportAnalysisData`,
    method: "get",
    params,
    responseType: "blob"
  });
}

// 关联账户中 选择文件上传分析
export function analyzeAccountInformation(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/analyzeAccountInformation`,
    method: "post",
    data
  });
}

// 关联账户中 导出数据
export function exportAnalysisData(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/exportAnalysisData`,
    method: "get",
    responseType: "blob",
    params
  });
}

// 导入更新Division id  (更新DivisionID弹框)
export function importDivisionId(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/importDivisionId`,
    method: "post",
    data
  });
}

// 导出更新Division id  (更新DivisionID弹框)
export function exportDivisionIdAnalyseResult(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/exportDivisionIdAnalyseResult`,
    method: "post",
    params,
    responseType: "blob"
  });
}

// 更新Division id  (更新DivisionID弹框)
export function updateDivisionID(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/updateDivisionID`,
    method: "post",
    data
  });
}

// 获取更新divisionid 记录  (更新DivisionID弹框)
export function getUpdateDivisionIdLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/getUpdateDivisionIdLog`,
    method: "get",
    params
  });
}

// 获取渠道转移日志(google)  (变更记录弹框)
export function getChangeChannelLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/getChangeChannelLog`,
    method: "get",
    params
  });
}

// 查询账号转移渠道日志(google)  (变更记录弹框)
export function getAccountBindChannelHistory(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/getAccountBindChannelHistory`,
    method: "get",
    params
  });
}

// 编辑账号绑定
export function modifyAccountBind(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/modifyAccountBind`,
    method: "post",
    data
  });
}

/**
 * @description: 账户名称修改接口
 * @param {*} data
 * @return {*}
 */
export function modifyAccountName(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/modifyAccountName`,
    method: "post",
    data
  });
}

/**
 * @description: 账号名称修改记录查询
 * @param {*} params
 * @return {*}
 */
export function getModifyNameLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyNameLog`,
    method: "get",
    params
  });
}

/**
 * @description: 搜索手动对接的渠道
 * @param {*} params
 * @return {*}
 */
export function searchManualMatchChannel(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/channelManage/searchManualMatchChannel`,
    method: "get",
    params
  });
}

/**
 * @description: 更新广告类型 储存
 * @param {*} data
 * @return {*}
 */
export function modifyAccountAdType(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/modifyAccountAdType`,
    method: "post",
    data
  });
}

/**
 * @description: 更新广告类型 操作记录
 * @param {*} params
 * @return {*}
 */
export function getModifyAdTypeLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyAdTypeLog`,
    method: "get",
    params
  });
}
/**
 * @description: 更新广告类型 查看账号
 * @param {*} params
 * @return {*}
 */
export function getModifyAdTypeLogAccountList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyAdTypeLogAccountList`,
    method: "get",
    params
  });
}

/**
 * @description: 更新BC 储存
 * @param {*} data
 * @return {*}
 */
export function modifyAccountBc(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/modifyAccountBc`,
    method: "post",
    data
  });
}

/**
 * @description: 更新BC 操作记录
 * @param {*} params
 * @return {*}
 */
export function getModifyBcLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyBcLog`,
    method: "get",
    params
  });
}
/**
 * @description: 更新BC 查看账号
 * @param {*} params
 * @return {*}
 */
export function getModifyBcLogAccountList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyBcLogAccountList`,
    method: "get",
    params
  });
}

// 导入更新ParentID (更新ParentID弹框)
export function importParentType(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/importParentType`,
    method: "post",
    data
  });
}

// 导出更新ParentID  (更新ParentID弹框)
export function exportParentAnalyseResult(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/exportParentAnalyseResult`,
    method: "post",
    params,
    responseType: "blob"
  });
}

// 更新ParentID (更新ParentID弹框)
export function updateParentType(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/updateParentType`,
    method: "post",
    data
  });
}

// 获取更新ParentID 记录  (更新ParentID弹框)
export function getUpdateParentTypeLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/GGLaccountManage/getUpdateParentTypeLog`,
    method: "get",
    params
  });
}

/**
 * @description: 账号转移 跳转OA链接
 * @param {*} params
 * @return {*}
 */
export function getOaUrlByApplyCode(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getOaUrlByApplyCode`,
    method: "get",
    params
  });
}

// 获取媒体平台账号状态
export function getMediaAccountStatus(params) {
  return request({
    url: `/customerservice/mediaAccount/getAccountDisplayStatus`,
    method: "get",
    params
  });
}

/**
 * @description: 广点通 更新K框 储存
 * @param {*} data
 * @return {*}
 */
export function modifyAccountDomain(data) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/modifyAccountDomain`,
    method: "post",
    data
  });
}

/**
 * @description: 广点通 更新K框 操作记录
 * @param {*} params
 * @return {*}
 */
export function getModifyDomainLog(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyDomainLog`,
    method: "get",
    params
  });
}

/**
 * @description: 广点通 更新K框 查看账号
 * @param {*} params
 * @return {*}
 */
export function getModifyDomainLogAccountList(params) {
  return request({
    url: `${SERVICE.API_SERVICE}/mediaAccountManage/getModifyDomainLogAccountList`,
    method: "get",
    params
  });
}
