/*
 * @Author: George
 * @Date: 2021-03-19 11:37:54
 * @LastEditTime: 2023-02-22 15:27:28
 * @LastEditors: Please set LastEditors
 * @Description: 媒体配置文件
 */
// 媒体配置 、返点页面 使用
export const functionCodesOptions = {
  bindAccount: '关联账号',
  modifyAccountStatus: '修改账号状态',
  updateDivisionId: '更新Parent关系',
  updateParentId: '更新Parent客户类型',
  exportAccount: '导出',
  changeLog: '变更记录',
  modifyAccountName: '修改账号名称',
  modifyAccountOperating: '标记运营类型',
  modifyAccountAdType: '更新广告类型',
  modifyAccountBc: '更新账号bc',
  modifyAccountDomain: '更新K框',
  importAccount: '导入账号'
}

// 无用了
export const customerRebateWayOptions = {
  fixedRatioOrCashBack: '固定比例/返现',
  stepScaleRebateSetting: '阶梯比例',
  googleRebateRatio: 'Google2021返点比例',
  google2022RebateRatio: 'Google2022返点比例',
  returnGoods: '返货',
  floatRatio: '浮动',
  tiktokFixRebateRatio: 'tiktok固定返点比例',
  tiktokStepRebateRatio: 'tiktok阶梯返点比例',
  kwaiStepRebateRatio: 'Kwai阶梯返点比例',
  kwaiFixRebateRatio: 'Kwai固定返点比例',
  accountTradeFixedRebateRatio: '按账号行业固定比例',
  accountTradeStepRebateRatio: '按账号行业阶梯比例',
}

export const channelRebateWayOptions = {
  fixedRatioOrCashBack: '固定比例',
  stepScaleRebateSetting: '阶梯比例',
  googleRebateRatio: 'Google2021返点规则',
  google2022RebateRatio: 'Google2022返点规则',
  google2023RebateRatio: 'Google2023返点规则',
  returnGoods: '固定返货比例',
  oceanEngineRebateRatio: '巨量2021返点规则',
  jttTradeRebateRatio: '巨量2022返点规则',
  jtt2023TradeRebateRatio: '巨量2023返点规则',
  tikTokRebateRatio: 'tiktok2021返点规则',
  tikTok2022Q2RebateRatio: 'tiktok2022Q2返点规则',
  tikTok2023RebateRatio: 'tiktok2023返点规则',
  kwaiStepRebateRatio: '按国家阶梯比例',
  stepScaleGoodsRebateSetting: '阶梯返货比例',
  domainFixedRebateRatio: '广点通2023返点规则',
}

export const Options = {
  functionCodesOptions,
  customerRebateWayOptions,
  channelRebateWayOptions
}

export const setOption = (obj) => {
  const op = Options[obj]
  if (!op) {
    return
  }
  return Object.keys(op).map(key => ({ label: key, text: op[key] }))
}

