<!-- 关联新账户 -->
<template>
  <div class="modal-wrap">
    <el-dialog
      title="关联新账户"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="900px"
      :before-close="handleCancle"
      @open="OpenDialog"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="搜索选择"
          name="first"
        >
          <el-form
            ref="formData"
            :model="formData"
            label-width="120px"
            :rules="formRules"
          >
            <el-form-item
              label="选择账号"
              prop="accountIds"
            >
              <el-row>
                <el-col :span="18">
                  <el-select
                    v-model="formData.accountIds"
                    multiple
                    filterable
                    default-first-option
                    style="width:100%"
                    placeholder="支持搜索、多选"
                    remote
                    :remote-method="getUnbindAccountList"
                    :loading="isLoading"
                    @focus="getUnbindAccountList('')"
                  >
                    <el-option
                      v-for="item in unbindAccountList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-col>
                <el-col
                  :span="6"
                  align="right"
                >
                  未关联账号
                  <span style="color: #409EFF">
                    {{ unbindAccountCount }}
                  </span>个
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label="关联财务ID"
              prop="advertiserId"
            >
              <el-row>
                <el-col :span="18">
                  <el-select
                    v-model="formData.advertiserId"
                    placeholder="请选择"
                    clearable
                    remote=""
                    style="width:100%"
                    filterable=""
                    :remote-method="queryAdvertiser"
                  >
                    <el-option
                      v-for="item in advertiserList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="批量导入"
          name="second"
        >
          <el-form
            ref="formBatchData"
            :model="formBatchData"
            label-width="120px"
            :rules="formRules"
          >
            <el-row>
              <el-col :span="18">
                <el-form-item
                  label="账号数据"
                  prop="accountAdvertiserRels"
                >
                  <upload-file
                    ref="uploadFile"
                    :button="formBatchData.isLoading ? '上传中' : '选择文件'"
                    :loading="formBatchData.isLoading"
                    accepts=".xlsx,.xls"
                    info="只能上传 xlsx/xls 格式文件"
                    @onFileChange="handleUploadChange"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                align="right"
              >
                <el-button
                  type="text"
                  size="small"
                  style="font-size:14px;padding-right: 18px"
                  @click="dowaloadTem"
                >
                  下载模板
                </el-button>
              </el-col>
            </el-row>
            <el-form-item
              v-show="formBatchData.accountAdvertiserRels.length"
              label="数据载入"
            >
              <el-table
                v-loading="formBatchData.isLoading"
                :data="formBatchData.accountAdvertiserRels"
                border
                fit
                highlight-current-row
                size="mini"
                style="width:300px"
                :max-height="200"
                class="el-table-container preview-table-container"
              >
                <el-table-column
                  align="center"
                  prop="accountId"
                  label="账号ID"
                />
                <el-table-column
                  align="center"
                  prop="advertiserId"
                  label="财务ID"
                />
              </el-table>
            </el-form-item>
            <el-form-item
              v-show="formBatchData.accountAdvertiserRels.length"
              label="数据分析"
              prop="filePath"
            >
              <el-row>
                <el-col :span="7">
                  重复出现的账号：<span class="numberError">{{ formBatchData.repeatedAccountCount }}</span>
                </el-col>
                <el-col :span="7">
                  账号总数：<span class="numberColor">{{ formBatchData.allAccountCount }}</span>
                </el-col>
                <el-col :span="6">
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="!formBatchData.key"
                    @click="exportData"
                  >
                    导出分析数据
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  已被关联的账号：<span class="numberError">{{ formBatchData.linkedAccountCount }}</span>
                </el-col>
                <el-col :span="7">
                  财务ID总数：<span class="numberColor">{{ formBatchData.allAdvertiserIdCount }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  系统中未找到的账号：<span class="numberError">{{ formBatchData.notFoundAccountCount }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  系统中未找到的财务ID：<span class="numberError">{{ formBatchData.notFoundAdvertiserIdCount }}</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="isLoading"
          @click="handleCancle"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="onSubmit"
        >
          确认关联
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  getUnbindAccountCount,
  fuzzyUnbindAccount,
  bindAccount,
  batchBindAdvertiserId,
  modifyAccountBind,
  analyzeAccountInformation,
  exportAnalysisData
} from "@/api/account";
import { downloadExcelTemplate } from "@/api/common";
import { fuzzySearchAdvertiser } from "@/api/advertise"

const initPreviewData = () => {
  return {
    isLoading: false,
    accountAdvertiserRels: [],
    allAccountCount: 0, // 全部账号数量
    allAdvertiserIdCount: 0, // 全部财务ID数量
    notFoundAccountCount: 0, // 没有找到的账号数量
    linkedAccountCount: [], // 已关联
    notFoundAdvertiserIdCount: 0, //  没有找到的账号ID数量
    repeatedAccountCount: 0, // 重复的账号数量
    key: '', // 导出数据需要
  }
}

export default {
  props: {},
  data() {
    return {
      isLoading: false,
      visible: false,
      activeName: 'first',
      formData: {
        accountIds: [],
        advertiserId: "",
      },
      formBatchData: initPreviewData(),
      formRules: {
        accountAdvertiserRels: [
          { required: true, trigger: "change", message: "请导入待关联账号" }
        ],
        accountIds: [{ required: true, trigger: "change", message: "请选择账号" }],
        advertiserId: [
          { required: true, trigger: "change", message: "请选择财务ID!" }
        ],
        agentId: [{ required: true, trigger: "change", message: "请选择渠道!" }]
      },
      unbindAccountCount: 0, // 未关联账号数量
      unbindAccountList: [], // 我绑定账号数量
      advertiserList: []
    }
  },
  computed: {
    isAdd() {
      return true
    }
  },
  mounted() {
  },
  methods: {
    OpenDialog() {
      getUnbindAccountCount({ media: this.$route.name }).then(res => {
        this.unbindAccountCount = res.data || 0;
      });

      this.queryAdvertiser("");
    },
    handleCancle() {
      this.activeName = 'first'
      this.formBatchData = initPreviewData()
      this.unbindAccountCount = 0 // 未关联账号数量
      this.unbindAccountList = []
      this.advertiserList = []

      this.$refs.formData.resetFields()
      this.$refs.formBatchData.resetFields()
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.handleDeleteFile()
      }
      this.visible = false;
    },

    // 选择账号接口
    async getUnbindAccountList(query) {
      try {
        const res = await fuzzyUnbindAccount({ accountId: query, media: this.$route.name })
        this.unbindAccountList = res.data || [];
      } catch (error) {
        this.unbindAccountList = [];
      }
    },
    // 关联财务ID接口
    async queryAdvertiser(query) {
      try {
        const res = await fuzzySearchAdvertiser({ advertiserName: query })
        this.advertiserList = res.data || [];
      } catch (error) {
        this.advertiserList = [];
      }
    },
    // 账号数据
    async handleUploadChange(file) {
      if (!file) {
        this.formBatchData = initPreviewData()
        return
      }
      const form = new FormData();
      form.append("file", file);
      form.append("media", this.$route.name);
      try {
        this.formBatchData.isLoading = true;
        const res = await analyzeAccountInformation(form);
        this.formBatchData.isLoading = false;

        if (res.code === 200) {
          Object.assign(this.formBatchData, res.data)
          this.$refs.formBatchData.clearValidate("accountAdvertiserRels");
        } else {
          throw res.msg
        }
      } catch (error) {
        console.log("[previewXlsxData]", error);
        this.$refs.uploadFile.handleDeleteFile()
      }
    },
    // 下载模板
    dowaloadTem() {
      downloadExcelTemplate({ type: "BATCH_ASSOCIATED_ACCOUNT_LIST" }).then((res) => {
        if (res.code === 200) {
          this.$ExportXLSX(res.data || [], '批量关联账号列表.xlsx')
        }
      }).catch(err => console.log(err));
    },
    // 导出分析数据
    exportData() {
      exportAnalysisData({ key: this.formBatchData.key }).then((file) => {
        this.$CreatDownload({
          file: file,
          FileName: `导出分析数据.xlsx`
        })
      }).catch(err => console.log(err));
    },
    // 提交
    async onSubmit() {
      const refs = this.activeName === 'first' ? 'formData' : 'formBatchData'
      try {
        await this.$refs[refs].validate(); // 报错直接到catch
        let query = this[refs]
        if (this.activeName === 'second') {
          const {
            accountAdvertiserRels,
            notFoundAccountCount,
            notFoundAdvertiserIdCount,
            linkedAccountCount,
            repeatedAccountCount
          } = this.formBatchData
          const isSuccess = Object.values({
            notFoundAccountCount,
            notFoundAdvertiserIdCount,
            linkedAccountCount,
            repeatedAccountCount
          }).every(item => item === 0)
          console.warn('isSuccess', isSuccess)
          if (!isSuccess) {
            this.$message.warning('当前上传数据存在异常，无法上传')
            return
          }
          const len = accountAdvertiserRels.length
          await this.$confirm(`本次操作将完成${len}个账号的关联, 是否确认?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          query = accountAdvertiserRels
        } else {
          query.accountIds = query.accountIds.map(ele => ele + '');
        }

        this.isLoading = true
        if (this.isAdd) {
          const bindFuntion = this.activeName === 'first' ? bindAccount : batchBindAdvertiserId
          await bindFuntion(query, { media: this.$route.name })
        } else {
          await modifyAccountBind(query, { media: this.$route.name });
        }
        const msg = this.isAdd ? "关联成功" : "编辑成功";
        this.$message({
          message: msg,
          type: "success"
        });
        this.isLoading = false
        this.handleCancle();

        this.$emit("submit", query);
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.numberError{
  color:#f56c6c;
}
.numberColor{
  color:#0099FF;
}
.tips {
  line-height: 1;
  width: 80%;
  margin-bottom: 0;
}
</style>
