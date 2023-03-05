<!-- 角色管理 -->
<template>
  <div class="roleManage">
    <a-row class="primary_card">
      <a-col :span="5">
        <a-card class="role_name" style="height: 100%">
          <div slot="title" class="title">
            <span>角色列表</span>
            <a-tooltip>
              <template slot="title">新增角色</template>
              <a-button
                type="link"
                v-if="globalButtons.includes('addRole')"
                ref="addRole"
                size="small"
                :disabled="loading"
                @click="onHandleRole('ADD')"
              >
                <icon-font class="fs-24 icon_font" type="iconzengjia2" />
              </a-button>
            </a-tooltip>
          </div>
          <div>
            <div class="role_name_header">
              <div class="sticky">
                <a-input-search
                  v-model.trim="searchRole"
                  placeholder="请输入角色名称"
                  @pressEnter="getSearch"
                  @search="getSearch"
                />
              </div>
            </div>
            <ul v-if="roleList.length > 0" class="role_name_ul">
              <li v-for="(item, index) in roleList" :key="index" class="role_name_li">
                <div v-if="roleIndex === index && isInput" key="input" class="name_input">
                  <a-input
                    ref="refInputRole"
                    v-model.trim="inputRole"
                    placeholder="请输入角色"
                    @pressEnter.stop="onSetName(item)"
                  >
                    <div slot="suffix" class="btnOk">
                      <a-icon type="check" @click.stop="onSetName(item)" />
                    </div>
                  </a-input>
                </div>
                <div
                  v-else
                  key="handle"
                  class="name_item"
                  :class="[roleIndex === index ? 'active' : '']"
                  @click.stop="onChooseRole(item, index)"
                >
                  <span class="name_item_title">
                    {{ item.name }}
                    <!-- <span style="margin-left: 5px">{{}}</span> -->
                  </span>
                  <!-- 功能操作 -->
                  <div v-if="!NoEdited.includes(item.type)">
                    <a-dropdown
                      :trigger="['click']"
                      overlay-class-name="companyDropdown"
                      :get-popup-container="getPopupContainer"
                    >
                      <a class="c-green btn" @click.stop="e => e.preventDefault()">
                        <icon-font type="iconmore" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a-button
                            v-if="globalButtons.includes('updateRole')"
                            key="updateRole"
                            type="link"
                            @click.stop="onHandleRole('EDIT', item, index)"
                          >
                            <a-icon type="edit" />编辑
                          </a-button>
                        </a-menu-item>
                        <a-menu-item>
                          <a-button
                            v-if="globalButtons.includes('deleteRole')"
                            key="deleteRole"
                            type="link"
                            @click="showDeleteConfirm(item)"
                          >
                            <a-icon type="delete" />删除
                          </a-button>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                </div>
              </li>
            </ul>
            <block-empty v-else />
          </div>
        </a-card>
      </a-col>
      <a-col class="primary_card_items" :span="19" style="padding-left: 16px;">
        <div class="primary_card_box">
          <a-tabs class="scroll-ant-tabs">
            <template v-for="item in resourcesList">
              <a-tab-pane :key="item.id" :tab="item.tabName">
                <a-spin :spinning="loading" size="large" style="height: 100%">
                  <template v-if="item.resources.length > 0">
                    <template v-for="itemChild in item.resources">
                      <div :key="itemChild.id">
                        <a-collapse default-active-key="1" :bordered="false" expand-icon-position="right">
                          <template #expandIcon="props">
                            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
                          </template>
                          <a-collapse-panel key="1" class="collapse_box">
                            <div slot="header">{{ itemChild.name }}</div>
                            <!-- 树结构 -->
                            <a-tree
                              v-model="resourcesForm[itemChild.id]"
                              :tree-data="[itemChild]"
                              :checkable="isSaveBtn"
                              default-expand-all
                              :replace-fields="{
                                children: 'resources',
                                title: 'name',
                                key: 'id'
                              }"
                              :default-expanded-keys="[]"
                              @check="(checkedKeys, event) => changeAuthCheck(checkedKeys, event, itemChild.id)"
                            />
                          </a-collapse-panel>
                        </a-collapse>
                      </div>
                    </template>
                  </template>
                </a-spin>
              </a-tab-pane>
            </template>
          </a-tabs>
          <div class="save_btn">
            <a-button
              v-if="globalButtons.includes('featuresManage') && isSaveBtn"
              key="featuresManage"
              slot="tabBarExtraContent"
              class="featuresManage"
              type="primary"
              :disabled="loading"
              @click="saveResources('savePower')"
            >
              保存
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  getResourceTree,
  getRoleList,
  postAddRole,
  postEditRole,
  postDeleteRole,
  getRoleResourceIds
} from "@/api/company.api";

