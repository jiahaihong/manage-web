<!-- 用户管理 外部用户 -->
<template>
  <div class="app-container external-user-manage">
    <div class="global-search">
      <el-form
        :model="searchForm"
      >
        <el-row
          type="flex"
          :gutter="5"
        >
          <el-col :span="8">
            <el-form-item label>
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
            <el-form-item label>
              <el-select
                v-model="searchForm.status"
                placeholder="在职状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              icon="el-icon-search"
              :loading="isLoading"
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
    <div class="global-button-group">
      <el-row>
        <el-col :span="4">
          <el-button
            v-show="permissionButtons.includes('addUser')"
            type="primary"
            size="small"
            :loading="isLoading"
            @click="openUserModal('add')"
          >
            创建用户
          </el-button>
        </el-col>
      </el-row>
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
        <el-table-column
          v-for="(col) in tableCol"
          :key="col.prop"
          :prop="col.prop"
          :formatter="col.formatter"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column
          label="操作"
          fixed="right"
          width="260"
        >
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              plain
              @click="openDataAuthModal(scope.row)"
              >数据权限</el-button
            >-->
            <el-button
              v-show="
                permissionButtons.includes('updateUser') &&
                  scope.row.status == 1
              "
              size="mini"
              type="primary"
              @click="openUserModal('edit', scope.row)"
            >
              编辑用户
            </el-button>
            <el-button
              v-show="
                permissionButtons.includes('resetPassword') &&
                  scope.row.status == 1
              "
              size="mini"
              type="danger"
              @click="openResetPswModal(scope.row)"
            >
              重置密码
            </el-button>
            <el-button
              v-show="
                permissionButtons.includes('resignUser') &&
                  scope.row.status == 1
              "
              size="mini"
              type="danger"
              @click="resignUser(scope.row)"
            >
              离职
            </el-button>
          </template>
        </el-table-column>
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

    <!-- 创建/编辑用户 -->
    <UserModal
      ref="userModal"
      :dialog-data="dialogData"
      :type="modalType"
      @submit="getList(listData.pageNo)"
    />

    <!-- 数据权限 -->
    <DataAuthModal
      ref="dataAuthModal"
      :dialog-data="dialogData"
    />

    <!-- 重置密码 -->
    <ResetPswModal
      ref="resetPswModal"
      :dialog-data="dialogData"
      @submit="getList(listData.pageNo)"
    />
  </div>
</template>

<script>
import { getOutUserList, userTransferAssets } from '@/api/user'
import UserModal from './components/userModal'
import DataAuthModal from './components/dataAuthModal'
import ResetPswModal from './components/resetPswModal'
export default {
  components: {
    UserModal,
    DataAuthModal,
    ResetPswModal,
  },
  data() {
    return {
      isLoading: false,
      statusOptions: Object.keys(this.$enum.ONJOB_STATUS_MAP).map((i) => {
        return { value: i, label: this.$enum.ONJOB_STATUS_MAP[i] }
      }),
      options: [
        { label: '绑定邮箱/名称', value: 'userLoginOrName' },
        { label: '所属企业', value: 'corporationCode' },
      ],
      searchForm: {
        type: 'userLoginOrName',
        content: '',
      },
      searchParams: {},
      listData: {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
      modalType: 'add',
      dialogData: {},
    }
  },
  computed: {
    permissionButtons() {
      return this.$route.meta.permissionButtons || []
    },
    tableCol() {
      const _this = this;
      const { USER_POSITION_MAP, ONJOB_STATUS_MAP } = _this.$enum
      return [
        {
          label: '登录邮箱',
          prop: 'loginName',
          width: 200,
        },
        {
          label: '用户名称',
          prop: 'userName',
          width: 120,
        },
        {
          label: '职位',
          prop: 'positionType',
          formatter: row => {
            return USER_POSITION_MAP[row.positionType]
          }
        },
        {
          label: '角色',
          prop: 'roleDtoList',
          width: 160,
          formatter: row => {
            if (_this.$isEmpty(row.roleDtoList)) {
              return
            }
            return row.roleDtoList.map(t => t.roleName).join('、')
          }
        },
        {
          label: '在职状态',
          prop: 'status',
          formatter: row => {
            return ONJOB_STATUS_MAP[row.status]
          }
        },
        {
          label: '所属企业',
          prop: 'corporationName',
          width: 240,
          formatter: row => {
            return [row.corporationCode, row.corporationName].join(' - ')
          }
        },
        {
          label: '所属部门',
          prop: 'departNames',
          width: 300,
        },
        {
          label: '注册时间',
          prop: 'createTime',
          width: 160,
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          width: 160,
        },
      ]
    }
  },
  created() {
    if (this.$route.query.corporationCode) {
      this.searchForm.type = 'corporationCode'
      this.searchForm.content = this.$route.query.corporationCode
    }
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      this.searchParams = this.$deepcopy(this.searchForm);
      this.getList()
    },
    async getList(page = 1) {
      try {
        const { pageSize } = this.listData
        const { type, content, status } = this.searchParams
        this.listData.pageNo = page
        const params = {
          pageSize, status,
          pageNo: page,
        }
        if (content) {
          params[type] = content
          /**
           * @description: 模糊查询
           * @param {*} userName 也需要赋值
           * @return {*}
           */
          if (type === 'loginName') {
            params.userName = content;
          }
        }
        this.isLoading = true
        const res = await getOutUserList(params)
        this.listData.info = (res.data.dataList || []).map(t => {
          if (!this.$isEmpty(t.orgRelDtoList)) {
            t.departIds = t.orgRelDtoList.map((i) => i.orgId)
            t.departNames = t.orgRelDtoList.map((i) => i.orgName).join(' > ')
          } else {
            t.departIds = []
            t.departNames = ''
          }
          return t
        })
        this.listData.total = res.data.total
      } catch (error) {
        this.listData.info = []
        this.listData.total = 0
      }
      this.isLoading = false
    },
    // 创建/编辑用户
    openUserModal(type, data = {}) {
      if (type === 'edit') {
        this.dialogData = this.$deepcopy(data)
      }
      this.modalType = type
      this.$refs.userModal.visible = true
    },
    // 数据权限
    openDataAuthModal(data = {}) {
      this.dialogData = this.$deepcopy(data)
      this.$refs.dataAuthModal.visible = true
    },
    // 重置密码
    openResetPswModal(data = {}) {
      this.dialogData = this.$deepcopy(data)
      this.$refs.resetPswModal.visible = true
    },
    // 离职
    resignUser(row) {
      const { loginName, orgId } = row
      const params = {
        oldUserName: loginName, curOrgId: orgId
      };
      this.$confirm("确定该成员离职吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async(action, ctx, close) => {
          try {
            if (action !== "confirm") {
              close();
              return;
            }
            ctx.confirmButtonLoading = true;
            await userTransferAssets(params);

            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getList();
            ctx.confirmButtonLoading = false;
            close();
          } catch (error) {
            ctx.confirmButtonLoading = false;
          }
        }
      });
    }
  },
}
</script>
<style lang="scss">
.external-user-manage {
}
</style>
