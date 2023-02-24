<!--
 * @Author: george.qiao
 * @Date: 2022-01-12 12:05:36
 * @LastEditTime: 2023-02-22 15:19:58
 * @LastEditors: Please set LastEditors
 * @Description: 更新 广点通 K框
-->
<template>
  <div class="modifyAccountAdType">
    <el-dialog
      :visible.sync="visible"
      width="1000px"
      title="更新K框"
      class="el_dialog"
      @open="OpenDialog"
      @closed="CloseDialog"
    >
      <el-tabs
        v-model="currentTab"
        @tab-click="tabsClick"
      >
        <el-tab-pane
          label="更新K框操作"
          name="1"
        >
          <!-- 转移操作内容 -->
          <el-form
            ref="formData"
            :model="formData"
            label-position="right"
            label-width="110px"
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
            <el-form-item label="相关附件">
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
              style="width: 100%"
              class="table-fixed"
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
          更 新
        </el-button>
      </div>
    </el-dialog>

    <!-- 转移账号 -->
    <accountTabelModal
      ref="accountTabelModal"
      :modal-data="accountData"
      type="modifyAccountDomain"
    />
  </div>
</template>
<script>
import { uploadFile, downloadExcelTemplate } from "@/api/common";
import accountTabelModal from "./accountTabelModal";
import {
  getModifyDomainLog,
  exportModifyAccountStatusResult,
  importModifyAccountList,
  modifyAccountDomain,
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
  props: {
    modalData: Object
  },
  data() {
    return {
      downloadType: 'UPDATE_GDT_DOMAIN', // 页面标记
      isLoading: false,
      visible: false,

      currentTab: '1',
      formData: {
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
          label: "新K框",
          prop: "modifyValue"
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
    },
    CloseDialog() {
      // eslint-disable-next-line
      const { visible, currentTab, ...last } = this.$options.data()
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
        this.formData.fileName = '';
        this.formData.filePath = '';
      }
    },
    // 下载模板
    downloadExcelTemplate() {
      downloadExcelTemplate({ type: this.downloadType }).then((res) => {
        if (res.code === 200) {
          this.$ExportXLSX(res.data || [], '更新K框上传模板.xlsx')
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
        const { fileName, filePath } = this.formData
        const params = {
          mediaCode: this.$route.name,
          key: this.accountPatams.exportResultKey,
          fileName,
          filePath
        }

        this.isLoading = true
        await modifyAccountDomain(params)
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
        const res = await getModifyDomainLog(params)
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
</style>
