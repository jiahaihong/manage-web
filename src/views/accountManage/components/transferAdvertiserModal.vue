<!--
 * @Author: gerorge.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-01-31 15:01:33
 * @LastEditors: Please set LastEditors
 * @Description: 账号转移财务ID 弹窗
-->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="1000px"
      title="账号转移财务ID"
      @open="OpenDialog"
      @close="ClosedDialog"
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
              @change="ClosedDialog"
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
            key="batchImport"
          >
            <el-form-item
              label="数据文件"
              prop="tableList"
              :rules="$setRules({ message: '请导入账号数据'})"
            >
              <el-row>
                <el-col :span="15">
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
              <div class="global-module">
                <el-table
                  :data="accountPatams.linkedAccountBos"
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
                  账号总数: {{ accountPatams.allAccountCount }}
                </el-col>
                <el-col :span="6">
                  数据有误的账号: {{ accountPatams.notFoundAccountCount }}
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="primary"

                    size="mini"
                    @click="advExportAnalysisData"
                  >
                    导出
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>

          <!-- 搜索选择账号 -->
          <div
            v-if="importMethods === 2"
            key="searchSelect"
          >
            <el-form-item
              label="转出财务ID"
              prop="advertiserIdOut"
              :rules="$setRules({ message: '转出财务ID不能为空！'})"
            >
              <el-select
                v-model="formData.advertiserIdOut"
                filterable
                default-first-option
                placeholder="搜索选择财务ID"
                style="width: 400px;"
                remote
                :remote-method="getAdvertiserList"
                @focus="getAdvertiserList('')"
                @change="AdvertiserChange()"
              >
                <el-option
                  v-for="t in advertiserList"
                  :key="t.advertiserId"
                  :label="`${t.advertiserId}-${t.advertiserName}`"
                  :value="t.advertiserId"
                  :disabled="t.advertiserId === formData.advertiserIdIn"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="媒体"
              prop="mediaCode"
              :rules="$setRules({ message: '媒体不能为空！'})"
            >
              <el-select
                v-model="formData.mediaCode"
                filterable
                placeholder="选择媒体"
                style="width: 400px;"
                @change="AdvertiserChange()"
              >
                <el-option
                  v-for="item in PlatFormAllList"
                  :key="item.mediaCode"
                  :label="item.mediaName"
                  :value="item.mediaCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="选择账号"
              prop="accountId"
              :rules="{
                required: !formData.isAll,
                message: '请选择账号',
                trigger: 'blur',
              }"
            >
              <el-row>
                <el-col :span="11">
                  <el-select
                    v-model="formData.accountId"
                    filterable
                    default-first-option
                    placeholder="请选择"
                    multiple
                    clearable
                    style="width:380px"
                    :disabled="Boolean(formData.isAll) || !formData.advertiserIdOut"
                    remote
                    :loading="isAccountLoading"
                    :remote-method="getAccountInfoList"
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
                    :disabled="!formData.advertiserIdOut"
                    :true-label="1"
                    :false-label="0"
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
              label="转入财务ID"
              prop="advertiserIdIn"
              :rules="$setRules({ message: '转入财务ID不能为空！'})"
            >
              <el-select
                v-model="formData.advertiserIdIn"
                filterable
                default-first-option
                placeholder="搜索选择财务ID"
                style="width: 400px;"
                remote
                :remote-method="getAdvertiserList"
                @focus="getAdvertiserList('')"
              >
                <el-option
                  v-for="t in advertiserList"
                  :key="t.advertiserId"
                  :label="`${t.advertiserId}-${t.advertiserName}`"
                  :value="t.advertiserId"
                  :disabled="t.advertiserId === formData.advertiserIdOut"
                />
              </el-select>
              <el-tooltip content>
                <div slot="content">
                  选择账号要迁移到的目标财务ID，确认转移
                  <br>后，结算账单时迁移账号的花费就会自动归属
                  <br>为目标财务ID
                </div>
                <i
                  class="el-icon-question"
                  style="margin-left: 10px;font-size: 18px"
                />
              </el-tooltip>
            </el-form-item>
          </div>

          <el-form-item
            label="转移说明"
            prop="transferDescription"
            :rules="$setRules({ message: '请输入转移说明'})"
          >
            <el-input
              v-model="formData.transferDescription"
              placeholder="请输入转移说明"
              type="textarea"
              :rows="2"
              style="width: 400px"
              clearable
            />
          </el-form-item>
          <el-form-item
            v-if="visible"
            label="相关附件"
          >
            <upload-file
              ref="uploadFile"
              :file-names="formData.fileName"
              :loading="isUploadLoading"
              @onFileChange="onFileChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="SubmitForm"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { downloadExcelTemplate, uploadFile, fuzzyQueryAccountIdOrName } from "@/api/common";
