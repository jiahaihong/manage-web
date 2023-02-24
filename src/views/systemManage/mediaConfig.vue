<!--
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-24 13:27:39
 * @LastEditors: Please set LastEditors
 * @Description: 统管理-媒体配置
-->

<template>
  <div class="app-container">
    <div class="global-search">
      <el-tabs
        v-model="virtualMedia"
        @tab-click="getList(1,listData.pageSize, $event)"
      >
        <el-tab-pane
          v-for="item in virtualMediaAll"
          :key="item.name"
          :disabled="isLoading"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
      <el-form
        class=" flex "
        :model="searchForm"
      >
        <el-row
          type="flex"
          :gutter="5"
        >
          <el-col :span="6">
            <el-form-item>
              <el-autocomplete
                v-model.trim="searchForm.content"
                style="width:100%"
                placeholder="请输入内容"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm.type"
                  style="width:140px"
                  placeholder="请选择"
                  @change="searchForm.content = ''"
                >
                  <el-option
                    v-for="item in options"
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
            <el-form-item>
              <el-select
                v-model="searchForm.businessLine"
                style="width: 100%"
                placeholder="请选择业务线"
                clearable
              >
                <el-option
                  v-for="item in businessLineOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              :loading="isLoading"
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
    </div>
    <div
      v-loading="isLoading"
      class="global-module"
    >
      <el-table
        :data="listData.info"
        style="width: 100%"
        class="table-fixed"
        border
        size="small"
      >
        <template v-for="(col) in tableCol">
          <el-table-column
            v-if="col.hasOwnProperty('visible') ? col.visible : true "
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :formatter="col.formatter"
            :width="col.width"
          />
        </template>
        <el-table-column
          label="操作"
          fixed="right"
          width="80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit('edit', scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="listData.total"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="listData.pageNum"
        :page-size="listData.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        @size-change="getList(1, $event)"
        @current-change="getList($event, listData.pageSize)"
      />
    </div>
    <e-modal
      ref="modalForm"
      :dialog-data="dialogData"
      @submit="callFn"
    />
  </div>
</template>

<script>
import ModalForm from "./components/modalMediaConfig";
import { getListPlatform } from "@/api/system";
import { resetRouter } from "@/router";
export default {
  components: {
    "e-modal": ModalForm
  },
  data() {
    return {
      isLoading: false,
      virtualMedia: '2',
      virtualMediaAll: [
        { label: '媒体平台', name: '2' },
        { label: '虚拟媒体', name: '1' }
      ],
      options: [
        { label: "媒体名称/编号", value: "mediaCode" }, // mediaName
      ],
      businessLineOptions: [
        { label: "海外大媒体", value: "HW" },
        { label: "国内大媒体", value: "GN" }
      ],
      searchForm: {
        type: "mediaCode",
        content: "",
        businessLine: ""
      },
      searchParams: {},
      dialogData: {},
      listData: {
        info: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      selectRows: []
    };
  },
  computed: {
    tableCol() {
      const _this = this
      return [
        {
          label: "序号",
          prop: "id"
        },
        {
          label: "媒体编号",
          prop: "mediaCode"
        },
        {
          label: "媒体平台",
          prop: "mediaName",
        },
        {
          visible: _this.virtualMedia === '2',
          label: "对接方式",
          prop: "recType",
          formatter: (row) => {
            if (_this.$isEmpty(row.recType)) {
              return
            }
            const style = row.recType == 1 ? 'color: var(--global-color-primary)' : ''
            return (
              <div style={style}>
                {row.recType == 1 ? 'API' : '手动对接' }
              </div>
            )
          }
        },
        {
          label: "业务线",
          prop: "businessLine",
          formatter: (row) => {
            if (_this.$isEmpty(row.businessLine)) {
              return
            }
            const style = row.businessLine === 'HW' ? 'color: var(--global-color-primary)' : ''
            return (
              <div style={style}>
                {row.businessLine === 'HW' ? '海外大媒体' : '国内大媒体' }
              </div>
            )
          }
        },
        {
          visible: _this.virtualMedia === '2',
          label: "合作方式",
          prop: "mbType",
          formatter: (row) => {
            if (_this.$isEmpty(row.mbType)) {
              return
            }
            const style = row.mbType === 1 ? 'color: var(--global-color-primary)' : ''
            return (
              <div style={style}>
                {row.mbType === 1 ? '线上' : '线下' }
              </div>
            )
          }
        },
        {
          visible: _this.virtualMedia === '2',
          label: "服务范畴",
          prop: "mediaScopeIds",
          formatter: (row) => {
            if (_this.$isEmpty(row.mediaScopeIds) || row.mbType !== 1) {
              return
            }
            return row.mediaScopeIds.map(t => {
              if (t === 1) {
                return '开户服务'
              } else if (t === 2) {
                return '充值服务'
              } else if (t === 3) {
                return '清零服务'
              }
              return t
            }).join('、')
          }
        },
        {
          label: "更新时间",
          prop: "updateTime"
        }
      ]
    }
  },
  created() {
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.searchParams = this.$deepcopy(this.searchForm, 'JSON')
      this.listData.pageNum = 1;
      this.getList();
    },
    async getList(page = 1, pageSize) {
      try {
        if (pageSize) {
          this.listData.pageSize = pageSize
        }
        this.listData.pageNum = page
        const { type, content, ...last } = this.searchParams;
        const params = {
          pageSize: this.listData.pageSize,
          pageNo: this.listData.pageNum,
          virtualMedia: Number(this.virtualMedia),
          orderStatus: 2,
          ...last
        };
        if (content) {
          params[type] = content;
          if (type === 'mediaCode') {
            params.mediaName = content;
          }
        }
        this.isLoading = true
        const res = await getListPlatform(params)
        this.listData.info = res.data.dataList;
        this.listData.total = res.data.total;
      } catch (error) {
        this.listData.info = [];
        this.listData.total = 0;
      }
      this.isLoading = false
    },
    handleEdit($type, row) {
      this.dialogData = {
        $type: $type,
        virtualMedia: Number(this.virtualMedia),
      };
      if ($type === "edit") {
        Object.assign(this.dialogData, this.$deepcopy(row))
      }
      this.$refs["modalForm"].visible = true;
    },
    callFn() {
      resetRouter()
      this.getList(this.listData.pageNum)
    },
    handleSelectionChange(val) { // 单选多选
      this.selectRows = val;
    }
  }
};

</script>
