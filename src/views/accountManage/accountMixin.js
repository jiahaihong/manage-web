import { exportAccount, getMediaAccountStatus } from "@/api/account";

import BindModal from "./common/BindModal";
import modifyAccountStatusModal from "./common/modifyAccountStatusModal";
import changeRecordModal from "./common/changeRecordModal";
import updateDivisionModal from "./common/updateDivisionModal";
import updateParentIdModal from "./common/updateParentIdModal";
import modifyAccountDialog from "./common/modifyAccountDialog";
import markAccountDialog from "./common/markAccountDialog";
import importAccountModal from "./common/importAccountModal";
import modifyAccountAdType from "./common/modifyAccountAdType";
import modifyAccountBc from "./common/modifyAccountBc";
import modifyAccountDomain from "./common/modifyAccountDomain";
// eslint-disable-next-line
import ca from "element-ui/src/locale/lang/ca";

// 运营类型枚举 (国内媒体)
const operatingTypeAll = Object.freeze({
  1: "客户运营",
  2: "服务费运营",
  3: "ym运营",
  4: "收量运营"
});

const operatingTypeOptions = Object.keys(operatingTypeAll).map(i => ({
  value: i,
  label: operatingTypeAll[i]
}));

// Parent客户类型
const parentQuarterDtosDOM = {
  props: { parentQuarterDtos: Array },
  data() {
    return {
      visible: false
    };
  },
  render(h) {
    const { DIVISION_ID_MAP } = this.$enum;
    const setParentType = (row) => DIVISION_ID_MAP[row.parentType]
    const setParentLevel = (row) => row.activationCustomerLevel ? `S${row.activationCustomerLevel}` : ''
    const data = this.visible ? this.parentQuarterDtos : []
    return (
      <div>
        <div>根据消耗等级规则判断</div>
        <el-popover
          v-model={this.visible}
          placement="left"
          width="800"
          appendToBody={false}
          trigger="click"
        >
          <div class="table-wrap">
            <el-table
              data={data}
              border
              size="small"
            >
              <el-table-column prop="parentQuarter" label="季度" />
              <el-table-column prop="activationCustomerLevel" formatter={setParentLevel} label="消耗等级" />
              <el-table-column prop="parentType" formatter={setParentType} label="新客类型" />
            </el-table>
          </div>
          <el-button
            slot="reference"
            ref="buttonssss"
            type="text"
            size="mini"
          >
            查看
          </el-button>
        </el-popover>
      </div>
    )
  }
};

