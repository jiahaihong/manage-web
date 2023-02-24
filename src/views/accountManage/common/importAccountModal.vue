<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:38:21
 * @LastEditTime: 2023-02-22 14:40:38
 * @LastEditors: Please set LastEditors
 * @Description: 导入账号
-->
<template>
  <div class="importAccountModal">
    <el-dialog
      :visible.sync="isVisible"
      width="600px"
      title="导入账号"
      @open="OpenDialog"
      @closed="ClosedDialog"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-position="left"
        label-width="110px"
      >
        <el-form-item
          label="账号ID"
          prop="file"
          :rules="$setRules({ message: '请上传相关附件！'})"
        >
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-col :span="20">
              <upload-file
                v-if="isVisible"
                ref="uploadFile"
                accepts=".xlsx,.xls,.csv"
                info="只能上传 xlsx/xls/csv 格式文件且大小不超过5M"
                :size="5"
                @onFileChange="handleUploadChange"
              />
            </el-col>
            <el-col :span="4">
              <span
                style="cursor: pointer;color: #409EFF"
                @click="downloadExcel"
              >下载模板</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="渠道"
          prop="channelId"
          :rules="$setRules({ message: '请选择渠道！'})"
        >
          <el-select
            v-model="formData.channelId"
            style="width: 100%"
            filterable
            default-first-option
            placeholder="选择渠道"
            clearable
            remote
            :remote-method="getchannelList"
            @focus="getchannelList('')"
          >
            <el-option
              v-for="(k) in channelList"
              :key="k.value"
              :label="k.label"
              :value="k.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isVisible = false">
          取消
        </el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          @click="submitForm"
        >
          确定保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @description: 文件类型
 * @param {*}
 * @return {*}
 */
const fileType = {
  TTK: 'TIKTOK_ACCOUNT',
  KSS: 'KSS_ACCOUNT',
  JTT: 'JTT_ACCOUNT',
  BIN: 'BIN_ACCOUNT',
  QCC: 'QCC_ACCOUNT',
  GDT: 'GDT_ACCOUNT',
  common: 'ACCOUNT'
}
import { importAccount, searchManualMatchChannel } from '@/api/account'
import { downloadExcelTemplate } from "@/api/common";
export default {
  props: {
    dialogData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: false,
      queryIsLoading: false,
      isLoading: false,
      formData: {
        file: "",
        channelId: ""
      },
      selectProductName: [],
      channelList: []
    }
  },
  computed: {
    permissionButtons() {
      return this.$route.meta.permissionButtons || []
    },
    mediaData() { // 平台
      const result = this.$store.state.common.PlatFormAllList.find(item => item.mediaCode === this.$route.name)
      return result || {}
    },
  },
  methods: {
    OpenDialog() {
      this.getchannelList()
    },
    ClosedDialog() {
      // vue 重置data数据
      Object.assign(this.$data, this.$options.data())
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
    },
    // 上传数据文件
    async handleUploadChange(file) {
      this.formData.file = file
      this.$refs.formData.validateField('file')
    },
    // 获取渠道列表
    async getchannelList(queryString = '') {
      try {
        const res = await searchManualMatchChannel({
          channelIdOrName: queryString,
          platform: this.mediaData.id
        })
        if (!Array.isArray(res.data)) {
          throw new Error('数据为空')
        }
        this.channelList = res.data.map(e => ({
          value: e.channelId,
          label: `${e.channelId}-${e.channelName}`
        }));
      } catch (error) {
        this.channelList = []
      }
    },
    // 下载模板
    async downloadExcel() {
      try {
        const type = fileType[this.$route.name] || fileType.common
        const res = await downloadExcelTemplate({ type })
        this.$ExportXLSX(res.data || [], '媒体账号导入模板.xlsx', {
          SheetName: '媒体账号'
        })
      } catch (error) {
        console.warn(error)
      }
    },
    async submitForm() {
      try {
        await this.$refs.formData.validate()
        this.isLoading = true
        try {
          const form = new FormData();
          Object.keys(this.formData).forEach(t => {
            form.append(t, this.formData[t]);
          })
          form.append('mediaCode', this.$route.name);
          const res = await importAccount(form)
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.isVisible = false
          this.$emit('success')
        } catch (error) {
          console.log('[submitForm]', error)
        }
        this.isLoading = false
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

