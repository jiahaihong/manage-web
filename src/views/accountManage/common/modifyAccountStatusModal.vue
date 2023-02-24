<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-08-10 11:30:29
 * @LastEditors: Please set LastEditors
 * @Description: 修改账号状态
-->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="1000px"
      title="修改账号状态"
      class="el_dialog"
      @open="OpenDialog"
      @closed="CloseDialog"
    >
      <el-tabs
        v-model="currentTab"
        @tab-click="tabsClick"
      >
        <el-tab-pane
          label="修改操作"
          name="1"
        >
          <!-- 转移操作内容 -->
          <div class="global-module">
            <el-form
              ref="formData"
              :model="formData"
              label-position="right"
              label-width="110px"
            >
              <el-form-item label="选择方式">
                <el-radio-group
                  v-model="importMethods"
                  @change="CloseDialog"
                >
                  <el-radio :label="1">
                    批量导入账号
                  </el-radio>
                  <el-radio :label="2">
                    按财务ID勾选账号
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 批量导入账号 -->
              <div
                v-if="importMethods === 1"
                key="fileAccountNameOne"
              >
                <el-form-item
                  label="数据文件"
                  prop="tableList"
                  :rules="$setRules({ message: '请导入账号数据'})"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                  >
                    <el-col :span="10">
                      <upload-file
                        ref="uploadDataFile"
                        accepts=".xlsx,.xls"
                        info="只能上传 xlsx/xls 格式文件且大小不超过5M"
                        :size="5"
                        @onFileChange="UploadAccountChange"
                      />
                    </el-col>
                    <el-col :span="2">
                      <span
                        style="cursor: pointer;color: #409EFF"
                        @click="downloadExcelTemplate"
                      >下载模板</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="数据载入">
                  <div class="global-module table-paddings">
                    <el-table
                      :data="accountPatams.accountModifyMap"
                      style="width: 70%; line-height: 26px"
                      height="300px"
                      border
                      size="small"
                    >
                      <template v-for="(col) in tableColumn">
                        <el-table-column
                          :key="col.prop"
                          :prop="col.prop"
                          :label="col.label"
                          :formatter="col.formatter"
                          :width="col.width"
                        />
                      </template>
                    </el-table>
                  </div>
                </el-form-item>
                <el-form-item label="数据分析">
                  <el-row>
                    <el-col :span="6">
                      账号总数: {{ accountPatams.accountTotalCount }}
                    </el-col>
                    <el-col :span="6">
                      数据有误的账号: {{ accountPatams.notFindAccountSize }}
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="primary"

                        size="mini"
                        @click="exportNotFoundAccounts"
                      >
                        导出
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>

              <!-- 按财务ID勾选账号 -->
              <div
                v-if="importMethods === 2"
                key="advertiserIdTwo"
              >
                <el-form-item
                  label="财务ID"
                  prop="advertiserId"
                  :rules="$setRules({ message: '财务ID不能为空！'})"
                >
                  <el-select
                    v-model="formData.advertiserId"
                    filterable
                    default-first-option
                    placeholder="搜索选择财务ID"
                    clearable
                    style="width: 380px;"
                    remote
                    :remote-method="getAdvertiserList"
                    @focus="getAdvertiserList('')"
                    @change="AdvertiserChange"
                  >
                    <el-option
                      v-for="(item, index) in advertiserList"
                      :key="index"
                      :label="`${item.advertiserId}-${item.advertiserName}`"
                      :value="item.advertiserId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="选择账号"
                  prop="accountIds"
                  :rules="{
                    required: !formData.isAll,
                    message: '请选择账号',
                    trigger: 'change',
                  }"
                >
                  <el-row>
                    <el-col :span="11">
                      <el-select
                        v-model="formData.accountIds"
                        filterable
                        default-first-option
                        placeholder="请选择"
                        clearable
                        style="width:380px"
                        remote
                        :disabled="formData.isAll || $isEmpty(formData.advertiserId)"
                        multiple
                        :remote-method="getAccountInfoList"
                        @focus="getAccountInfoList('')"
                      >
                        <el-option
                          v-for="item in accountList"
                          :key="item.accountId"
                          :label="item.accountId"
                          :value="item.accountId"
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="1">
                      <el-checkbox
                        v-model="formData.isAll"
                        :disabled="!formData.advertiserId"
                      >
                        全选
                      </el-checkbox>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      支持ID模糊搜索查找、多选
                    </el-col>
                    <el-col :span="6">
                      当前财务ID账号{{ accountNum }}个
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="设置新状态"
                  prop="status"
                  :rules="$setRules({ message: '请选择账号状态！'})"
                >
                  <el-select
                    v-model="formData.status"
                    placeholder="选择状态"
                    clearable
                    style="width: 280px;"
                  >
                    <el-option
                      v-for="(item) in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-tooltip>
                    <div slot="content">
                      正常：正常使用<br>
                      禁止充值：客户中心禁止充值<br>
                      结束合作停用：客户中心禁止充值<br>
                      违规停用：客户中心禁止充值、清除预算、禁止预算转移<br>
                      （仅Facebook、Google账号支持清除预算、禁止预算转移）
                    </div>
                    <i
                      class="el-icon-question"
                      style="margin-left: 10px;font-size: 18px"
                    />
                  </el-tooltip>
                </el-form-item>
              </div>
              <el-form-item
                label="相关附件"
                prop="fileName"
                :rules="$setRules({ message: '请上传相关附件！'})"
              >
                <upload-file
                  ref="uploadFile"
                  :file-names="formData.fileName"
                  @onFileChange="UploadfileChange"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="操作记录"
          name="2"
        >
          <div class="global-module table-paddings">
            <el-table
              :data="listData.info"
              style="width: 100%"
              border
              size="small"
            >
              <template v-for="(col) in recordColumn">
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
              :current-page="listData.pageNum"
              :page-size.sync="listData.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              @size-change="getList(1)"
              @current-change="getList"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <div
        v-if="currentTab == 1"
        slot="footer"
      >
        <el-button
          :loading="isLoading"
          @click="visible = false"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="SubmitForm"
        >
          修 改
        </el-button>
      </div>
    </el-dialog>

    <!-- 转移账号 -->
    <accountTabelModal
      ref="accountTabelModal"
      :modal-data="accountData"
      type="EditAccount"
    />
  </div>