/* 扁平化数组, 取出对应的id */
const flatTree = (All, checkItem) => {
  const flat = data => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      arr.push(node);
      if (Array.isArray(node.resources) && node.resources.length > 0) {
        arr = arr.concat(flat(node.resources));
      }
    }
    return arr;
  };
  const obj = {};
  const form = {};
  All.forEach(ls => {
    ls.resources.forEach(item => {
      if (!form[item.id]) {
        form[item.id] = [];
      }
      obj[item.id] = flat([item]).map(tk => {
        if (checkItem.includes(tk.id)) {
          form[item.id].push(tk.id);
        }
        return tk;
      });
    });
  });
  return {
    form,
    obj
  };
};

/* 最后一个子节点要平铺 */
const getFatcherTree = (data, type = "children", name = "Tile") => {
  const getFatcher = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (Array.isArray(node[type]) && node[type].length > 0) {
        const isFather = node[type].every(item => {
          return !(Array.isArray(item[type]) && item[type].length > 0);
        });
        node.isFather = isFather;
        if (isFather) {
          node.class = name;
        }
        getFatcher(node[type]);
      }
    }
  };
  getFatcher(data);
  return data;
}
export default {
  name: "RoleManage",
  data() {
    return {
      NoEdited: [1, 2], // type 为1或者2不可以编辑角色
      NoSave: [1], // type 为1不可以编辑权限
      loading: false,
      searchRole: "",
      inputRole: "",
      roleIndex: 0,
      isInput: false,
      roleType: "ADD",
      roleList: [], // 角色列表
      resourcesList: [], // 权限列表
      resourcesForm: {} // 选中节点
    };
  },
  computed: {
    globalButtons() {
      return this.$route.meta.globalButtons || [];
    },
    globalTabs() {
      return this.$route.meta.globalTabs || [];
    },
    globalTabsObjs() {
      return this.$route.meta.globalTabsObjs || [];
    },
    singleRole() {
      return this.roleList[this.roleIndex] || {};
    },
    /**
     * @description: 管理员无需保存
     * @param {*}
     * @return {*}
     */
    isSaveBtn() {
      return !this.NoSave.includes(this.singleRole.type);
    }
  },
  created() {
    this.getInit();
  },
  mounted() {
    document.addEventListener("click", this.handleDocumentClick, false);
  },
  destroyed() {
    document.removeEventListener("click", this.handleDocumentClick, false);
  },
  // 方法集合
  methods: {
    // 初始化拉菜单树
    getInit() {
      getResourceTree().then(res => {
        const data = getFatcherTree(res.data, "resources", "fatcher_tree");
        this.resourcesList = data;
        this.resourcesList.forEach(e => {
          e.tabName = `${e.name}`;
        });
        this.getSearch("init");
      });
    },
    // 查询列表
    async getSearch(init) {
      this.loading = true;
      const res = await getRoleList({ roleName: this.searchRole });
      this.roleList = res.data || [];
      if (init) {
        this.roleIndex = 0;
      }
      await this.getSearchRole();
    },
    // 查询单个权限列表
    getSearchRole() {
      this.$nextTick(async () => {
        if (!this.isSaveBtn) {
          this.loading = false;
          return;
        }

        // singleRole 需要在nextTick后 才能取到
        const item = this.singleRole;

        if (!item || !item.id) {
          this.loading = false;
          const FlatData = flatTree(this.resourcesList, []);
          // console.warn(FlatData)
          this.resourcesForm = FlatData.form;
          return;
        }
        this.loading = true;
        const res = await getRoleResourceIds({
          roleId: item.id
        });
        const FlatData = flatTree(this.resourcesList, res.data);
        // console.warn(FlatData)
        this.resourcesForm = FlatData.form;
        this.loading = false;
      });
    },
    // 选择角色
    onChooseRole(item, index) {
      if (this.roleIndex === index) {
        return;
      }
      this.roleIndex = index;
      this.isInput = false;
      this.getSearchRole();
    },
    // 新增、编辑角色
    onHandleRole(type, item, index) {
      this.roleType = type;
      if (this.isInput) {
        return;
      }
      this.isInput = true;
      if (type === "ADD") {
        const obj = {
          name: ""
        };
        this.roleList.push(obj);
        this.roleIndex = this.roleList.length - 1;
        this.inputRole = obj.name;
      }
      if (type === "EDIT") {
        this.inputRole = item.name;
        this.roleIndex = index;
      }
      this.$nextTick(() => {
        this.$refs.refInputRole[0].focus();
      });
    },
    // 新增、编辑角色确定
    async onSetName(item) {
      this.loading = true;
      try {
        if (!this.inputRole) {
          this.$message.warn("角色不能为空");
          this.loading = false;
          return;
        }
        if (this.roleType === "ADD") {
          await postAddRole({
            name: this.inputRole
          });
          this.$message.success("新增角色成功");
        }
        if (this.roleType === "EDIT") {
          await this.saveResources("saveRole", this.inputRole);
          this.$message.success("编辑角色成功");
        }
        await this.getSearch();
        this.isInput = false;
        this.roleType = "";
      } catch (error) {
        this.loading = false;
      }
    },
    // 重置表单
    handleDocumentClick(e) {
      const parent = this.$refs.refInputRole;
      const button = this.$refs.addRole; // 不触发点击按钮
      if (Array.isArray(parent) && parent.length) {
        if (!parent[0].$el.contains(e.target) && !button.$el.contains(e.target)) {
          this.isInput = false;
          if (this.roleType === "ADD") {
            this.roleList.pop();
            this.roleIndex = 0;
          }
        }
      }
    },
    // 删除组织
    showDeleteConfirm(item) {
      const _this = this;
      this.$confirm({
        title: "删除角色",
        content: "你确定要删除这个角色？",
        centered: true,
        okText: "确认",
        cancelText: "取消",
        async onOk() {
          _this.loading = true;
          try {
            const formData = new FormData();
            formData.append("roleId", item.id);
            await postDeleteRole(formData);
            _this.$message.success(`${item.name}移除成功`);
            _this.getSearch("init");
          } catch (error) {
            _this.loading = false;
          }
        },
        onCancel() {}
      });
    },
    // 保存权限
    async saveResources(type, data) {
      try {
        const item = this.singleRole;
        if (type === "saveRole") {
          // 保存角色名字
          item.name = data;
        }
        let resourceIds = [];
        Object.values(this.resourcesForm).forEach(single => {
          if (Array.isArray(single) && single.length) {
            resourceIds = resourceIds.concat(single);
          }
        });
        await postEditRole({
          id: item.id,
          name: item.name,
          resourceIds: resourceIds
        });
        if (type === "savePower") {
          this.$message.success("保存权限成功");
        }
      } catch (error) {
        this.loading = false;
      }
    },
    getPopupContainer($event) {
      return $event.parentElement;
    },
    changeAuthCheck(checkedKeys, event, rootId) {
      const node = event.node.dataRef;
      const parentNode = this.$findTreeItemById(node.parentId, this.resourcesList, "resources");
      // 任意选中功能权限，则查看列表权限必须选中
      if (node.look === 2 && event.checked) {
        const listAuthNode = parentNode.resources.find(item => item.look === 1);
        if (listAuthNode && !_.includes(checkedKeys, listAuthNode.id)) {
          this.resourcesForm[rootId].push(listAuthNode.id);
        }
      }
      // 取消查看列表权限，则当前页所有功能权限取消
      if (node.look === 1 && !event.checked) {
        const optAuthNodes = parentNode.resources
          .filter(item => {
            return item.look === 2;
          })
          .map(item => {
            return item.id;
          });
        _.remove(this.resourcesForm[rootId], i => {
          return _.includes(optAuthNodes, i);
        });
      }
    }
  }
};
</script>

