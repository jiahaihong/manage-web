<!-- 变更记录 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="700px"
      title="转移账号"
      class="el_dialog"
      @open="OpenDialog"
      @closed="ClosedDialog"
    >
      <el-tabs
        v-model="currentTab"
        @tab-click="tabsClick"
      >
        <el-tab-pane
          v-if="isStatusRecord"
          label="状态修改记录"
          name="1"
        />
        <el-tab-pane
          label="财务ID转移记录"
          name="2"
        />
        <el-tab-pane
          v-if="isGoogle"
          label="渠道转移记录"
          name="3"
        />
        <el-tab-pane
          label="账号名称修改记录"
          name="4"
        />
        <el-tab-pane
          v-if="isGoogle"
          label="更新Division Parent变更记录"
          name="5"
        />
      </el-tabs>
      <div style="padding: 0 10px">
        <el-row
          v-if="currentTab === '3' && isGoogle"
          class="mb-15"
        >
          <el-col :span="24">
            <el-radio-group
              v-model="channelType"
              size="mini"
              @change="getList(1)"
            >
              <el-radio-button label="record">
                转移记录
              </el-radio-button>
              <el-radio-button label="history">
                绑定历史
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-table
          :data="listData.info"
          style="width: 100%"
          class="table-fixed"
          border
          size="small"
        >
          <template v-for="(col) in tableColumn">
            <el-table-column
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :width="col.width"
            />
          </template>
        </el-table>
        <el-pagination
          :total="listData.total"
          :page-sizes="[10, 20, 30, 40]"
          :current-page="listData.pageNo"
          :page-size.sync="listData.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          @size-change="getList(1)"
          @current-change="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getStatusLogByAccount,
  getChangeChannelLog, getAccountBindChannelHistory,
  searchExchangeAccountLogs,
  getModifyNameLog,
  getUpdateDivisionIdLog
} from "@/api/account";

export default {
  props: {
    modalData: Object
  },
  data() {
    return {
      visible: false,
      statusOptions: Object.keys(this.$enum.ACCOUNT_STATUS_MAP).map((i) => {
        return { value: i, label: this.$enum.ACCOUNT_STATUS_MAP[i] };
      }),
      channelType: 'record',
      listData: {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      currentTab: '',
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
    isStatusRecord() {
      return ['FBK', 'GGL', 'JTT', 'TTK'].includes(this.routeName)
    },
    isGoogle() {
      return this.routeName === 'GGL'
    },
    tableColumn() {
      const _this = this
      const { DIVISION_ID_MAP, DIVISION_PARENT } = _this.$enum
      const result = [
        // 状态修改记录
        {
          visible: _this.currentTab === '1',
          label: "修改后状态",
          prop: "newStatus",
          formatter: (row) => {
            return _this.$enum.ACCOUNT_STATUS_MAP[row.newStatus + '']
          }
        },
        {
          visible: _this.currentTab === '1',
          label: "修改时间",
          prop: "createTime"
        },
        {
          visible: _this.currentTab === '1',
          label: "操作人",
          prop: "updateUser"
        },
        // 财务ID转移记录
        {
          visible: _this.currentTab === '2',
          label: "转入财务ID",
          prop: "advertiserIdIn",
          formatter: (row) => {
            return row.advertiserIdIn + (row.advertiserInName ? ('-' + row.advertiserInName) : '')
          }
        },
        {
          visible: _this.currentTab === '2',
          label: "转入时间",
          prop: "createTime",
          formatter: (row) => {
            return row.createTime || row.auditTime
          }
        },
        {
          visible: _this.currentTab === '2',
          label: "操作人",
          prop: "updateUser",
          formatter: (row) => {
            return row.creator || row.updateUser
          }
        },
        // 渠道转移记录google
        {
          visible: _this.currentTab === '3' && _this.channelType === 'record',
          label: "转入渠道",
          prop: "inChannelCode"
        },
        {
          visible: _this.currentTab === '3' && _this.channelType === 'record',
          label: "转入付款主体",
          prop: "inPaymentName"
        },
        {
          visible: _this.currentTab === '3' && _this.channelType === 'record',
          label: "转入时间",
          prop: "updateTime"
        },
        {
          visible: _this.currentTab === '3' && _this.channelType === 'record',
          label: "操作人",
          prop: "updateUser"
        },
        // 渠道绑定历史 GGL
        {
          visible: _this.currentTab === '3' && _this.channelType === 'history',
          label: "渠道",
          prop: "channelName"
        },
        {
          visible: _this.currentTab === '3' && _this.channelType === 'history',
          label: "绑定时间",
          prop: "startTime"
        },
        {
          visible: _this.currentTab === '3' && _this.channelType === 'history',
          label: "解绑时间",
          prop: "untiedTime"
        },
        // 账号名称修改记录
        {
          visible: _this.currentTab === '4',
          label: "修改前名称",
          prop: "oldName"
        },
        {
          visible: _this.currentTab === '4',
          label: "修改后名称",
          prop: "newName"
        },
        {
          visible: _this.currentTab === '4',
          label: "修改时间",
          prop: "createTime"
        },
        {
          visible: _this.currentTab === '4',
          label: "操作人",
          prop: "updateUser"
        },

        {
          visible: _this.currentTab === '5',
          label: "渠道",
          prop: "channelCode"
        },
        {
          visible: _this.currentTab === '5',
          label: "变更后Parent状态",
          prop: "afterParentIdStatus",
          formatter: (row) => {
            return DIVISION_PARENT[row.afterParentIdStatus] || ''
          }
        },
        {
          visible: _this.currentTab === '5',
          label: "变更后新老客",
          prop: "afterType",
          formatter: (row) => {
            return DIVISION_ID_MAP[row.afterType] || ''
          }
        },
        {
          visible: _this.currentTab === '5',
          label: "变更时间",
          prop: "updateTime"
        },
        {
          visible: _this.currentTab === '5',
          label: "操作人",
          prop: "updateUser"
        },
      ]
      /* eslint-disable */
      return result.filter(t => t.hasOwnProperty('visible') ? t.visible : true)
    }
  },
  methods: {
    // 打开前回调
    OpenDialog() {
      if (this.isStatusRecord) {
        this.currentTab = '1'
      } else {
        this.currentTab = '2'
      }
      this.getList(1);
    },
    ClosedDialog() {
      this.listData = {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
      this.channelType = 'record'
    },
    tabsClick(obj) {
      this.currentTab = obj.name;
      this.listData = {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
      this.getList(1)
    },
    async getList(pageNo = 1) {
      try {
        const params = {
          pageSize: this.listData.pageSize,
          pageNo: pageNo,
          accountId: this.modalData.accountId,
          mediaCode: this.$route.name,
        };
        let res
        
        if (this.currentTab == '1') { // 状态修改记录
          res = await getStatusLogByAccount(params)
        } else if (this.currentTab == '2') { // 财务ID转移记录
          res = await searchExchangeAccountLogs(params)
        } else if (this.currentTab == '3') { // 渠道转移记录
          if (this.channelType === 'record') {
            // 转移记录
            res = await getChangeChannelLog(params)
          } else {
            // 绑定历史
            res = await getAccountBindChannelHistory(params)
          }
        } else if (this.currentTab == '4') { // 账号名称修改记录
          res = await getModifyNameLog(params)
        }  else if (this.currentTab == '5') { // 更新Division Parent变更记录
          res = await getUpdateDivisionIdLog(params)
        } 
  
        this.listData.info = res.data.dataList || [];
        this.listData.total = res.data.total;
        
      } catch (error) {
        this.listData.info = [];
        this.listData.total = 0;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
