<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-06-30 10:39:30
 * @LastEditors: Please set LastEditors
 * @Description: 日志
-->
<template>
  <div class="app-container">
    <div class="global-search mb-20">
      <el-date-picker
        v-model="searchForm.date"
        clearable
        style="width:380px"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-input
        v-model="searchForm.loginName"
        class="ml-5"
        style="width:200px"
        clearable
        placeholder="请输入操作人"
      />
      <el-input
        v-model="searchForm.description"
        class="ml-5"
        style="width:200px"
        clearable
        placeholder="请输入操作名称"
      />
      <el-button
        class="ml-5"
        icon="el-icon-search"
        type="primary"
        plain
        :loading="isLoading"
        @click="handleSearchInfo()"
      >
        查询
      </el-button>
    </div>
    <div class="global-module">
      <el-table
        v-loading="isLoading"
        :data="listData.listInfo"
        border
        fit
        highlight-current-row
        class="el-table-container"
      >
        <template v-for="(col) in tableCol">
          <el-table-column
            :key="col.prop"
            align="center"
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
        :current-page="listData.pageNum"
        :page-size.sync="listData.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        @size-change="getList(1)"
        @current-change="getList($event)"
      />
    </div>
    <el-dialog
      title="入参详情"
      width="600px"
      :visible.sync="isShow"
    >
      <pre>{{ paramsTemp }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import { getLogInfos } from '@/api/system'

export default {
  data() {
    return {
      isLoading: false,
      searchParams: {},
      searchForm: {
        date: [],
        loginName: '',
        description: ''
      },
      listData: {
        listInfo: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      isShow: false,
      paramsTemp: ''
    }
  },
  computed: {
    tableCol() {
      const _this = this
      return [
        {
          label: "操作人",
          prop: "loginName"
        },
        {
          label: "模块名称",
          prop: "moduleName"
        },
        {
          label: "操作名称",
          prop: "description"
        },
        {
          label: "ip地址",
          prop: "ip",
          width: 120
        },
        {
          label: "方法名称",
          prop: "methodName",
          width: 130
        },
        {
          label: "类名",
          prop: "className"
        },
        {
          label: "操作时间",
          prop: "createTime",
          width: 155
        },
        {
          label: "入参详情",
          prop: "params",
          width: 80,
          formatter: (row) => {
            return (
              <el-button size="small" on-click={() => _this.handleCheckParams(row.params)}>
                详情
              </el-button>
            )
          }
        }
      ]
    }
  },
  created() {
    const startTime = this.$dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD")
    const endTime = this.$dayjs(new Date()).format("YYYY-MM-DD")
    this.searchForm.date = [`${startTime} 00:00:00`, `${endTime} 23:59:59`]
    this.handleSearchInfo()
  },
  methods: {
    handleSearchInfo() {
      this.searchParams = this.$deepcopy(this.searchForm)
      this.getList()
    },
    async getList(pageNum = 1) {
      this.isLoading = true
      try {
        this.listData.pageNum = pageNum
        const params = {
          pageNum: this.listData.pageNum,
          pageSize: this.listData.pageSize,
          loginName: this.searchParams.loginName,
          description: this.searchParams.description
        }
        if (this.searchParams.date && this.searchParams.date.length) {
          params.startTime = this.searchParams.date[0]
          params.endTime = this.searchParams.date[1].replace('00:00:00', '23:59:59')
        }
        const { data } = await getLogInfos(params)
        this.listData.listInfo = data.dataList
        this.listData.total = data.total
      } catch (error) {
        this.listData.listInfo = []
        this.listData.total = 0
        console.log('[error]', error)
      }
      this.isLoading = false
    },
    handleCheckParams(params) {
      this.isShow = true
      const _params = JSON.parse(params)
      _params.forEach(e => {
        if (e.regionConfig) {
          e.regionConfig = JSON.parse(e.regionConfig)
        } else if (e.kpiConfig) {
          e.kpiConfig = JSON.parse(e.kpiConfig)
        }
      })

      this.paramsTemp = _params
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
