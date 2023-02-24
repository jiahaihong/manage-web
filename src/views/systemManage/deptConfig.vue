<!--
 * @Author: george.qiao
 * @Date: 2021-08-19 14:28:06
 * @LastEditTime: 2023-01-13 16:05:40
 * @LastEditors: Please set LastEditors
 * @Description: 部门配置
-->
<!--  -->
<template>
  <div class="app-container deptConfig">
    <div class="global-search">
      <el-tabs
        v-model="virtualMedia"
        @tab-click="getList(1, listData.pageSize, $event)"
      >
        <el-tab-pane
          v-for="item in virtualMediaAll"
          :key="item.name"
          :disabled="isLoading"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
    </div>
    <div class="global-button-group">
      <el-button
        v-if="permissionButtons.includes('addDeptConfig')"
        key="addDeptConfig"
        size="small"
        type="primary"
        @click="openDialog('ADD')"
      >
        添加配置
      </el-button>
    </div>
    <el-table
      v-loading="isLoading"
      :data="listData.info"
      class="table-fixed"
      border
      size="small"
    >
      <template v-for="col in tableCol">
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
      :page-size="listData.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      @size-change="getList(1, $event)"
      @current-change="getList($event, listData.pageSize)"
    />
    <deptDialog
      ref="deptDialog"
      :dialog-data="dialogData"
      @submit="getList"
    />
  </div>
</template>

<script>
import { queryConfigDtos } from "@/api/system";
import deptDialog from "./components/deptDialog";
export default {
  name: "DeptConfig",
  components: {
    deptDialog
  },
  data() {
    return {
      virtualMedia: "1",
      virtualMediaAll: [{ label: "客户交接部门配置", name: "1" }],
      isLoading: false,
      listData: {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      dialogData: {}
    };
  },
  computed: {
    permissionButtons() {
      return this.$route.meta.permissionButtons || [];
    },
    tableCol() {
      const _this = this;
      const CUSTOMERTYPEDICT_OBJ =
        _this.$store.state.common.CUSTOMERTYPEDICT_OBJ;
      return Object.freeze([
        {
          label: "业务线",
          prop: "businessLine",
          width: 90,
          formatter: row => {
            if (_this.$isEmpty(row.businessLine)) {
              return;
            }
            const style =
              row.businessLine === "HW"
                ? "color: var(--global-color-primary)"
                : "";
            return (
              <div style={style}>
                {row.businessLine === "HW" ? "海外大媒体" : "国内大媒体"}
              </div>
            );
          }
        },
        {
          label: "业务类型",
          prop: "businessType",
          width: 80,
          formatter: row => {
            return _this.$enum.BUSSINESSAD_TYPE_MAP[row.businessType];
          }
        },
        {
          label: "客户分类",
          prop: "advertiserType",
          width: 120,
          formatter: row => {
            if (_this.$isEmpty(row.advertiserType)) {
              return;
            }

            return row.advertiserType
              .map(t => CUSTOMERTYPEDICT_OBJ[t])
              .join("、");
          }
        },
        {
          label: "AM部门",
          prop: "amDepartmentName",
          formatter: row => {
            if (_this.$isEmpty(row.amDepartmentName)) {
              return "";
            }
            const text = row.amDepartmentName.map(t => (
              <div>{t.departmentName}</div>
            ));
            return <div>{text}</div>;
          }
        },
        {
          label: "投放部门",
          prop: "operationDepartmentName",
          formatter: row => {
            if (_this.$isEmpty(row.operationDepartmentName)) {
              return "";
            }
            const text = row.operationDepartmentName.map(t => (
              <div>{t.departmentName}</div>
            ));
            return <div>{text}</div>;
          }
        },
        {
          label: "运营部门",
          prop: "departmentName",
          formatter: row => {
            if (_this.$isEmpty(row.departmentName)) {
              return "";
            }
            const text = row.departmentName.map(t => (
              <div>{t.departmentName}</div>
            ));
            return <div>{text}</div>;
          }
        },
        {
          label: "设计部门",
          prop: "designDepartmentName",
          formatter: row => {
            if (_this.$isEmpty(row.designDepartmentName)) {
              return "";
            }
            const text = row.designDepartmentName.map(t => (
              <div>{t.departmentName}</div>
            ));
            return <div>{text}</div>;
          }
        },
        {
          label: "更新时间",
          prop: "updateTime",
          width: 140
        },
        {
          label: " 操作",
          prop: "opration",
          width: 80,
          formatter: row => {
            if (_this.permissionButtons.includes("updateDeptConfig")) {
              return (
                <el-button
                  on-click={() => _this.openDialog("EDIT", row)}
                  size="small"
                  type="primary"
                >
                  编辑
                </el-button>
              );
            } else {
              return "";
            }
          }
        }
      ]);
    }
  },
  created() {
    this.getList();
  },
  // 方法集合
  methods: {
    async getList(page = 1, pageSize) {
      try {
        this.isLoading = true;
        if (pageSize) {
          this.listData.pageSize = pageSize;
        }
        this.listData.pageNo = page;
        const params = {
          pageSize: this.listData.pageSize,
          pageNo: this.listData.pageNo
        };
        const res = await queryConfigDtos(params);
        if (this.$isEmpty(res.data.dataList)) {
          throw new Error("返回为空；无需执行");
        }
        this.listData.info = res.data.dataList;
        this.listData.total = res.data.total;
      } catch (error) {
        this.listData.info = [];
      }
      this.isLoading = false;
    },
    openDialog($type, row = {}) {
      const query = { ...row, $type: $type };
      if ($type === "EDIT") {
        query.amDepartmentOptions = row.amDepartmentName.map(t => t.orgId);
        query.amDepartmentIds = row.amDepartmentName.map(t => t.id);

        query.operationDepartmentOptions = row.operationDepartmentName.map(t => t.orgId);
        query.operationDepartmentIds = row.operationDepartmentName.map(t => t.id);

        query.departmentOptions = row.departmentName.map(t => t.orgId);
        query.departmentIds = row.departmentName.map(t => t.id);

        query.designDepartmentOptions = row.designDepartmentName.map(t => t.orgId);
        query.designDepartmentIds = row.designDepartmentName.map(t => t.id);
      }
      this.dialogData = query;
      this.$refs.deptDialog.isVisible = true;
    },
  }
};
</script>
<style lang="scss" scoped></style>