</template>
<script>
import { uploadFile, downloadExcelTemplate } from "@/api/common";
import accountTabelModal from "./accountTabelModal";
import {
  modifyAccountStatus,
  getModifyStatusLog,
  getAccountList,
  getAdvAccountNumberByMedia,
  exportModifyAccountStatusResult,
  importModifyAccountList
} from "@/api/account";
import { fuzzySearchAllAdvertiser } from "@/api/advertise";

const initAccountPatams = () => ({
  notFindAccountSize: 0, // 系统中未找到的账号
  accountTotalCount: 0, // 账号总数
  exportResultKey: '',
  accountModifyMap: []
})

export default {
  components: {
    accountTabelModal
  },
  props: {
    modalData: Object
  },
  data() {
    return {
      downloadType: 'UPDATE_STATUS', // 页面标记
      isLoading: false,
      visible: false,
      currentTab: '1',
      importMethods: 1,

      formData: {
        advertiserId: '', // 转出财务ID
        accountIds: [], // 账号数组
        isAll: false, // 是否全选
        status: '', // 账号状态
        fileName: '', // 上传文件名
        filePath: '', // 上传文件路径
        tableList: [], // 导入数据文件名(前端字段)
      },
      advertiserList: [], // 财务ID列表
      accountList: [], // 账号列表
      accountNum: 0, // 当前财务ID账号
      accountPatams: initAccountPatams(),
      listData: {
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      accountData: {}, // 账号数据
    };
  },
  computed: {
    routeName: function() {
      return this.$route.name;
    },
    statusOptions() {
      return Object.keys(this.$enum.ACCOUNT_STATUS_MAP).map((i) => {
        return { value: +i, label: this.$enum.ACCOUNT_STATUS_MAP[i] };
      })
    },
    tableColumn() {
      return Object.freeze([
        {
          label: "账号ID（此处最多回显20条数据）",
          prop: "accountId",
          width: 230,
        },
        {
          label: "新状态",
          prop: "modifyValue",
        },
      ])
    },
    recordColumn() {
      const _this = this
      return Object.freeze([
        {
          label: "账号",
          prop: "rebate",
          formatter: (row) => {
            return (
              <el-button
                on-click={() => _this.openAccountTabelModal(row)}
                size="small"
                type="primary"
              >
                查看
              </el-button>
            )
          }
        },
        {
          label: "操作人",
          prop: "updateUser"
        },
        {
          label: "操作时间",
          prop: "createTime"
        },
        {
          label: "操作",
          prop: "filePath",
          formatter: (row) => {
            if (!row.filePath) {
              return ''
            }
            return (
              <el-button
                on-click={() => _this.DownloadFile(row)}
                size="small"
                type="primary"
              >
                凭证下载
              </el-button>
            )
          }
        }
      ])
    }
  },
  methods: {
    OpenDialog() {
      this.currentTab = '1'
      this.importMethods = 1
    },
    CloseDialog() {
      // eslint-disable-next-line
      const { visible, currentTab, importMethods, ...last } = this.$options.data()
      // vue 重置data数据
      Object.assign(this.$data, { ...last })
      if (this.$refs.uploadDataFile) {
        this.$refs.uploadDataFile.handleDeleteFile()
      }
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.handleDeleteFile()
      }
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      })
    },
    tabsClick(obj) {
      if (obj.name == '1') {
        this.CloseDialog()
      } else {
        // 操作记录
        this.getList(1)
      }
    },
    // 获取财务ID列表
    async getAdvertiserList(query) {
      try {
        const res = await fuzzySearchAllAdvertiser({ advertiserName: query })
        this.advertiserList = res.data;
      } catch (error) {
        this.advertiserList = []
      }
    },
    // 修改财务ID后事件
    async AdvertiserChange() {
      try {
        if (this.$isEmpty(this.formData.advertiserId)) {
          throw new Error('无需执行下去')
        }
        const res = await getAdvAccountNumberByMedia({
          advertiserId: this.formData.advertiserId,
          media: this.routeName
        })
        this.accountNum = res.data || 0
      } catch (error) {
        this.accountNum = 0;
      }
    },
    // 获取账号列表
    async getAccountInfoList(query) {
      try {
        const res = await getAccountList({
          mediaCode: this.$route.name,
          accountId: query,
          advertiserIdOrName: this.formData.advertiserId,
        })
        this.accountList = res.data.dataList;
      } catch (error) {
        this.accountList = []
      }
    },
    // 数据文件上传
    async UploadAccountChange(file) {
      try {
        if (this.$isEmpty(file)) {
          throw new Error('无需执行')
        }
        const form = new FormData();
        form.append("file", file);
        form.append("media", this.routeName);
        form.append("type", this.downloadType);
        const res = await importModifyAccountList(form);

        const { notFindAccountSize, accountTotalCount, exportResultKey, accountModifyMap } = res.data
        this.accountPatams = {
          notFindAccountSize, accountTotalCount, exportResultKey,
          accountModifyMap: accountModifyMap || []
        }
        this.formData.tableList = accountModifyMap || []
      } catch (error) {
        this.formData.tableList = [];
        this.accountPatams = initAccountPatams()
        this.$refs.uploadDataFile.handleDeleteFile()
      }
      this.$refs.formData.clearValidate('tableList');
    },
    // 相关附件
    async UploadfileChange(file) {
      try {
        if (!file) {
          this.formData.fileName = '';
          this.formData.filePath = '';
          this.$refs.formData.validateField("fileName");
          return;
        }
        const form = new FormData();
        form.append("file", file);
        const res = await uploadFile(form);
        this.formData.fileName = res.data.fileName
        this.formData.filePath = res.data.fileUrl
        this.$refs.formData.clearValidate('fileName');
      } catch (error) {
        this.formData.fileName = '';
        this.formData.filePath = '';
      }
    },
    // 下载模板
    downloadExcelTemplate() {
      downloadExcelTemplate({ type: this.downloadType }).then((res) => {
        if (res.code === 200) {
          this.$ExportXLSX(res.data || [], '账号更改状态.xlsx')
        }
      });
    },
    // 导出数据
    async exportNotFoundAccounts() {
      try {
        if (this.accountPatams.notFindAccountSize == 0) {
          this.$message({
            message: "暂无可导出数据",
            type: "error",
          });
          return;
        }
        const file = await exportModifyAccountStatusResult({
          key: this.accountPatams.exportResultKey
        })
        this.$CreatDownload({
          file: file,
          FileName: `上传数据分析结果.xlsx`
        })
      } catch (error) {
        console.warn(error)
      }
    },
    // 提交
    async SubmitForm() {
      try {
        await this.$refs.formData.validate();
        const { accountIds, advertiserId, filePath, status, isAll } = this.formData
        const params = {
          mediaCode: this.$route.name,
          filePath
        }

        if (this.importMethods == 1) {
          params.key = this.accountPatams.exportResultKey
        } else if (this.importMethods == 2) {
          params.advertiserId = advertiserId
          params.status = status
          params.isAll = isAll
          // 全选
          if (params.isAll) {
            params.accountIds = []
          } else {
            params.accountIds = accountIds;
            // 全选了 账号数据为空
            if (this.$isEmpty(params.accountIds)) {
              this.$message({
                message: "账号不能为空",
                type: "error",
              });
              return
            }
          }
        }

        this.isLoading = true
        await modifyAccountStatus(params)
        this.isLoading = false
        this.$message({
          message: '修改成功',
          type: "success"
        });
        this.$emit("submit");
        this.visible = false;
      } catch (error) {
        this.isLoading = false
      }
    },
    // 查询操作列表
    async getList(page = 1) {
      try {
        const params = {
          mediaCode: this.$route.name,
          pageSize: this.listData.pageSize,
          pageNo: page,
        };
        const res = await getModifyStatusLog(params)
        this.listData.info = res.data.dataList;
        this.listData.total = res.data.total;
      } catch (error) {
        this.listData.info = [];
        this.listData.total = 0;
      }
    },
    // 凭证下载
    async DownloadFile(row) {
      window.location.href = row.filePath;
    },
    // 查看账号
    openAccountTabelModal(row) {
      this.$refs.accountTabelModal.visible = true;
      this.accountData = row;
    }
  }
};
</script>
<style lang="scss" scoped>
  .table-paddings {
    padding: 0
  }

  .btn-position {
    margin-bottom: 10px;
  }

  .dialog-footer {
    float: right;
  }
</style>
