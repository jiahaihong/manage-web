<!-- 重置密码-->
<template>
  <div class="reset-psw-modal-wrap">
    <el-dialog
      title="重置密码"
      :visible.sync="visible"
      width="800px"
      :close-on-click-modal="false"
      @open="openDialog"
      @close="closeDialog"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="formRules"
      >
        <el-form-item
          label="登录邮箱"
          label-width="120px"
          class="mb-20"
        >
          <span>{{ dialogData.loginName }}</span>
        </el-form-item>
        <el-form-item
          label="登录密码"
          label-width="120px"
          prop="password"
          class="mb-20"
        >
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入新的登录密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="visible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          确认重置
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { resetPassword } from '@/api/user'
import validate from '@/utils/validate'

const initFormData = () => {
  return {
    password: '',
  }
}

export default {
  props: {
    dialogData: Object,
  },
  data() {
    const validatePsw = (rule, value, callback) => {
      if (!validate.isPsw.test(value)) {
        callback(new Error('密码必须同时含有数字和字母，且长度在8-20位!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      formData: initFormData(),
      formRules: {
        password: [
          { required: true, trigger: 'blur', message: '请输入登录密码!' },
          { validator: validatePsw, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {},
  methods: {
    openDialog() {
      const InitForm = initFormData()
      this.formData = InitForm
      this.$nextTick(() => {
        this.$refs.formData.clearValidate()
      })
    },
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.formData.clearValidate()
        this.formData = initFormData()
      })
    },
    async submitForm() {
      await this.$refs.formData.validate()
      const params = {
        loginName: this.dialogData.loginName,
        password: this.$getRsaCode(this.formData.password),
      }
      await resetPassword(params)
      this.$message({
        message: '重置成功',
        type: 'success',
      })
      this.$emit('submit')
      this.visible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.reset-psw-modal-wrap {
  .el-input,
  .el-select,
  .el-cascader {
    width: 560px;
  }
}
</style>