export default {
  name: "accountMixin",
  provide() {
    return { operatingTypeAll, operatingTypeOptions };
  },
  components: {
    BindModal,
    modifyAccountStatusModal,
    changeRecordModal,
    updateDivisionModal,
    modifyAccountDialog,
    importAccountModal,
    markAccountDialog,
    modifyAccountAdType,
    modifyAccountBc,
    updateParentIdModal,
    parentQuarterDtosDOM,
    modifyAccountDomain
  },
  data() {
    return {
      isLoading: false,
      isExportLoading: false,
      operatingTypeOptions,
      // 账号状态下拉框
      statusList: Object.keys(this.$enum.ACCOUNT_STATUS_MAP).map(item => {
        return { value: item, label: this.$enum.ACCOUNT_STATUS_MAP[item] };
      }),
      // 弹框需要的数据
      modalData: {},
      dialogData: {},
      accountStatusList: []
    };
  },
  computed: {
    permissionButtons() {
      return this.$route.meta.permissionButtons || [];
    },
    tableColumn() {
      const _this = this;
      const { DIVISION_ID_MAP, DIVISION_PARENT } = _this.$enum;
      const result = [
        {
          label: "账号ID",
          prop: "accountId",
          width: 150
        },
        {
          label: "账号名称",
          prop: "name",
          width: 240
        },
        {
          route: ["GDT"].includes(_this.routeName),
          label: "K框",
          prop: "domain",
          width: 100
        },
        {
          route: ["KSS"].includes(_this.routeName),
          label: "账户类型",
          prop: "accountType",
          width: 80
        },
        {
          route: ["KSS", "JTT"].includes(_this.routeName),
          label: "账号行业",
          prop: "secondIndustryName",
          width: 80,
          formatter: row => {
            return [row.firstIndustryName, row.secondIndustryName].filter(t => t).join(">");
          }
        },
        {
          route: ["TTK", "JTT"].includes(_this.routeName), // 只有在tiktok页面显示
          label: "广告类型",
          prop: "adType",
          width: 80
        },
        {
          route: _this.permissionButtons.includes("modifyAccountOperating"),
          label: "运营类型",
          prop: "operatingType",
          width: 100,
          formatter: row => {
            return operatingTypeAll[row.operatingType] || "";
          }
        },
        {
          label: "币种",
          prop: "currency"
        },
        {
          route: ["FBK", "GGL", "JTT", "KSS"].includes(_this.routeName),
          label: "余额",
          prop: "balance",
          width: 200,
          formatter: row => {
            const balance = row.balance === -1 ? "无限额" : row.balance;
            return (
              <div>
                <p>余额： {balance}</p>
                <p>更新时间： {row.balanceTime}</p>
              </div>
            );
          }
        },
        {
          label: "账号状态",
          prop: "status",
          width: 70,
          formatter: row => {
            return _this.$enum.ACCOUNT_STATUS_MAP[row.status + ""];
          }
        },
        {
          route: ["FBK", "JTT", "TTK", "KSS", "BIN", "QCC"].includes(_this.routeName),
          label: "媒体平台账号状态",
          prop: "accountStatusDesc",
          width: 120,
          formatter: row => {
            if (["KSS"].includes(_this.routeName)) {
              return row.accountStatus;
            }
            return row.accountStatusDesc;
          }
        },
        {
          route: ["FBK", "JTT", "KSS", "BIN", "QCC"].includes(_this.routeName),
          label: "开户主体",
          prop: "company",
          width: 150
        },
        {
          label: "渠道",
          prop: "channelId",
          width: 150,
          formatter: row => {
            return [row.channelId, row.channelName].filter(t => t).join(" - ");
          }
        },
        {
          label: "渠道简称",
          prop: "channelAbbName",
          width: 100
        },
        {
          route: ["FBK"].includes(_this.routeName),
          label: "BM",
          prop: "bmDtoList",
          width: 150,
          formatter: row => {
            if (_this.$isEmpty(row.bmDtoList)) {
              return "";
            }
            const bmDtoList = row.bmDtoList.map(item => {
              const is = item.bmId && item.bmName ? "-" : "";
              return (
                <p>
                  {item.bmId}
                  {is}
                  {item.bmName}
                </p>
              );
            });
            return <div>{bmDtoList}</div>;
          }
        },
        {
          route: ["GGL"].includes(_this.routeName),
          "render-header": row => {
            return (
              <span>
                Division/Parent信息
                <el-tooltip placement="top">
                  <div slot="content">
                    以下数据依次为：渠道编码 - division ID - division name - parent ID - parent name - parent状态 -
                    新老客状态；
                    <br />
                    结算中心会根据此关系计算暂估账单seach75000部分返点和新客返点。
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
              </span>
            );
          },
          prop: "divisionChannelTypeDtos",
          width: 200,
          formatter: row => {
            if (_this.$isEmpty(row.divisionChannelTypeDtos)) {
              return "";
            }
            return row.divisionChannelTypeDtos.map(t => {
              const guests = DIVISION_ID_MAP[t.type] || "";
              const parentIdStatus = DIVISION_PARENT[t.parentIdStatus] || "";
              const a = [t.channelCode, t.divisionId, t.divisionName, t.parentId, t.parentName, parentIdStatus, guests]
                .map(t => t || "无数据")
                .join(" - ");
              return <div>{a}</div>;
            });
          }
        },
        {
          route: ["GGL"].includes(_this.routeName),
          label: "MCC(子<父)",
          prop: "MCC",
          width: 170,
          formatter: row => {
            if (_this.$isEmpty(row.mccDtoList)) {
              return "";
            }
            const mccDtoList = row.mccDtoList
              .map(item => {
                return item.mccId;
              })
              .join("<");
            return mccDtoList;
          }
        },
        {
          route: ["GGL"].includes(_this.routeName),
          label: "Parent客户类型",
          prop: "parentQuarterDtos",
          width: 170,
          formatter: row => {
            if (_this.$isEmpty(row.parentQuarterDtos)) {
              return "";
            }
            return <parentQuarterDtosDOM parentQuarterDtos={row.parentQuarterDtos} />
          }
        },
        {
          route: ["TTK"].includes(_this.routeName),
          label: "bc",
          prop: "bc",
          width: 90
        },
        {
          label: "财务ID",
          prop: "advertiserId",
          width: 90
        },
        {
          label: "客户主体",
          prop: "advertiserName",
          width: 240
        },
        {
          label: "财务ID运营人",
          prop: "operatorNames",
          width: 240,
          formatter: row => {
            if (row.operatorNames) {
              const opNames = row.operatorNames.map(e => {
                return (
                  <div>
                    <div>{e}</div>
                  </div>
                );
              });
              return opNames;
            } else {
              return "";
            }
          }
        },
        {
          label: "客户ID",
          prop: "customerCode",
          width: 90
        },
        {
          label: "客户名称",
          prop: "customerName",
          width: 240
        },
        {
          label: "操作",
          prop: "rebate",
          width: 200,
          fixed: "right",
          formatter: row => {
            const record = (
              <el-button on-click={() => _this.openChangeRecord(row)} size="small" type="primary">
                变更记录
              </el-button>
            );

            const modifyAccount = (
              <el-button
                on-click={() => {
                  _this.dialogData = row;
                  _this.$refs.modifyAccountDialog.isVisible = true;
                }}
                size="small"
                type="primary">
                修改名称
              </el-button>
            );
            return (
              <div>
                {_this.permissionButtons.includes("changeLog") ? record : ""}
                {_this.permissionButtons.includes("modifyAccountName") ? modifyAccount : ""}
              </div>
            );
          }
        }
      ];
      return result.filter(b => {
        if (typeof b.route === "boolean") {
          return b.route;
        }
        return true;
      });
    },
    routeName: function() {
      return this.$route.name;
    },
    mediaData() {
      // 平台
      const result = this.$store.state.common.PlatFormAllList.find(item => item.mediaCode === this.$route.name);
      return result || {};
    },
    options() {
      const AllOptions = [
        { label: "账号ID/名称", value: "accountId" },
        { label: "开户主体", value: "company", routeName: ["FBK", "JTT", "KSS", "BIN", "QCC"] },
        { label: "BM ID", value: "bmId", routeName: ["FBK"] },
        { label: "MCC ID", value: "manageId", routeName: ["GGL"] },
        { label: "客户编码/名称", value: "customerCodeOrName" },
        { label: "财务ID/主体", value: "advertiserIdOrName" },
        { label: "渠道编码/名称", value: "channelName" },
        { label: "渠道简称", value: "channelAbbName" },
        { label: "bc", value: "bc", routeName: ["TTK"] },
        { label: "财务ID运营人", value: "operatorName" }
      ];
      return AllOptions.filter(item => {
        if (Reflect.has(item, "routeName")) {
          return item.routeName.includes(this.routeName);
        } else {
          return true;
        }
      });
    }
  },
  created() {
    this.getMediaAccountStatus();
  },
  methods: {
    // 关联新账号
    openRelation() {
      this.$refs["BindModal"].visible = true;
    },
    // 修改账号状态
    openEditAccountStatus() {
      this.$refs["modifyAccountStatusModal"].visible = true;
    },
    // 打开标记运营类型
    openMarkAccountDialog() {
      this.$refs["markAccountDialog"].visible = true;
    },
    // 查看变更记录
    openChangeRecord(row) {
      this.modalData = row;
      this.$refs["changeRecordModal"].visible = true;
    },
    // 更新DivisionId
    openUpdateDicisionId() {
      this.$refs["updateDivisionModal"].visible = true;
    },
    // 更新ParentId
    openUpdateParentId() {
      this.$refs["updateParentIdModal"].visible = true;
    },
    // 更新广告类型
    openUpdateAdvDialog() {
      this.$refs["modifyAccountAdType"].visible = true;
    },
    // 更新广告类型
    openAccountBcType() {
      this.$refs["modifyAccountBc"].visible = true;
    },
    // 更新K框
    openAccountDomain() {
      this.$refs["modifyAccountDomain"].visible = true;
    },
    // 导入文件
    handleOnSelectFile() {
      this.$refs.importAccountModal.isVisible = true;
    },
    // 导出
    async handleExport() {
      try {
        // eslint-disable-next-line
        let { type, content, status, ...last } = this.searchParams;
        const params = {
          mediaCode: this.$route.name,
          ...last
        };
        if (type && content) {
          if (type === "bmId") {
            const ck = Number(content);
            if (Number.isNaN(ck)) {
              this.$message.error("BM ID必须是数字类型");
              return;
            } else {
              content = Number(content);
            }
          }
          params[type] = content;
        }
        if (status) {
          params.status = status;
        }
        this.isExportLoading = true;
        await exportAccount(params);
        this.$message.success("数据下载任务提交成功，请稍后到云下载中心下载数据");
        this.$store.dispatch("common/getDOWNLOAD_FILES");
      } catch (error) {
        console.warn(error);
      }
      this.isExportLoading = false;
    },
    async getMediaAccountStatus() {
      const res = await getMediaAccountStatus({ platform: this.mediaData.id });
      this.accountStatusList = res.data;
    }
  }
};
