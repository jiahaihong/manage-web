<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:38:21
 * @LastEditTime: 2022-06-30 16:14:53
 * @LastEditors: Please set LastEditors
 * @Description: 修改账号信息
-->
<template>
  <el-dialog
    :visible.sync="isVisible"
    width="600px"
    title="修改账号信息"
    @open="OpenDialog"
    @closed="ClosedDialog"
  >
    <el-form
      ref="formData"
      :model="formData"
      label-position="right"
      label-width="110px"
    >
      <el-form-item
        label="账号ID"
        required
      >
        {{ formData.accountId }}
      </el-form-item>
      <el-form-item
        label="账号名称"
        prop="newName"
        :rules="$setRules({message: '账号名称不能为空', trigger: 'blur', type: 'name'})"
      >
        <el-input
          v-model="formData.newName"
          :maxlength="50"
          placeholder="输入账号名称"
          type="text"
        />
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
        type="primary"
        @click="submitForm"
      >
        确定保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { modifyAccountName } from '@/api/account'
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
      formData: {
        accountId: "",
        newName: ""
      },
      queryIsLoading: false,
      selectProductName: [],
      isLoading: false
    }
  },
  computed: {
  },
  methods: {
    OpenDialog() {
      const { name, accountId } = this.dialogData
      this.formData = { accountId, newName: name }
    },
    ClosedDialog() {
      this.formData = {
        accountId: "",
        newName: ""
      }
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
    },
    async submitForm() {
      try {
        await this.$refs.formData.validate()
        this.isLoading = true
        try {
          const res = await modifyAccountName(this.formData)
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.isVisible = false
          this.$emit('success')
        } catch (error) {
          console.log('[submitForm]', error)
        }
        this.isLoading = true
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

