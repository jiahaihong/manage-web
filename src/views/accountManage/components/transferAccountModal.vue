<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-11-30 17:55:45
 * @LastEditors: Please set LastEditors
 * @Description: 转移账号
-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="600px"
      title="转移账号"
      append-to-body
      class="el_dialog"
      @open="OpenDialog"
      @close="CloseDialog"
    >
      <el-form
        :model="searchForm"
      >
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="">
              <el-input
                v-model="searchForm.accountId"
                placeholder="账号ID"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              :loading="isLoading"
              @click="handleSearch"
            >
              查询
            </el-button>
          </el-col>
          <el-col
            :span="12"
            align="right"
          >
            <el-button
              :loading="isExportLoading"
              @click="handleExport"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div
        v-loading="isLoading"
        class="global-module"
      >
        <el-table
          :data="listData.info"
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
          @size-change="getList(1)"
          @current-change="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  searchExchangeAccounts,
  exportExchangeAccounts
} from "@/api/account";

export default {
  props: {
    dialogData: Object,
    type: String
  },
  data() {
    return {
      visible: false,
      isLoading: false,
      isExportLoading: false,
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
    PlatFormCodeAllObj() { // 平台
      return this.$store.state.common.PlatFormAllList.reduce((tot, t) => {
        tot[t.mediaCode] = t.mediaName;
        return tot
      }, {})
    },
    tableColumn() {
      const _this = this
      const result = [
        {
          label: "媒体",
          prop: "mediaCode",
          width: 100,
          formatter: (row) => {
            return _this.PlatFormCodeAllObj[row.mediaCode] || row.mediaCode;
          }
        },
        {
          label: "账号ID",
          prop: "accountId"
        },
        {
          label: "账号名称",
          prop: "accountName"
        }
      ]
      return result
    },
  },
  methods: {
    // 打开前回调；初始化
    OpenDialog() {
      console.warn('OpenDialog', this.dialogData)
      this.handleSearch();
    },
    // 关闭时候回调
    CloseDialog() {
      Object.assign(this.$data, this.$options.data())
    },
    handleSearch() {
      this.searchParams = this.$deepcopy(this.searchForm)
      this.searchParams.transferId = this.dialogData.id
      this.getList();
    },
    async getList(page = 1) {
      try {
        this.isLoading = true
        this.listData.pageNo = page
        const params = {
          pageSize: this.listData.pageSize,
          pageNo: this.listData.pageNo,
          ...this.searchParams
        };
        const res = await searchExchangeAccounts(params)
        this.listData.info = res.data.dataList || [];
        this.listData.total = res.data.total;
      } catch (error) {
        console.warn(error);
        this.listData.info = [];
        this.listData.total = 0;
      }
      this.isLoading = false
    },
    // 导出
    async handleExport() {
      try {
        this.isExportLoading = true;
        const file = await exportExchangeAccounts(this.searchParams);
        this.$CreatDownload({
          file: file,
          FileName: `转移账号数据.xlsx`
        })
      } catch (error) {
        console.warn(error);
      }
      this.isExportLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
