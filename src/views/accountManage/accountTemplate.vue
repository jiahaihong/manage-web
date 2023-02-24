<!-- 账号页面模板 -->
<template>
  <div class="app-container accountTemplate">
    <div>
      <div class="global-search">
        <el-form
          class="flex"
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
                  style="width: 100%"
                  placeholder="请输入内容"
                  clearable
                >
                  <el-select
                    slot="prepend"
                    v-model="searchForm.type"
                    style="width: 140px"
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
              <el-select
                v-model="searchForm.status"
                placeholder="请选择账号状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col
              v-if="['BIN'].includes(routeName)"
              :span="4"
            >
              <el-select
                v-model="searchForm.accountStatus"
                placeholder="请选择媒体平台账号状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in accountStatusList"
                  :key="item.accountStatus"
                  :label="item.accountStatusDesc"
                  :value="item.accountStatus"
                />
              </el-select>
            </el-col>
            <el-col
              v-if="permissionButtons.includes('modifyAccountOperating')"
              :span="3"
            >
              <el-select
                v-model="searchForm.operatingType"
                placeholder="请选择运营类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in operatingTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
        <el-button
          v-show="permissionButtons.includes('bindAccount')"
          type="primary"
          @click="openRelation()"
        >
          {{ functionCodesOptions.bindAccount }}
        </el-button>
        <el-button
          v-show="permissionButtons.includes('modifyAccountStatus')"
          size="small"
          @click="openEditAccountStatus()"
        >
          {{ functionCodesOptions.modifyAccountStatus }}
        </el-button>

        <el-button
          v-show="permissionButtons.includes('modifyAccountOperating')"
          @click="openMarkAccountDialog()"
        >
          {{ functionCodesOptions.modifyAccountOperating }}
        </el-button>
        <el-button
          v-show="routeName === 'GGL' && permissionButtons.includes('updateDivisionId')"
          @click="openUpdateDicisionId()"
        >
          {{ functionCodesOptions.updateDivisionId }}
        </el-button>

        <el-button
          v-show="routeName === 'GGL' && permissionButtons.includes('updateParentId')"
          @click="openUpdateParentId()"
        >
          {{ functionCodesOptions.updateParentId }}
        </el-button>
        <el-button
          v-show="permissionButtons.includes('modifyAccountAdType')"
          @click="openUpdateAdvDialog()"
        >
          {{ functionCodesOptions.modifyAccountAdType }}
        </el-button>
        <el-button
          v-show="permissionButtons.includes('modifyAccountBc')"
          @click="openAccountBcType()"
        >
          {{ functionCodesOptions.modifyAccountBc }}
        </el-button>
        <el-button
          v-show="permissionButtons.includes('modifyAccountDomain')"
          @click="openAccountDomain()"
        >
          {{ functionCodesOptions.modifyAccountDomain }}
        </el-button>
        <div style="float: right">
          <el-button
            v-show="permissionButtons.includes('importAccount')"
            @click="handleOnSelectFile"
          >
            {{ functionCodesOptions.importAccount }}
          </el-button>
          <el-button
            v-show="permissionButtons.includes('exportAccount')"
            :loading="isExportLoading"
            @click="handleExport()"
          >
            {{ functionCodesOptions.exportAccount }}
          </el-button>
        </div>
      </div>
      <div class="global-module">
        <el-table
          ref="multipleTable"
          v-loading="isLoading"
          class="table-fixed"
          :data="listData.info"
          style="width: 100%"
          border
          size="small"
        >
          <template v-for="col in tableColumn">
            <el-table-column
              :key="col.prop"
              :fixed="col.fixed"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :render-header="col['render-header']"
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
          @size-change="getList(1, $event)"
          @current-change="getList"
        />
      </div>
    </div>

    <!-- 关联账户 -->
    <BindModal
      ref="BindModal"
      @submit="handleSearch()"
    />

    <!-- 修改账号状态 -->
    <modifyAccountStatusModal
      ref="modifyAccountStatusModal"
      :modal-data="modalData"
      @submit="handleSearch()"
    />

    <!-- 标记账号状态 -->
    <markAccountDialog
      ref="markAccountDialog"
      :modal-data="modalData"
      @submit="handleSearch()"
    />

    <!-- 查看变更记录 -->
    <changeRecordModal
      ref="changeRecordModal"
      :modal-data="modalData"
    />

    <!-- 更新DivisionId -->
    <updateDivisionModal
      ref="updateDivisionModal"
      @submit="handleSearch()"
    />

    <!-- 更新ParentId -->
    <updateParentIdModal
      ref="updateParentIdModal"
      @submit="handleSearch()"
    />

    <!-- 更新DivisionId -->
    <modifyAccountDialog
      ref="modifyAccountDialog"
      :dialog-data="dialogData"
      @success="handleSearch()"
    />

    <!-- 导入账号 -->
    <importAccountModal
      ref="importAccountModal"
      :dialog-data="dialogData"
      @success="handleSearch()"
    />

    <!-- 更新广告类型 -->
    <modifyAccountAdType
      ref="modifyAccountAdType"
      :dialog-data="dialogData"
      @success="handleSearch()"
    />

    <!-- 更新tictiK的BC -->
    <modifyAccountBc
      ref="modifyAccountBc"
      :dialog-data="dialogData"
      @success="handleSearch()"
    />
    <!-- 更新tictiK的BC -->
    <modifyAccountDomain
      ref="modifyAccountDomain"
      :dialog-data="dialogData"
      @success="handleSearch()"
    />
  </div>
</template>

<script>
import accountMixin from "./accountMixin";
import { getAccountList } from "@/api/account";

import { functionCodesOptions } from "@/views/systemManage/platformConfig.js";

export default {
  mixins: [accountMixin],
  data() {
    return {
      functionCodesOptions: Object.freeze(functionCodesOptions),
      searchForm: {
        type: "accountId",
        content: undefined,
        operatingType: undefined,
        status: undefined,
        accountStatus: undefined
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
    // 特殊媒体
    isBindAccount() {
      return ["FBK", "GGL", "JTT"];
    }
  },
  created() {
    if (this.$route.query.advertiserIdOrName) {
      this.searchForm.type = "advertiserIdOrName";
      this.searchForm.content = this.$route.query.advertiserIdOrName;
    }
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.searchParams = this.$deepcopy(this.searchForm);
      this.getList(1);
    },
    async getList(page = 1) {
      try {
        this.listData.pageNo = page;
        const { type, content, status, ...last } = this.searchParams;
        const params = {
          pageSize: this.listData.pageSize,
          pageNo: page,
          mediaCode: this.$route.name,
          ...last
        };

        if (type && content) {
          if (type === "bmId") {
            const ck = Number(content);
            if (Number.isNaN(ck)) {
              this.$message.error("BM ID必须是数字类型");
              return;
            }
            params[type] = ck;
          } else {
            params[type] = content;
          }
        }
        if (status) {
          params.status = status;
        }
        this.isLoading = true;
        const res = await getAccountList(params);
        this.listData.info = res.data.dataList || [];
        this.listData.total = res.data.total;
      } catch (error) {
        this.listData.info = [];
        this.listData.total = 0;
        console.warn(error);
      }
      this.isLoading = false;
    }
  }
};
</script>
<style lang="scss">
.accountTemplate {
  .flex-bettween {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