<style lang="scss">
.roleManage {
  text-align: left;
  height: 100%;
  overflow: hidden;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    color: #13234c;
    font-size: 16px;
    .btn {
      &.addRoleBtn {
        background: #99aac1;
        &:hover,
        &:active {
          background: $color-green;
        }
      }
      font-size: 12px;
      border: none;
      background: $color-blue;
      border-radius: 50%;
      .icon_font {
        color: #fff;
        text-align: center;
        border-radius: 50%;
        vertical-align: -0.125em;
      }
    }
  }
  .ant-tabs-nav .ant-tabs-tab {
    font-size: 16px;
    line-height: 20px;
  }
  .role_name {
    .ant-card-head {
      padding: 0 16px;
      .ant-btn-link {
        color: $color-grey7;
        &:hover {
          color: $color-green;
        }
        &[disabled] {
          color: $color-grey;
        }
      }
    }
    .ant-card-body {
      padding: 0px;
    }
    .role_name_header {
      height: 72px;
      position: sticky;
      top: 0px;
      background: #fff;
      .sticky {
        width: 100%;
        height: 72px;
        padding: 20px 16px;
      }
    }
    .role_name_ul {
      padding-bottom: 20px;
      .role_name_li {
        height: 36px;
        .name_input {
          padding: 0 20px;
          .btnOk {
            cursor: pointer;
          }
        }
        .name_item {
          padding: 0 16px;
          width: 100%;
          height: 36px;
          line-height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            background: $color-grey3;
            .btn {
              display: block;
            }
          }
          &.active {
            background-color: $color-lightgreen;
            color: $color-green;
          }
          .name_item_title {
            flex: 1;
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .btn {
            display: none;
            padding: 0 10px;
          }
        }
      }
    }
  }
  .primary_card_items {
    position: relative;
    .primary_card_box {
      border: 1px solid #e1e8f9;
      border-radius: 8px;
      padding: 13px 16px 0;
      height: 100%;
    }
    .save_btn {
      position: absolute;
      bottom: 1px;
      z-index: 10;
      width: calc(100% - 36px);
      padding: 5px 30px;
      display: flex;
      justify-content: flex-end;
      background: #fff;
      box-shadow: 8px 1px 8px 0px rgba(40, 57, 109, 0.05);
      .featuresManage {
        width: 120px;
        height: 34px;
        line-height: 1;
      }
    }
    // ant-tabs标签组件 class名：scroll-ant-tabs 需要滚动
    .ant-tabs {
      &.scroll-ant-tabs {
        background: #fff;
        height: 100%;
        // .featuresManage {
        //   width: 120px;
        //   height: 34px;
        //   line-height: 1;
        // }
        .ant-tabs-bar {
          padding: 0 30px;
          .ant-tabs-extra-content {
            line-height: 40px;
          }
        }

        .ant-tabs-content {
          height: calc(100% - 90px);

          .ant-tabs-tabpane {
            padding: 10px 30px;
            overflow: auto;
            @include scroll-bar;
          }
        }
      }
    }
    .ant-collapse {
      .collapse_box {
        background: #f7f9fe;
        border-radius: 12px;
        margin-bottom: 24px;
        border: 0;
        overflow: hidden;
      }
      .ant-collapse-item {
        .ant-collapse-content {
          position: relative;
          &:before {
            content: "";
            position: absolute;
            left: 18px;
            top: 0px;
            right: 16px;
            height: 1px;
            width: 95%;
            background-color: #e5e9ed;
          }
        }
      }
      .ant-tree li .ant-tree-node-content-wrapper:hover,
      .ant-select-tree li .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected,
      .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background: inherit;
      }
    }
  }
  .fatcher_tree {
    > ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > li {
        width: 25%;
      }
    }
  }
}
</style>
