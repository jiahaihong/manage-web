<!--
 * @Author: your name
 * @Date: 2022-01-12 12:05:36
 * @LastEditTime: 2022-08-25 19:06:39
 * @LastEditors: Please set LastEditors
 * @Description: 标记账号运营类型
-->
<template>
  <div class="markAccountDialog">
    <el-dialog
      :visible.sync="visible"
      width="1000px"
      title="标记账号运营类型"
      class="el_dialog"
      @open="OpenDialog"
      @closed="CloseDialog"
    >
      <el-tabs
        v-model="currentTab"
        @tab-click="tabsClick"
      >
        <el-tab-pane
          label="标记操作"
          name="1"
        >
          <!-- 转移操作内容 -->
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
                  搜索选择账号
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
                      info="只能上传 xlsx/xls 格式文件"
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
                    :max-height="300"
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
                label="选择账号"
                prop="accountIds"
                :rules="$setRules({ message: '请选择账号'})"
              >
                <el-select
                  v-model="formData.accountIds"
                  filterable
                  default-first-option
                  placeholder="请选择"
                  clearable
                  style="width:380px"
                  remote
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
              </el-form-item>
              <el-form-item
                label="设置类型"
                prop="operatingType"
                :rules="$setRules({ message: '请设置类型'})"
              >
                <el-select
                  v-model="formData.operatingType"
                  placeholder="选择运营类型"
                  clearable
                  style="width:380px"
                >
                  <el-option
                    v-for="(item) in operatingTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item
              label="相关附件"
            >
              <upload-file
                ref="uploadFile"
                v-model="formData.fileName"
                @onFileChange="onFileChange"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="操作记录"
          name="2"
        >
          <div class="global-module table-paddings">
            <el-table
              :data="listData.info"
              class="table-fixed"
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
              :current-page="listData.pageNo"
              :page-size.sync="listData.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              @size-change="getList(1)"
              @current-change="getList"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <div
        v-if="currentTab === '1'"
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
      type="markAccount"
    />
  </div>
</template>
<script>
import { uploadFile, downloadExcelTemplate } from "@/api/common";
import accountTabelModal from "./accountTabelModal";
import {
  getModifyOperatingTypeLog,
  getAccountList,
  exportModifyAccountStatusResult,
  importModifyAccountList,
  modifyAccountOperatingType,
} from "@/api/account";

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
  inject: ['operatingTypeAll', 'operatingTypeOptions'],
  props: {
    modalData: Object
  },
  data() {
    return {
      downloadType: 'UPDATE_OPERATING_TYPE', // 页面标记
      isLoading: false,
      visible: false,
      accountList: [], // 账号列表

      currentTab: '1',
      importMethods: 1,

      formData: {
        accountIds: [], // 账号数组
        operatingType: '', // 运营类型
        fileName: '', // 上传文件名
        filePath: '', // 上传文件路径
        tableList: [], // 导入数据文件名(前端字段)
      },
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
    tableColumn() {
      return Object.freeze([
        {
          label: "账号ID（此处最多回显20条数据）",
          prop: "accountId",
          width: 230,
        },
        {
          label: "运营类型",
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
    // 获取账号列表
    async getAccountInfoList(query) {
      try {
        const res = await getAccountList({
          needAuth: false,
          mediaCode: this.$route.name,
          accountId: query
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
        form.append("bindAdvertiser", false);
        form.append("type", this.downloadType);
        const res = await importModifyAccountList(form);

        const { accountModifyMap, ...last } = res.data
        this.accountPatams = { ...last, accountModifyMap: accountModifyMap || [] }
        this.formData.tableList = accountModifyMap || []
      } catch (error) {
        this.formData.tableList = [];
        this.accountPatams = initAccountPatams()
        this.$refs.uploadDataFile.handleDeleteFile()
      }
      this.$refs.formData.validateField("tableList");
    },
    // 相关附件
    async onFileChange(file) {
      try {
        if (!file) {
          this.formData.filePath = '';
          this.$refs.formData.validateField("fileName");
          return;
        }
        const form = new FormData();
        form.append("file", file);
        const res = await uploadFile(form);
        this.formData.filePath = res.data.fileUrl
        this.$refs.formData.clearValidate('fileName');
      } catch (error) {
        this.formData.filePath = '';
      }
    },
    // 下载模板
    downloadExcelTemplate() {
      downloadExcelTemplate({ type: this.downloadType }).then((res) => {
        if (res.code === 200) {
          this.$ExportXLSX(res.data || [], '标记账号运营类型上传模板.xlsx')
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
        const { operatingType, accountIds, fileName, filePath } = this.formData
        const params = {
          mediaCode: this.$route.name,
          fileName,
          filePath
        }

        if (this.importMethods == 1) {
          params.key = this.accountPatams.exportResultKey
        } else if (this.importMethods == 2) {
          params.operatingType = operatingType;
          params.accountIds = accountIds;
        }

        this.isLoading = true
        await modifyAccountOperatingType(params)
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
        this.listData.pageNo = page
        const params = {
          mediaCode: this.$route.name,
          pageSize: this.listData.pageSize,
          pageNo: this.listData.pageNo,
        };
        const res = await getModifyOperatingTypeLog(params)
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
      this.accountData = row;
      this.$refs.accountTabelModal.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