import { fuzzySearchAllAdvertiser } from "@/api/advertise";
import {
  submitExchangeAdvertiser,
  getAdvAccountNumberByMedia,
  batchAdvertiserDataAnalysis,
  advExportAnalysisData
} from "@/api/account";

const initAccountPatams = () => ({
  notFoundAccountCount: 0, // 系统中不属于当前财务ID的账号
  allAccountCount: 0, // 账号总数
  key: "",
  linkedAccountBos: [],
})

export default {
  props: {},
  data() {
    return {
      downloadType: 'UPDATE_ACCOUNT_ADV', // 页面标记
      visible: false,
      isLoading: false,
      isAccountLoading: false,
      isUploadLoading: false,
      importMethods: 1,

      advertiserList: [], // 财务ID列表

      formData: {
        mediaCode: "FBK",
        advertiserIdOut: "", // 转出财务ID
        accountId: [], // 账号数组
        isAll: 0, // 是否全选
        advertiserIdIn: "", // 转入财务ID
        tableList: [], // 数据文件
        fileName: "", // 上传文件名
        filePath: "", // 上传文件路径
        transferDescription: undefined, // 数据文件
      },

      accountList: [], // 账号列表
      accountPatams: initAccountPatams(),
      accountNum: 0,

    };
  },
  computed: {
    PlatFormAllList() { // 平台
      return this.$store.state.common.PlatFormAllList
    },
    PlatFormCodeAllObj() { // 平台
      return this.$store.state.common.PlatFormAllList.reduce((tot, t) => {
        tot[t.mediaCode] = t.mediaName;
        return tot
      }, {})
    },
    tableColumn() {
      const _this = this
      return Object.freeze([
        {
          label: "媒体（此处最多回显20条数据）",
          prop: "mediaCode",
          width: 200,
          formatter: (row) => {
            return _this.PlatFormCodeAllObj[row.mediaCode] || row.mediaCode;
          }
        },
        {
          label: "账号ID",
          prop: "accountId",
          width: 100,
        },
        {
          label: "转出财务ID",
          prop: "advertiserIdOut",
        },
        {
          label: "转入财务ID",
          prop: "advertiserIdIn"
        },
      ])
    }
  },
  methods: {
    // 打开前回调
    OpenDialog() {
      this.importMethods = 1;
    },
    // 重置 数据
    ClosedDialog() {
      // eslint-disable-next-line
      const { visible, importMethods, ...last } = this.$options.data()
      // vue 重置data数据
      Object.assign(this.$data, { ...last })

      if (this.$refs.uploadDataFile) {
        this.$refs.uploadDataFile.handleDeleteFile();
      }
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.handleDeleteFile();
      }
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      })
    },
    // 获取财务ID列表
    async getAdvertiserList(query) {
      try {
        const res = await fuzzySearchAllAdvertiser({ advertiserName: query })
        this.advertiserList = res.data || [];
      } catch (error) {
        this.advertiserList = [];
      }
    },
    // 修改财务ID后事件
    async AdvertiserChange() {
      try {
        this.getAccountInfoList('')
        // 查询某个财务ID下账号数量
        const res = await getAdvAccountNumberByMedia({
          advertiserId: this.formData.advertiserIdOut,
          media: this.formData.mediaCode,
        })
        this.accountNum = res.data || 0;
      } catch (error) {
        this.accountNum = 0
      }
    },
    // 获取账号列表
    async getAccountInfoList(query) {
      try {
        this.isAccountLoading = true;
        const res = await fuzzyQueryAccountIdOrName({
          mediaCode: this.formData.mediaCode,
          accountIdOrName: query,
          advertiserIdOrName: this.formData.advertiserIdOut
        })
        this.accountList = res.data || [];
        this.isAccountLoading = false;
      } catch (error) {
        this.accountList = [];
        this.isAccountLoading = false;
      }
    },

    // 相关附件
    async onFileChange(file) {
      try {
        if (!file) {
          this.formData.fileName = "";
          this.formData.filePath = "";
          this.$refs["formData"].validateField("fileName");
          return;
        }
        const form = new FormData();
        form.append("file", file);
        this.isUploadLoading = true
        const res = await uploadFile(form);

        this.formData.fileName = res.data.fileName;
        this.formData.filePath = res.data.fileUrl;
      } catch (error) {
        this.formData.fileName = "";
        this.formData.filePath = "";
      }
      this.isUploadLoading = false
      this.$refs["formData"].clearValidate("fileName");
    },

    // 下载模板
    downloadExcelTemplate() {
      downloadExcelTemplate({ type: this.downloadType }).then(res => {
        if (res.code === 200) {
          this.$ExportXLSX(res.data || [], "账号批量导入模板.xlsx");
        }
      });
    },
    // 数据文件上传
    async UploadAccountChange(file) {
      try {
        if (this.$isEmpty(file)) {
          throw new Error('无需执行')
        }
        const form = new FormData();
        form.append("file", file);
        form.append("mediaCode", this.formData.mediaCode);
        const res = await batchAdvertiserDataAnalysis(form);

        const { linkedAccountBos, ...last } = res.data;
        this.accountPatams = {
          ...last, linkedAccountBos: linkedAccountBos || []
        };
        this.formData.tableList = linkedAccountBos || [];
      } catch (error) {
        console.warn('数据文件上传-UploadAccountChange', error)
        this.formData.tableList = [];
        this.accountPatams = initAccountPatams();
        this.$refs.uploadDataFile.handleDeleteFile()
      }
      this.$refs.formData.validateField("tableList");
    },
    // 导出数据
    advExportAnalysisData() {
      if (this.$isEmpty(this.accountPatams.key)) {
        this.$message({
          message: "请先上传数据文件或后端未返回Key值",
          type: "error"
        });
        return;
      }
      advExportAnalysisData({ key: this.accountPatams.key }).then(file => {
        this.$CreatDownload({
          file: file,
          FileName: `账号数据分析结果.xlsx`
        });
      });
    },
    // 提交审核
    async SubmitForm() {
      try {
        if (this.isUploadLoading) {
          this.$message({
            message: "等待文件上传",
            type: "error",
          });
          return
        }
        await this.$refs.formData.validate();
        const {
          tableList, // 这个不需要
          mediaCode,
          accountId,
          advertiserIdIn,
          advertiserIdOut,
          isAll,
          ...last
        } = this.formData;
        const query = {
          ...last
        };
        // 导入
        if (this.importMethods == 1) {
          query.key = this.accountPatams.key
        } else if (this.importMethods == 2) {
          // 单个转移
          query.mediaCode = mediaCode
          query.advertiserIdIn = advertiserIdIn
          query.advertiserIdOut = advertiserIdOut
          query.isAll = isAll
          // 全选
          if (query.isAll) {
            query.accountIds = []
          } else {
            query.accountIds = accountId;
            // 全选了 账号数据为空
            if (this.$isEmpty(query.accountIds)) {
              this.$message({
                message: "账号不能为空",
                type: "error",
              });
              return
            }
          }
        }

        // console.warn(query)
        this.isLoading = true;
        await submitExchangeAdvertiser(query);
        this.isLoading = false;
        this.$message({
          message: `提交审核成功`,
          type: "success"
        });
        this.$emit("submit");
        this.visible = false;
      } catch (error) {
        this.isLoading = false;
      }
    },

  }
};
</script>
<style lang="scss" scoped>
</style>
