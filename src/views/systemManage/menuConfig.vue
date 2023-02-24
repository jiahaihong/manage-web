<!--
 * @Author: tracy.sun
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-06 16:26:13
 * @LastEditors: Please set LastEditors
 * @Description: 菜单配置
-->

<template>
  <div class="app-container menuConfig">
    <div class="global-search">
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabChange"
      >
        <el-tab-pane
          v-for="item in systemList"
          :key="item.code"
          :disabled="isLoading"
          :label="item.desc"
          :name="item.code"
        />
      </el-tabs>
    </div>
    <div class="global-button-group">
      <el-button
        key="addCatalogue"
        size="small"
        type="primary"
        @click="openPrimaryDialog()"
      >
        添加一级目录
      </el-button>
    </div>
    <el-table
      v-loading="isloading"
      :data="tableData"
      size="small"
      row-key="id"
      class="table-fixed"
      :tree-props="{ children: 'resources' }"
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

    <PrimaryDialog
      ref="primaryDialog"
      :sys-root="activeSys"
      @submit="getTableTreeData(activeName)"
    />
    <ButtonDialog
      ref="buttonDialog"
      :type="dialogType"
      :modal-data="dialogData"
      :sys-code="activeName"
      @submit="getTableTreeData(activeName)"
    />
  </div>
</template>

<script>
// import mockData from "./mockData";
import PrimaryDialog from "./menuComponents/PrimaryDialog";
import ButtonDialog from "./menuComponents/ButtonDialog";
import { getChildSystem, getSystemResources, delResourceTree } from "@/api/system";

export default {
  name: "MenuConfig",
  components: {
    PrimaryDialog,
    ButtonDialog
  },
  data() {
    return {
      isloading: false,
      systemList: [],
      activeName: "CS",
      activeSys: {},
      isLoading: false,
      tableData: [],
      dialogType: "add",
      dialogData: {}
    };
  },
  computed: {
    isGeorge() {
      try {
        const loginName = this.$store.state.user.userInfo.loginName;
        return ['george.qiao@yeahmobi.com', 'george.qiao@cyberklick.com'].includes(loginName)
      } catch (error) {
        return false
      }
    },
    tableCol() {
      const _this = this;
      return Object.freeze([
        {
          label: "菜单中文名称",
          prop: "name",
          width: 300
        },
        {
          label: "菜单英文名称",
          prop: "enName"
        },
        {
          label: "ID",
          prop: "id"
        },
        {
          label: "排序",
          prop: "sort"
        },
        {
          label: "类型",
          prop: "type",
          formatter: row => {
            return _this.$enum.SYSTEM_AUTH_TYPE[row.type];
          }
        },
        {
          label: "路由名称",
          prop: "routeName"
        },
        {
          label: "操作",
          prop: "oparetion",
          formatter: row => {
            // 添加
            const add = (
              <el-button
                type="primary"
                size="mini"
                on-click={() => _this.openDialog("add", row)}
              >
                添加
              </el-button>
            );
            // 编辑
            const edit = (
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                on-click={() => _this.openDialog("edit", row)}
              ></el-button>
            );
            const btnDelete = (
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                on-click={() => _this.deleteBtn(row)}
              ></el-button>
            );
            return (
              <div>
                {[1, 2, 5].includes(row.type) ? add : null}
                {edit}
                { _this.isGeorge ? btnDelete : ''}
              </div>
            );
          }
        }
      ]);
    }
  },
  mounted() {
    this.getSystemList();
  },
  methods: {
    async getSystemList() {
      const res = await getChildSystem();
      if (res.code === 200) {
        this.systemList = res.data;
        this.activeSys = this.systemList.find(
          item => item.code === this.activeName
        );
        this.getTableTreeData(this.activeName);
      }
    },
    async getTableTreeData(code) {
      this.isloading = true
      const res = await getSystemResources({
        systemCode: code
      });
      if (res.code === 200) {
        this.tableData = res.data;
      }
      this.isloading = false
    },
    /**
     * @description: 添加/编辑弹框
     * @param {*} type
     * @param {*} row
     * @return {*}
     */
    openDialog(dialogType, row = {}) {
      this.dialogType = dialogType;
      this.dialogData = { ...row };
      this.$refs["buttonDialog"].visible = true;
    },
    openPrimaryDialog() {
      this.$refs["primaryDialog"].visible = true;
    },
    handleTabChange(tab) {
      this.activeSys = this.systemList.find(
        item => item.code === this.activeName
      );
      this.getTableTreeData(this.activeName);
    },
    async deleteBtn(row) {
      try {
        await this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await delResourceTree({ id: row.id })
        this.$message({
          type: "success",
          message: res.msg
        });
        this.getTableTreeData(this.activeName);
      } catch (error) {
        console.warn(error)
      }
    }
  }
};
</script>
<style lang="scss">
.menuConfig {
  .el-table th {
    background: #eee;
  }
  // .el-select {
  //   width: 100%;
  // }
}
</style>
