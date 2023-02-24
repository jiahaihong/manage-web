<!--
 * @Author: your name
 * @Date: 2022-11-29 15:46:11
 * @LastEditTime: 2023-01-06 10:18:24
 * @LastEditors: Please set LastEditors
 * @Description: 账号转移
-->
<template>
  <div class="transferAdvertiserList">
    <div class="global-search">
      <el-form
        class=" flex "
        :model="searchForm"
      >
        <el-row
          type="flex"
          :gutter="5"
        >
          <el-col :span="8">
            <el-form-item label="">
              <el-autocomplete
                v-model.trim="searchForm.content"
                style="width:100%"
                placeholder="请输入内容"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm.type"
                  style="width:160px"
                  placeholder="请选择"
                  @change="searchForm.content = ''"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <template slot-scope="{ item }">
                  <span>{{ item.label }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="searchForm.auditStatus"
              placeholder="请选择账号状态"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in auditStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              @click="handleSearch"
            >
              查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row class="global-button-group">
      <el-col :span="16">
        <el-button
          v-if="permissionButtons.includes('applyTransfer')"
          size="small"
          type="primary"
          @click="openTransfer()"
        >
          申请转移
        </el-button>
      </el-col>
    </el-row>

    <!-- 转移表格 -->
    <div class="transferTable global-module">
      <div v-loading="isLoading">
        <el-table
          ref="multipleTable"
          :data="listData.tableData"
          style="width: 100%"
          border
          @selection-change="onSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <template v-for="(col) in tableColumn">
            <el-table-column
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :width="col.width"
              :fixed="col.fixed"
              :min-width="col['min-width']"
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

      <!-- 查看 转移账号 -->
      <transferAccountModal
        ref="transferAccountModal"
        :dialog-data="dialogData"
      />

      <!-- 账号转移财务ID -->
      <transferAdvertiserModal
        ref="transferAdvertiserModal"
        @submit="handleSearch()"
      />
    </div>
  </div>
</template>

<script>
import {
  searchExchangeAdvertisers,
  getOaUrlByApplyCode
} from "@/api/account";
import transferAccountModal from "./components/transferAccountModal";
import transferAdvertiserModal from "./components/transferAdvertiserModal";

const auditStatusColor = Object.freeze({
  10: {
    label: '待审核',
    color: '#E6A23C',
    value: 10
  },
  20: {
    label: '审核通过',
    color: '#67C23A',
    value: 20
  },
  30: {
    label: '审核失败',
    color: '#F56C6C',
    value: 30
  },
})

export default {
  components: { transferAdvertiserModal, transferAccountModal },
  data() {
    return {
      isLoading: false,
      searchForm: {
        type: 'advertiserIdOut',
        content: '',
        auditStatus: '',
      },
      searchParams: {},
      typeOptions: Object.freeze([
        { label: "转出财务ID/主体", value: "advertiserIdOut" },
        { label: "转入财务ID/主体", value: "advertiserIdIn" }
      ]),
      multipleSelection: [],
      listData: { // 表格和分页器
        tableData: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
      dialogData: {}
    };
  },
  computed: {
    permissionButtons() {
      return this.$route.meta.permissionButtons || []
    },
    auditStatusOptions() {
      return Object.keys(auditStatusColor).map(t => ({ ...auditStatusColor[t] }))
    },
    tableColumn() {
      const _this = this
      return [
        {
          label: "OA审批单号",
          prop: "applyCode",
          width: 160,
          formatter: (row) => {
            return (
              <el-button
                on-click={() => _this.openOa(row)}
                type="text"
                class="global-a"
              >
                {row.applyCode}
              </el-button>
            )
          }
        },
        {
          label: "转出财务ID",
          prop: "advertiserIdOut",
          'min-width': 160,
          formatter: (row) => {
            return row.advertiserIdOut + '-' + (row.advertiserOutName || '')
          }
        },
        {
          label: "转入财务ID",
          prop: "advertiserIdIn",
          'min-width': 160,
          formatter: (row) => {
            return row.advertiserIdIn + '-' + (row.advertiserInName || '')
          }
        },
        {
          label: "转移账号",
          prop: "rebate",
          width: 100,
          formatter: (row) => {
            return (
              <el-button
                on-click={() => _this.openAccountModal(row)}
                size="small"
                type="primary"
              >
              查看
              </el-button>
            )
          }
        },
        {
          label: "转移说明",
          prop: 'transferDescription',
          width: 200,
        },
        {
          label: "审核状态",
          prop: "auditStatus",
          width: 120,
          formatter: (row, col, val) => {
            const obj = auditStatusColor[row.auditStatus] || {}
            const sizeStyle = {
              marginRight: '3px',
              color: obj.color || '#000'
            }
            return (<span style={sizeStyle}>{row.auditStatusDesc}</span>)
          }
        },
        {
          label: "提交人",
          prop: 'creator',
          width: 200,
        },
        {
          label: "提交时间",
          prop: "createTime",
          width: 150,
        },
        {
          label: "凭证",
          prop: "opration",
          fixed: 'right',
          width: 80,
          formatter: (row) => {
            return (
              <el-button
                size="small"
                type="primary"
                disabled={!row.filePath}
                on-click={() => _this.downloadFile(row)}
              >
                下载
              </el-button>
            )
          }
        },
      ]
    }
  },
  mounted() {
    this.handleSearch()
  },
  // 方法集合
  methods: {
    // 翻页
    handleSearch() {
      this.searchParams = this.$deepcopy(this.searchForm, 'JSON');
      this.getList(1);
    },
    // 多选
    onSelectionChange(selectRow) {
      this.multipleSelection = selectRow;
    },
    // 查询列表
    async getList(pageNo = 1) {
      try {
        this.listData.pageNo = pageNo
        const params = {
          pageNo: this.listData.pageNo,
          pageSize: this.listData.pageSize,
        }
        const { type, content, auditStatus } = this.searchParams
        if (!this.$isEmpty(type) && !this.$isEmpty(content)) {
          params[type] = content
        }

        if (!this.$isEmpty(auditStatus)) {
          params.auditStatus = auditStatus
        }
        this.isLoading = true
        const res = await searchExchangeAdvertisers(params)
        if (res.data && Array.isArray(res.data.dataList)) {
          this.listData.tableData = res.data.dataList
          this.listData.total = res.data.total;
        } else {
          this.listData.tableData = []
          this.listData.total = 0
        }
      } catch (error) {
        this.listData.tableData = []
        this.listData.total = 0
        console.warn(error)
      }
      this.isLoading = false
    },
    // 查看转移账号
    openAccountModal(row) {
      console.log('查看转移账号', row)
      this.dialogData = row;
      this.$refs.transferAccountModal.visible = true;
    },
    // 下载
    downloadFile(row) {
      window.location.href = row.filePath;
    },
    // 财务ID转移
    openTransfer() {
      this.$refs["transferAdvertiserModal"].visible = true;
    },
    // 跳转OA
    async openOa(row) {
      if (this.$isEmpty(row.applyCode)) {
        this.$message({
          type: "warning",
          message: "未发现OA参数",
        });
        return;
      }
      try {
        const res = await getOaUrlByApplyCode({ applyCode: row.applyCode });
        window.open(res.data, '_blank');
      } catch (error) {
        console.warn(error)
      }
    }
  },
}
</script>
