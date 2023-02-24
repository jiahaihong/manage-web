<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-22 15:22:56
 * @LastEditors: Please set LastEditors
 * @Description: 账号 弹框
-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="800px"
      :title="pageConfig.title"
      append-to-body
      class="el_dialog"
      @open="OpenDialog"
      @close="CloseDialog"
    >
      <el-form
        class=" flex "
        :model="searchForm"
      >
        <el-row type="flex">
          <el-col :span="10">
            <el-form-item label="">
              <el-input
                v-model="searchForm.accountId"
                placeholder="账号ID"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col
            :span="2"
            class="ml-5"
          >
            <el-button
              icon="el-icon-search"
              type="primary"
              plain
              @click="handleSearch"
            >
              查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="global-module">
        <el-table
          :data="listData.info"
          class="table-fixed"
          border
          size="small"
        >
          <template v-for="(col) in tableColumn">
            <el-table-column
              :key="col.prop"
              :fixed="col.fixed"
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
          @size-change="getList(1, $event)"
          @current-change="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getModifyStatusByBatchNo,
  getModifyOperatingTypeLogAccountList,
  getModifyAdTypeLogAccountList,
  getModifyBcLogAccountList,
  getModifyDomainLogAccountList
} from "@/api/account";

// 全部配置
const configAll = {
  // (修改账号状态 弹框里使用)
  EditAccount: {
    title: '修改账号',
    fn: getModifyStatusByBatchNo,
  },
  // (标记运行类型 使用)
  markAccount: {
    title: '标记账号',
    fn: getModifyOperatingTypeLogAccountList
  },
  // (更新广告类型 使用)
  modifyAccountAdType: {
    title: '查看账号',
    fn: getModifyAdTypeLogAccountList
  },
  // (更新广告类型 使用)
  modifyAccountBc: {
    title: '查看账号',
    fn: getModifyBcLogAccountList
  },
  // (广点通 更新K框 使用)
  modifyAccountDomain: {
    title: '查看账号',
    fn: getModifyDomainLogAccountList
  },
}

export default {
  inject: ['operatingTypeAll'],
  props: {
    modalData: Object,
    type: String
  },
  data() {
    return {
      visible: false,
      searchForm: {
        accountId: ''
      },
      searchParams: {},
      listData: {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
    };
  },
  computed: {
    pageConfig() {
      return configAll[this.type] || configAll.EditAccount
    },
    tableColumn() {
      const _this = this
      const result = [
        {
          label: "账号ID",
          prop: "accountId"
        },
        {
          visible: ['EditAccount'].includes(_this.type),
          label: "修改后状态",
          prop: "newStatus",
          formatter: (row) => {
            return _this.$enum.ACCOUNT_STATUS_MAP[row.newStatus + '']
          }
        },
        {
          visible: ['markAccount'].includes(_this.type),
          label: "标记后类型",
          prop: "newOperatingTypeStatus",
          formatter: (row) => {
            return _this.operatingTypeAll[row.newOperatingTypeStatus] || ''
          }
        },
        {
          visible: ['modifyAccountAdType'].includes(_this.type),
          label: "广告类型",
          prop: "newAdType"
        },
        {
          visible: ['modifyAccountBc'].includes(_this.type),
          label: "bc",
          prop: "newBc"
        },
        {
          visible: ['modifyAccountDomain'].includes(_this.type),
          label: "新K框",
          prop: "newDomain"
        }
      ]
      return result.filter(b => typeof b.visible === 'boolean' ? b.visible : true)
    },
  },
  methods: {
    // 打开前回调；初始化
    OpenDialog() {
      console.warn('OpenDialog', this.$route.name, this.modalData)
      this.handleSearch();
    },
    // 关闭时候回调
    CloseDialog() {
      this.listData = {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
      this.searchForm = {
        accountId: ''
      };
    },
    handleSearch() {
      this.searchParams = this.$deepcopy(this.searchForm)
      this.getList();
    },
    async getList(page = 1) {
      try {
        console.warn(this.modalData, this.modalData.id)

        this.listData.pageNo = page
        const params = {
          mediaCode: this.$route.name,
          pageSize: this.listData.pageSize,
          pageNo: this.listData.pageNo,
          accountId: this.searchParams.accountId,
          batchNo: this.modalData.batchNo,
        };
        const res = await this.pageConfig.fn(params)
        this.listData.info = res.data.dataList || [];
        this.listData.total = res.data.total;
      } catch (error) {
        this.listData.info = [];
        this.listData.total = 0;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
  .table-paddings{
    padding: 0
  }
</style>
