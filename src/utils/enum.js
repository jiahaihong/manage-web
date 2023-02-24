/**
 * 枚举
 */
import { $setObjectToArray } from "./methods";

/**
 * @description: 新本企业审核状态
 * @param {*}
 * @return {*}
 */
const COMPANY_STATUS_MAP = {
  1: {
    label: "待审核",
    color: "--global-color-warning"
  },
  2: {
    label: "审核通过",
    color: "--global-color-success"
  },
  3: {
    label: "审核失败",
    color: "--global-color-error"
  }
};

// 业务线
const BUSSINESSAD_BUSINESS_LINE = {
  HW: "海外大媒体",
  GN: "国内大媒体"
};

// 业务状态
const BUSSINESS_CUSTOMER_STATUS = {
  0: {
    label: "正在合作中",
    color: "--global-color-primary"
  },
  3: {
    label: "待交接运营",
    color: "--global-color-Info"
  }
};

// 风控状态
const RISK_CONTROL_STATUS = {
  0: {
    label: "正常",
    color: "--global-color-primary"
  },
  1: {
    label: "风控关停",
    color: "--global-color-warning"
  },
  2: {
    label: "风控清空",
    color: "--global-color-error"
  }
};

// 业务类型 海外
const BUSSINESSAD_TYPE_MAP = {
  MB: "开户",
  AG: "代投",
  BR: "品牌",
  RE: "再营销",
  ZX: "品牌咨询",
  HD: "互动广告",
  AGWF: "代投-外放"
};

// 业务类型 部门枚举
const BUSSINESSAD_DEPT_MAP = {
  amDepartmentCode: "AM",
  operationDepartmentCode: "投放",
  departmentCode: "运营",
  designDepartmentCode: "设计"
};

const BUSSINESSAD_DEPT_filed = Object.keys(BUSSINESSAD_DEPT_MAP);

// 业务类型 国内
const GN_BUSSINESSAD_TYPE_MAP = {
  MB: "开户",
  AG: "代投"
};

/**
 * @description: 广告类型(tictik 专用)
 * @param {*}
 * @return {*}
 */
const AD_TYPE_MAP = {
  BID: "竞价",
  AGREEMENT: "品牌"
};

// 币种
const CURRENCCY_TYPE_MAP = {
  // RMB: "人民币",
  CNY: "人民币",
  HKD: "港币",
  USD: "美元",
  JPY: "日元"
};

// 用户角色
const USER_ROLE_MAP = {
  ROLE_SUPER_ADMIN: "超级管理员",
  ROLE_ADMIN: "管理员",
  ROLE_USER: "普通用户"
};

// 业务线 businessLine
const BUSINESS_LINE_MAP = {
  HW: "海外大媒体",
  GN: "国内大媒体"
};

// (企业)用户状态
const USER_STATUS_MAP = {
  0: "使用中",
  1: "已禁用"
  // 2: "已使用"
};

/**
 * @description: 合同发票类型
 * @param {*}
 * @return {*}
 */
const INVOICE_TYPE_MAP = {
  "FPLX-1": "全额invoice",
  "FPLX-2": "增值税发票",
  "FPLX-3": "增值税专用发票",
  "FPLX-4": "请求书",
  "FPLX-5": "应税invoice"
};

/**
 * @description: 合同开票方式
 * @param {*}
 * @return {*}
 */
const BILLING_TYPE_MAP = {
  "QDKPFS-1": "全额开票",
  "QDKPFS-2": "净额开票"
};

/**
 * @description: 产品状态
 * @param {*}
 * @return {*}
 */
const PRODUCT_STATUS_MAP = {
  2: "待审核",
  3: "审核失败",
  4: "审核通过"
};

const PRODUCT_STATUS_MAP_COLOR = {
  2: "--global-color-warning",
  3: "--global-color-error",
  4: "--global-color-success"
};

// 客户分类
const CUSTOMER_TYPE_MAP = {
  0: "国内客户",
  1: "海外客户"
};

/**
 * @description: 合同审核状态(财务ID管理/合同变更审核)
 * @param {*}
 * @return {*}
 */
const CONTRACT_STATUS_MAP = {
  0: {
    label: "审核通过",
    color: "--global-color-success"
  },
  1: {
    label: "待审核",
    color: "--global-color-warning"
  },
  2: {
    label: "审核失败",
    color: "--global-color-error"
  }
};

// 数据权限
const DATA_AUTH_MAP = {
  MANAGER: "管理",
  VIEW: "查看"
};

// 数据权限
const POSITION_TYPE_MAP = {
  DM: "主管",
  GM: "经理",
  EMP: "员工"
};
const CREDIT_CONSUME_TYPE = {
  1: "账号充值",
  2: "还款"
};
// 渠道管理媒体关系

