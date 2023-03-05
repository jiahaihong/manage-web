<!-- 我的页面 -->
<template>
  <div class="user_manage">
    <a-row type="flex" class="search-box">
      <a-col :span="6">
        <a-input-search
          v-model.trim="searchModel"
          placeholder="请输入搜索"
          allow-clear
          enter-button
          @search="handleSearch"
        >
          <a-select slot="addonBefore" v-model="selectValue" style="width: 80px" @change="changeSearchSelect">
            <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-input-search>
      </a-col>
    </a-row>
    <div class="userContent">
      <a-row class="primary_card">
        <!-- 组织架构 -->
        <a-col :span="6">
          <a-card style="height: 100%">
            <div slot="title" class="title">组织架构</div>
            <a-spin :spinning="loading">
              <div v-if="deptDate.length > 0" class="deptTree">
                <a-tree
                  :tree-data="deptDate"
                  :selected-keys="selectedKeys"
                  default-expand-all
                  block-node
                  :replace-fields="{
                    children: 'children',
                    title: 'name',
                    key: 'id'
                  }"
                  :expanded-keys="expandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  @select="onSelect"
                  @expand="onExpand"
                >
                  <span slot="nodeTitle" slot-scope="scope" class="treeNode">
                    <div
                      class="first_child"
                      :class="[searchModel && scope.name.indexOf(searchModel) > -1 ? 'search' : '']"
                    >
                      {{ scope.name }}
                      <span>（{{ scope.count }}）</span>
                    </div>
                    <a-dropdown
                      v-show="scope.orgType !== 2"
                      :trigger="['click']"
                      overlay-class-name="companyDropdown"
                      :get-popup-container="getPopupContainer"
                    >
                      <a class="c-green btn" @click.stop="e => e.preventDefault()">
                        <!-- <icon-font type="" /> -->
                        <a-icon type="dash" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item key="createDept">
                          <a-button type="link" @click="openDept('ADD', scope)"> <a-icon type="plus" />新增 </a-button>
                        </a-menu-item>
                        <a-menu-item v-if="scope.nodeType !== 1" key="editDept">
                          <a-button type="link" @click="openDept('EDIT', scope)"> <a-icon type="edit" />编辑 </a-button>
                        </a-menu-item>
                        <a-menu-item
                          v-if="scope.nodeType !== 1"
                          key="deleteDept"
                        >
                          <a-button type="link" @click="onDeleteTree(scope)"> <a-icon type="delete" />删除 </a-button>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </span>
                </a-tree>
              </div>
              <block-empty v-else />
            </a-spin>
          </a-card>
        </a-col>
        <!-- 成员列表 -->
        <a-col :span="18" style="padding-left: 20px">
          <a-card class="authority" style="height: 100%">
            <div slot="title" class="title">
              <span>{{ selectDeptObj.name }}</span>
            </div>
            <div class="table-wrap table-wrap-clear" style="border: none">
              <a-table
                :columns="columns"
                :data-source="tableData"
                row-key="id"
                :loading="loading"
                :pagination="pagination"
                @change="changeTable"
              >
                <div slot="positionType" slot-scope="text, scope">
                  <span>{{ scope.positionType }}</span>
                </div>
                <div slot="roleNames" slot-scope="text, scope">
                  <span v-for="(item, index) in scope.roleNames" :key="item.roleId">
                    <span>
                      {{ item.roleName }}
                      <span v-show="index < scope.roleNames.length - 1">、</span>
                    </span>
                  </span>
                </div>
                <span slot="operation" slot-scope="text, scope" class="table-operation">
                  <a-button type="link">
                    <a
                      href="javascript:void(0)"
                      key="dataEdit"
                      @click="openModal('EDIT', scope)"
                      >资料编辑</a
                    >
                  </a-button>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!-- 组织弹框 -->
    <a-modal
      :title="deptTitle === 'ADD' ? '新增' : '编辑'"
      :visible="isDeptFormVisible"
      width="25%"
      centered
      destroy-on-close
      :confirm-loading="isLoading"
      ok-text="保存"
      cancel-text="取消"
      @ok="onDeptSubmit"
      @cancel="setModalCancel('deptForm')"
    >
      <div v-if="isDeptFormVisible">
        <a-form-model ref="deptForm" :model="deptForm" :rules="rules" layout="vertical">
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="name" label="组织名" prop="name">
                <a-input
                  v-model.trim="deptForm.name"
                  allow-clear
                  @blur="
                    () => {
                      $refs.name.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
    <!-- 用户弹框 -->
    <a-modal
      :title="userTitle === 'ADD' ? '新增成员' : '资料编辑'"
      :visible="isUserFormVisible"
      width="45%"
      centered
      destroy-on-close
      :confirm-loading="isLoading"
      ok-text="保存"
      cancel-text="取消"
      @ok="onSubmit"
      @cancel="setModalCancel('userForm')"
    >
      <div v-if="isUserFormVisible">
        <a-form-model ref="userForm" :model="userForm" :rules="rules" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item ref="userName" label="姓名" prop="userName">
                <a-input
                  v-model.trim="userForm.userName"
                  placeholder="输入您的姓名"
                  allow-clear
                  @blur="
                    () => {
                      $refs.userName.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="loginName" label="邮箱 " prop="loginName">
                <a-input
                  v-model.trim="userForm.loginName"
                  placeholder="输入登录用户名"
                  allow-clear
                  @blur="
                    () => {
                      $refs.loginName.onFieldBlur();
                    }
                  "
                  :disabled="userTitle !== 'ADD'"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="userTitle === 'ADD'" key="ADD" :span="12">
              <a-form-model-item ref="password" label="初始密码" prop="password">
                <a-input-password
                  v-model.trim="userForm.password"
                  placeholder="输入初始密码"
                  type="password"
                  allow-clear
                  @blur="
                    () => {
                      $refs.password.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="部门" prop="orgId">
                <a-tree-select
                  v-model="userForm.orgId"
                  :tree-data="companyOrgWithOutUnAssign"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="未分配"
                  allow-clear
                  tree-default-expand-all
                  :replace-fields="{
                    children: 'children',
                    title: 'name',
                    value: 'id'
                  }"
                  :filterTreeNode="filterFunc"
                  treeNodeFilterProp="name"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="positionType">
                <template slot="label">
                  <span>职位</span>
                  <a-popover placement="right" overlayClassName="positionType-popover">
                    <template slot="content">
                      <p>
                        每个部门仅可指定一名管理员，管理员将拥有本部门内所有数据。
                      </p>
                    </template>
                    <a-icon type="info-circle" class="ml-5 fs-12 form-tip-icon" style="margin-top:3px" />
                  </a-popover>
                </template>
                <a-select
                  v-model="userForm.positionType"
                  placeholder="请选择职位"
                  :disabled="
                    userForm.nodeType === 1 &&
                      userForm.roleNames.some(e => e.roleCode === 'ROLE_GLY') &&
                      userForm.positionType === 1
                  "
                >
                  <a-select-option v-for="item in positionList" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="角色" prop="roleIds">
                <a-tree-select
                  v-model="userForm.roleIds"
                  :tree-data="roleList"
                  tree-checkable
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择角色(可多选）"
                  :replace-fields="{
                    children: 'children',
                    title: 'name',
                    value: 'id',
                    key: 'id'
                  }"
                  :filterTreeNode="fillterFUN"
                  treeNodeFilterProp="title"
                  :disabled="
                    userForm.nodeType === 1 &&
                      userForm.roleNames.some(e => e.roleCode === 'ROLE_GLY') &&
                      userForm.positionType === 1
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" />
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
const resetUserForm = () => {
  // 重置表单
  return {
    userName: "",
    password: "",
    loginName: "",
    orgId: "",
    positionType: "",
    nodeType: "",
    roleNames: [],
    roleIds: []
  };
};
import {
  getOrgTree,
  addOrgNode,
  editOrgNode,
  deleteOrgNode,
  getOrgUser,
  addOrgUser,
  updateUser,
  getInviteMemberUrl
} from "@/api/company.api";
import { getRoleList } from "@/api/common.api";
// 邮箱
export function isEmail(email) {
  return /^[A-Za-z0-9\u4e00-\u9fa5\.\-\_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
}

import qs from "qs";
import { mapState, mapGetters } from "vuex";
export default {
  // import引入的组件需要注入到对象中才能使用
  name: "User",
  data() {
    // 这里存放数据
    const validateEmail = (rule, value, callback) => {
      if (!value || !value) {
        callback("请输入邮箱!");
      } else if (!isEmail(value)) {
        callback("邮箱格式不正确");
      } else {
        callback();
      }
    };
    return {
      validateEmail,
      isLoading: false,
      // orgName: "",
      deptAllDate: [], // tree平铺的数据
      deptDate: [], // tree的数据
      expandedKeys: [],
      autoExpandParent: true,
      isDeptFormVisible: false,
      deptTitle: "ADD",
      deptForm: {}, // 表单数据
      selectDeptObj: {
        // select选中数据
        name: "暂无数据"
      }, // 选中组织节点数据
      columns: Object.freeze([
        {
          title: "姓名",
          dataIndex: "userName",
          key: "userName",
          customCell: () => {
            return {
              style: {
                "min-width": "100px"
              }
            };
          }
        },
        {
          title: "部门",
          dataIndex: "orgName",
          key: "orgName",
          customCell: () => {
            return {
              style: {
                "min-width": "140px"
              }
            };
          }
        },
        {
          title: "职位",
          dataIndex: "positionType",
          key: "positionType",
          customCell: () => {
            return {
              style: {
                "min-width": "100px"
              }
            };
          },
          scopedSlots: { customRender: "positionType" }
        },
        {
          title: "邮箱",
          dataIndex: "loginName",
          key: "loginName",
          customCell: () => {
            return {
              style: {
                "min-width": "220px"
              }
            };
          }
        },
        {
          title: "角色",
          dataIndex: "roleNames",
          key: "roleNames",
          scopedSlots: { customRender: "roleNames" },
          // width: 140
          customCell: () => {
            return {
              style: {
                "min-width": "140px"
              }
            };
          }
        },
        {
          title: "操作",
          dataIndex: "address",
          key: "address",
          scopedSlots: { customRender: "operation" },
          fixed: "right",
          width: 240,
          customCell: () => {
            return {
              style: {
                "min-width": "240px"
              }
            };
          }
        }
      ]),
      tableData: [],
      // 用户表单
      isUserFormVisible: false,
      userTitle: "ADD",
      userForm: resetUserForm(),
      rules: Object.freeze({
        name: [{ required: true, message: "请输入组织名", trigger: "blur" }],
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 20, message: "请输入长度1-20字符", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入初始密码", trigger: "blur" }],
        orgId: [{ required: true, message: "请选择部门", trigger: "change" }],
        positionType: [{ required: true, message: "请选择职位", trigger: "change" }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }]
      }),
      roleList: [],
      selectedKeys: [],
      positionList: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        size: "small",
        showTotal: function(total) {
          return `共${total}条`;
        }
      },
      orgTreeData: [],
      quitType: "",
      isOpenQuitModal: false,
      inviteUrl: "",
      hasCopied: false,
      currentOptUser: null,
      currentOptUserId: "",
      selectValue: "member",
      selectOption: [
        {
          label: "成员",
          value: "member"
        },
        {
          label: "部门",
          value: "depart"
        }
      ],
      searchModel: "",
      searchedModel: "", // copy一个副本，以区分输入了搜索条件但并未点搜索按钮的情况
      loading: false,
      firstGetOrgTree: true,
      fromEditUser: false,
      orgAssetsAuthIds: []
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["companyOrg"]),
    globalButtons() {
      return this.$route.meta.globalButtons || [];
    },
    globalTabs() {
      return this.$route.meta.globalTabs || [];
    },
    companyOrgWithOutUnAssign: function() {
      return this.$store.state.company.companyOrg;
    },
    tableHeight() {
      return this.$store.state.user.screen.height - 230;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getRoleList();
    this.getSetOrgTree("init");
  },
  methods: {
    filterFunc(searchVal, treeNode) {
      return treeNode.data.props.name.includes(searchVal);
    },
    // 角色列表
    async getRoleList() {
      const res = await getRoleList();
      this.roleList = res.data;
      this.roleList.map(i => {
        if (i.roleCode === "ROLE_GLY") {
          i.disabled = true;
        }
      });
    },
    // 获取table数据
    async getListData(page = 1) {
      try {
        this.pagination.current = page;
        if (!this.selectDeptObj.id) {
          this.tableData = [];
          this.pagination.total = 0;
          return;
        }
        this.loading = true;

        const params = {
          orgId: this.selectDeptObj.id,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize
        };
        if (this.selectValue === "member" && this.searchedModel) {
          params["name"] = this.searchedModel;
        }

        const res = await getOrgUser(params);
        this.tableData = res.data.dataList || [];
        this.pagination.total = res.data.total || 0;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    // 获取树接口
    async getSetOrgTree(init) {
      try {
        this.loading = true;
        const params = {
          useSign: false
        };
        if (this.selectValue === "depart") {
          params["orgName"] = this.searchedModel;
        }
        if (this.selectValue === "member") {
          params["userName"] = this.searchedModel;
        }
        const res = await getOrgTree(params);

        if (this.firstGetOrgTree) {
          this.$store.commit("company/SET_COMPANY_ORG", res.data === null ? [] : [res.data]);
          this.firstGetOrgTree = false;
        }

        let data = [res.data];
        if (!res.data) {
          data = [];
        }
        this.deptDate = this.initTreeData(data);
        this.deptAllDate = Object.freeze(this.$conmmonMethods.generateList(this.deptDate));

        if (init && this.selectValue === "member") {
          // 初始化选中第一个
          this.selectedKeys = res.data ? [res.data.id] : [];
          this.selectDeptObj = res.data || {};
          // 获取当前用户拥有部门资产管理按钮权限的部门节点
          this.orgAssetsAuthIds = this.getOrgAssetsBtnAuthArr();
        } else {
          const matchNode = this.$findTreeItemByName(this.searchedModel, this.deptDate);
          if (!this.fromEditUser) {
            // 默认选中搜索匹配到的第一个部门
            this.selectedKeys = matchNode ? [matchNode.id] : [];
            this.selectDeptObj = matchNode || {};
          }
          this.fromEditUser = false;
        }
        await this.getListData(1);

        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    getOrgAssetsBtnAuthArr() {
      // 非部门主管没有部门资产管理按钮权限
      if (this.userInfo.positionType !== 1) {
        return [];
      }
      const parentNode = this.$findTreeItemById(this.userInfo.orgId, this.deptDate, "children");
      const authIds = parentNode
        ? this.$conmmonMethods.generateList([parentNode]).map(i => {
            return i.orgType !== 2 && i.id;
          })
        : [];
      return authIds;
    },
    initTreeData(data) {
      data.map(item => {
        item.scopedSlots = { title: "nodeTitle" };
        if (item.children && item.children.length) {
          this.initTreeData(item.children);
        }
      });
      return data;
    },
    // 翻页
    changeTable(pagination, filters, sorter) {
      this.getListData(pagination.current);
    },
    // 选中tree事件
    onSelect(value, event) {
      // console.log(event.node.dataRef);
      if (!event.selected) {
        return;
      }
      this.selectDeptObj = event.node.dataRef;
      this.selectedKeys = [this.selectDeptObj.id];
      this.getListData(1);
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 查询树节点
    async onDepartSearch(org) {
      const value = org || "";

      await this.getSetOrgTree("init");
      const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some(item => item.id === key)) {
              parentKey = node.id;
            } else if (getParentKey(key, node.children)) {
              parentKey = getParentKey(key, node.children);
            }
          }
        }
        return parentKey;
      };
      if (!value && !this.searchedModel) {
        Object.assign(this, {
          expandedKeys: [],
          autoExpandParent: true
        });
        return;
      }
      const expandedKeys = this.deptAllDate
        .map(item => {
          if (item.name.indexOf(value) > -1) {
            return getParentKey(item.id, this.deptDate);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      // console.warn(expandedKeys);
      Object.assign(this, {
        expandedKeys,
        autoExpandParent: true
      });
    },
    // 打开组织框
    openDept(type, row) {
      this.selectDeptObj = row.dataRef;
      this.deptTitle = type;
      if (type === "ADD") {
        this.deptForm = {};
      }
      if (type === "EDIT") {
        this.deptForm = JSON.parse(JSON.stringify(row.dataRef));
      }
      this.isDeptFormVisible = true;
      // this.userForm = resetUserForm()
    },
    // 提交
    onDeptSubmit() {
      this.$refs.deptForm.validate(async valid => {
        if (!valid) {
          return;
        }
        try {
          this.loading = true;
          const params = {
            orgId: this.selectDeptObj.id,
            orgName: this.deptForm.name
          };
          const res = this.deptTitle === "ADD" ? await addOrgNode(params) : await editOrgNode(params);
          if (res.code === 200) {
            this.firstGetOrgTree = true;
            this.getSetOrgTree();
            this.isDeptFormVisible = false;
            this.$message({
              type: "success",
              message: "操作成功"
            });
          }
        } catch (error) {
          this.loading = false;
        }
      });
    },
    // 移除树结构
    onDeleteTree(scope) {
      const _this = this;
      this.$confirm({
        title: "移除部门",
        content: "移除部门后，部门内所有成员都将被放置到未分配部门，该部门的所有数据使用权将被移除",
        centered: true,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          const params = { orgId: scope.id };

          deleteOrgNode(qs.stringify(params)).then(res => {
            if (res.code === 200) {
              _this.firstGetOrgTree = true;
              _this.getSetOrgTree();
              _this.$message.success("删除成功");
            }
          });
        },
        onCancel() {}
      });
    },
    // 打开弹框(添加、编辑)
    openModal(type, row) {
      this.userTitle = type;
      if (type === "ADD") {
        this.userForm = resetUserForm();
      }
      if (type === "EDIT") {
        // this.userForm.;
        (this.userForm.userName = row.userName),
          (this.userForm.password = row.password),
          (this.userForm.loginName = row.loginName),
          (this.userForm.orgId = row.orgId),
          (this.userForm.positionType = row.positionType),
          (this.userForm.id = row.id),
          (this.userForm.nodeType = row.nodeType),
          (this.userForm.roleNames = row.roleNames),
          (this.userForm.roleIds = row.roleNames
            ? row.roleNames.map(item => {
                return item.roleId;
              })
            : []);
      }
      this.isUserFormVisible = true;
    },
    // 提交
    onSubmit() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) {
          return;
        }

        if (this.userTitle === "ADD") {
          this.$gaEvent("userManage", "function", "Company part_Add mumber button_finish button_Click");
        } else {
          this.$gaEvent("userManage", "function", "Company part_Mumber list_edit_finish button_Click");
        }

        try {
          this.loading = true;
          const params = Object.assign({}, this.userForm);
          if (this.userTitle === "ADD") {
            params["password"] = this.$getRsaCode(this.$trim(this.userForm.password));
          }
          const res = this.userTitle === "ADD" ? await addOrgUser(params) : await updateUser(params);
          if (res.code === 200) {
            this.isUserFormVisible = false;
            this.fromEditUser = true;
            this.getSetOrgTree();
            this.$message.success("操作成功");
          }
        } catch (error) {
          this.loading = false;
        }
      });
    },
    setModalCancel(form) {
      if (form === "deptForm") {
        this.$refs.deptForm.resetFields();
        this.isDeptFormVisible = false;
      }
      if (form === "userForm") {
        this.$refs.userForm.resetFields();
        this.isUserFormVisible = false;
      }
    },
    getPopupContainer($event) {
      return $event.parentElement;
    },
    showQuitModal(row, type) {
      this.quitType = type;
      this.isOpenQuitModal = true;
      this.currentOptUser = row.loginName;
      this.currentOptUserId = row.id;
    },
    closeQuitModal() {
      this.isOpenQuitModal = false;
    },
    async getInviteUrl() {
      const res = await getInviteMemberUrl();
      this.inviteUrl = res.data;
    },
    handleCancel(e) {
      this.inviteModalVisible = false;
    },
    refreshListData() {
      this.getSetOrgTree();
      this.getListData(this.pagination.current);
    },
    changeSearchSelect() {
      this.searchModel = "";
    },
    handleSearch() {
      this.loading = true;
      this.searchedModel = this.searchModel;
      if (this.selectValue === "depart") {
        this.onDepartSearch(this.searchedModel);
      } else {
        // 重置部门树
        this.onDepartSearch();
      }
    },
    fillterFUN(searchVal, treeNode) {
      return treeNode.data.props.title.includes(searchVal);
    }
  }
};
</script>

<style lang="scss">
.user_manage {
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: column;
  div[class^="title"] {
    text-align: left;
  }
  .search-box {
    flex-flow: nowrap;
    margin-bottom: 15px;
  }
  .userContent {
    flex: 1;
    overflow: hidden;
  }
  .ant-input-search-button {
    width: 60px;
    .anticon-search {
      font-size: 20px;
    }
  }
  .ant-card-body {
    padding: 10px 20px 0;
    .deptTree_search {
      position: sticky;
      top: 0px;
      padding: 20px 0;
      background: #fff;
      z-index: 1;
    }
    .deptTree {
      .treeNode {
        width: 100%;
        display: flex;
        .first_child {
          padding-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
        .btn {
          padding-left: 10px;
          display: none;
        }
        &:hover {
          .btn {
            display: block;
          }
        }
      }
    }
  }
  .authority {
    .ant-card-head-title {
      padding: 8px 0;
      .title {
        line-height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .ant-card-body {
      padding: 0px 0 0 0;
      justify-content: space-between;
    }
    .ant-table-body {
      overflow-x: auto;
      @include scroll-bar(5px);
    }
  }
  .opt-btn {
    margin-right: 30px;
    &:last-child {
      margin-right: 0;
    }
    &.more {
      color: #999999;
      &:hover {
        color: $color-blue;
      }
    }
  }
}
.invite-modal-wrapper {
  .ant-modal {
    width: 640px !important;
  }
  .ant-modal-body {
    height: 200px;
    padding: 20px 30px;
  }
  .invite-content {
    .title {
      display: flex;
      h4 {
        color: #333333;
        line-height: 18px;
      }
      i {
        cursor: pointer;
        color: #99aac1;
        font-size: 14px !important;
        position: relative;
        top: 2px;
      }
    }
    .invite-link {
      display: flex;
      .ant-input {
        width: 424px;
        height: 34px;
      }
      .copyUrl-btn {
        width: 106px;
        height: 34px;
      }
    }
    p {
      font-size: 12px;
      color: #999999;
      line-height: 18px;
    }
  }
}
.ant-popover.invite-popover {
  .ant-popover-inner-content {
    width: 144px;
    height: 66px;
    padding: 8px 10px;
    p {
      font-size: 12px;
      color: #666666;
      line-height: 16px;
    }
  }
}
.ant-popover.positionType-popover {
  .ant-popover-inner-content {
    width: 240px;
    height: 50px;
    padding: 8px 10px;
    p {
      font-size: 12px;
      color: #333;
      line-height: 16px;
    }
  }
}
.form-tip-icon {
  color: #999;
  vertical-align: inherit;
  position: relative;
  top: 1px;
  cursor: pointer;
}
</style>
