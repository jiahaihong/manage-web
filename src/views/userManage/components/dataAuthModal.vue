<!-- 数据权限-->
<template>
  <div class="data-auth-modal-wrap">
    <el-dialog
      title="数据权限"
      :visible.sync="visible"
      width="900px"
      custom-class="data-auth-modal-dialog"
      :close-on-click-modal="false"
      @open="openDialog"
      @close="closeDialog"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="账号权限"
          name="1"
        >
          <div class="global-search">
            <el-select
              v-model="filterOptions.type"
              style="width:120px"
              size="small"
              @change="handleSearch"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div style="display:flex;">
              <el-input
                v-model.trim="filterOptions.content"
                placeholder="请输入账号ID/名称"
                style="width:250px"
                size="small"
              />
              <el-button
                icon="el-icon-search"
                type="primary"
                plain
                style="margin-left: 10px;"
                size="small"
                @click="handleSearch"
              >
                查询
              </el-button>
            </div>
          </div>
          <div class="global-module">
            <el-table
              :data="listData.info"
              style="width: 100%"
              border
              size="small"
            >
              <el-table-column
                v-for="(col, index) in tableCol"
                :key="index"
                :prop="col.prop"
                :label="col.label"
                :formatter="col.formatter"
                :width="col.width"
              />
            </el-table>
            <el-pagination
              :total="listData.total"
              :page-sizes="[10, 20, 30, 40]"
              :current-page="listData.pageNo"
              :page-size="listData.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import {} from "@/api/user";

export default {
  props: {
    dialogData: Object
  },
  data() {
    return {
      visible: false,
      activeName: "1",
      filterOptions: {
        type: 1,
        content: ""
      },
      typeOptions: [
        {
          label: "Facebook",
          value: 1
        },
        {
          label: "Google",
          value: 2
        },
        {
          label: "巨量引擎",
          value: 3
        }
      ],
      listData: {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
    };
  },
  computed: {
    tableCol() {
      return Object.freeze([
        {
          label: "账号ID",
          prop: "accountId"
        },
        {
          label: "账号名称",
          prop: "accountName"
        },
        {
          label: "币种",
          prop: "currency"
        },
        {
          label: "时区",
          prop: "timeZone"
        },
        {
          label: "账号余额",
          prop: "balance"
        }
      ])
    }
  },
  methods: {
    openDialog() {
      this.getList(1);
    },
    closeDialog() {},
    handleSearch() {
      this.searchFlag = true;
      this.getList();
    },
    getList(page = 1) {
      const { pageSize } = this.listData;
      const { type, content } = this.filterOptions;
      const params = {
        pageSize,
        pageNo: page,
        type
      };
      if (this.searchFlag) {
        params["accountId"] = content;
      }

      const res = {
        code: 200,
        msg: "成功",
        data: {
          pageNo: 1,
          pageSize: 10,
          offSet: 0,
          totalCount: 2,
          totalPage: 1,
          first: true,
          last: false,
          next: true,
          previous: false,
          dataList: [
            {
              accountId: "12345678",
              accountName: "efgfgfgfg",
              currency: "USD",
              timeZone: "(GMT+08:00)Asia/Hong_Kong",
              role: "ROLE_SUPER_ADMIN",
              balance: "91500.22"
            },
            {
              accountId: "123456789",
              accountName: "efgfgfgfg",
              currency: "USD",
              timeZone: "(GMT+08:00)Asia/Hong_Kong",
              role: "ROLE_SUPER_ADMIN",
              balance: "91500.22"
            }
          ]
        }
      };

      // logList(params).then(res => {
      this.listData.info = res.data.dataList;
      this.listData.total = res.data.totalCount;
      // });
    },
    handleSizeChange(val) {
      this.listData.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.getList(val);
    }
  }
};
</script>
<style lang="scss">
.data-auth-modal-dialog {
  .el-dialog__body {
    padding: 0 20px 30px;
  }
}
</style>
<style lang="scss" scoped>
.data-auth-modal-wrap {
  .global-search {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
  .global-module {
    padding: 0;
  }
}
</style>