/**
 * @description: 合同状态和颜色
 * @param {*}
 * @return {*}
 */
const CONTRACT_STATE_MAP = {
  100000010: "未开始",
  100000020: "执行中",
  100000030: "已结束",
  100000000: "已终止"
};

// 合同 CEM 审核状态
const CONTRACT_VERIFY_STATE_MAP = {
  1: "草稿",
  2: "审核中",
  3: "审核通过"
};

const CONTRACT_STATE_MAP_COLOR = {
  100000010: "--global-color-table-default",
  100000020: "--global-color-primary",
  100000030: "--global-color-table-default",
  100000000: "--global-error"
};

// 返点设置状态
const REBEAT_STATUS_MAP = {
  NEW: "未提交",
  SUBMIT: "待审核",
  PASS: "审核通过",
  REJECT: "审核失败"
};

// 数据权限
const ACCOUNT_STATUS_MAP = {
  0: "正常",
  "-1": "禁止充值",
  "-2": "结束合作停用",
  "-3": "违规停用"
};

// google Division 客户类型
const DIVISION_ID_MAP = {
  1: "新客",
  2: "老客",
  3: "长尾新客",
  4: "纯新客",
  5: "转结新客",
  6: "激活非新客",
  7: "激活转结新客",
  8: "非新客",
};

// google parentIdStatus 客户类型
const DIVISION_PARENT = {
  1: "有效",
  0: "无效"
};

// 渠道转移状态 (无用)
const CHANNELTRANSFER_STATUS_MAP = {
  0: "转移中",
  1: "部分成功",
  2: "全部成功",
  3: "全部失败"
};

// 渠道转移单个账号状态(无用)
const CHANNELTRANSFERINFO_STATUS_MAP = {
  0: "转移中",
  "-1": "转移失败",
  1: "转移成功"
};

// 季度、月度类型(渠道返点)
const PERIOD_TYPE = {
  month: "月度暂估",
  quarter: "季度应收"
};

// 在职状态
const ONJOB_STATUS_MAP = {
  1: "在职",
  2: "离职"
};

// 用户职位
const USER_POSITION_MAP = {
  1: "部门主管",
  2: "部门成员",
  3: "主管助理"
};

// 权限类型
const SYSTEM_AUTH_TYPE = {
  1: "目录",
  2: "菜单",
  3: "按钮",
  4: "链接",
  5: "tab页签"
};

// 时间周期
const EFFECT_TIME_TYPE = {
  MONTHLY: "月度暂估",
  QUARTER: "季度应收",
  YEARLY: "年度应收"
};

export default {
  COMPANY_STATUS_MAP,
  BUSSINESSAD_BUSINESS_LINE,
  BUSSINESS_CUSTOMER_STATUS,
  RISK_CONTROL_STATUS,
  AD_TYPE_MAP,
  CURRENCCY_TYPE_MAP,
  USER_STATUS_MAP,
  USER_ROLE_MAP,
  BUSINESS_LINE_MAP,
  PRODUCT_STATUS_MAP,
  PRODUCT_STATUS_MAP_COLOR,
  CUSTOMER_TYPE_MAP,
  CONTRACT_STATUS_MAP,

  CONTRACT_VERIFY_STATE_MAP,
  CONTRACT_VERIFY_STATE_MAP_OPTIONS: $setObjectToArray(CONTRACT_VERIFY_STATE_MAP),

  DATA_AUTH_MAP,
  POSITION_TYPE_MAP,
  CREDIT_CONSUME_TYPE,
  CONTRACT_STATE_MAP,
  CONTRACT_STATE_MAP_COLOR,
  REBEAT_STATUS_MAP,
  BUSSINESSAD_TYPE_MAP,
  BUSSINESSAD_DEPT_MAP,
  BUSSINESSAD_DEPT_filed,
  GN_BUSSINESSAD_TYPE_MAP,
  ACCOUNT_STATUS_MAP,
  CHANNELTRANSFER_STATUS_MAP,
  CHANNELTRANSFERINFO_STATUS_MAP,
  PERIOD_TYPE,
  ONJOB_STATUS_MAP,
  USER_POSITION_MAP,
  SYSTEM_AUTH_TYPE,
  DIVISION_ID_MAP,
  DIVISION_PARENT,
  INVOICE_TYPE_MAP,
  BILLING_TYPE_MAP,

  EFFECT_TIME_TYPE,
  EFFECT_TIME_TYPE_OPTIONS: $setObjectToArray(EFFECT_TIME_TYPE)
};
