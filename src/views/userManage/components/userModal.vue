<!-- 创建/编辑用户-->
<template>
  <div
    :class="[
      isEdit ? 'user-modal-wrap eidt-user-modal-wrap' : 'user-modal-wrap',
    ]"
  >
    <el-dialog
      :title="modalTitle"
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
          label="用户名称"
          label-width="120px"
          prop="userName"
          class="mb-20"
        >
          <el-input
            v-model.trim="formData.userName"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="登录邮箱"
          label-width="120px"
          prop="loginName"
          class="mb-20"
        >
          <el-input
            v-model.trim="formData.loginName"
            placeholder="请输入登录邮箱"
          />
        </el-form-item>
        <el-form-item
          v-if="isEdit"
          label="登录邮箱"
          label-width="120px"
          prop="loginName"
          class="mb-20"
        >
          <span>{{ formData.loginName }}</span>
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="登录密码"
          label-width="120px"
          prop="password"
          class="mb-20"
        >
          <el-input
            v-model.trim="formData.password"
            type="password"
            placeholder="请输入登录密码"
            show-password
          />
        </el-form-item>
        <el-form-item
          v-if="isEdit"
          label="登录密码"
          label-width="120px"
          prop="password"
          class="mb-20"
          style="display:none;"
        >
          <span>{{ formData.password }}</span>
        </el-form-item>
        <el-form-item
          v-if="isEdit"
          label="在职状态"
          label-width="120px"
          class="mb-20"
        >
          <span>{{ $enum.ONJOB_STATUS_MAP[formData.status] }}</span>
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="所属企业"
          label-width="120px"
          prop="corporationCode"
          class="mb-20"
        >
          <el-select
            v-model="formData.corporationCode"
            filterable
            default-first-option
            placeholder="搜索并选择企业"
            remote
            :remote-method="getOutCorporationList"
            @focus="handleFocusCorporation"
            @change="handleChangeCorporation"
          >
            <el-option
              v-for="item in corporationList"
              :key="item.corporationCode"
              :label="item.corporationCode + ' - ' + item.corporationName"
              :value="item.corporationCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isEdit"
          label="所属企业"
          label-width="120px"
          class="mb-20"
          prop="corporationCode"
        >
          <span>{{ formData.corporationCode }} - {{ formData.corporationName }}</span>
        </el-form-item>
        <el-form-item
          label="所属部门"
          label-width="120px"
          prop="departIds"
          class="mb-20"
        >
          <el-cascader
            v-if="visible"
            :key="renderCascader"
            v-model="formData.departIds"
            placeholder="请选择所属部门"
            :options="departTree"
            filterable
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
          />
        </el-form-item>
        <el-form-item
          label="用户职位"
          label-width="120px"
          prop="positionType"
          class="mb-20"
        >
          <el-select
            v-model="formData.positionType"
            placeholder="请选择用户职位"
          >
            <el-option
              v-for="item in positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="角色权限"
          label-width="120px"
          prop="roleIds"
          class="mb-20"
        >
          <el-select
            v-model="formData.roleIds"
            multiple
            placeholder="请选择角色权限"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.name"
              :value="item.roleId"
            />
          </el-select>
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
          确认保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getOutCorporationList,
  getOutOrgTree,
  getCorporationRoles,
  addUser,
  updateUser
} from "@/api/user";
import validate from "@/utils/validate";

const validateEmail = (rule, value, callback) => {
  if (!validate.email.test(value)) {
    callback(new Error("邮箱格式错误!"));
  } else {
    callback();
  }
};
const validatePsw = (rule, value, callback) => {
  if (!validate.isPsw.test(value)) {
    callback(new Error("密码必须同时含有数字和字母，且长度在8-20位!"));
  } else {
    callback();
  }
};

const initFormData = () => {
  return {
    userName: "",
    loginName: "",
    password: "",
    status: "",
    corporationCode: "",
    departIds: [],
    positionType: null,
    roleIds: []
  };
};

export default {
  props: {
    dialogData: Object,
    type: String
  },
  data() {
    return {
      visible: false,
      formData: initFormData(),
      roleOptions: [],
      positionOptions: Object.keys(this.$enum.USER_POSITION_MAP).map(i => {
        return { value: Number(i), label: this.$enum.USER_POSITION_MAP[i] };
      }),
      corporationList: [],
      departTree: [],
      renderCascader: 0
    };
  },
  computed: {
    isEdit() {
      // 是否处于编辑状态
      return this.type == "edit";
    },
    modalTitle() {
      return this.isEdit ? "编辑用户" : "创建用户";
    },
    formRules() {
      return this.isEdit
        ? {
          userName: [
            { required: true, trigger: "blur", message: "请输入用户名称!" }
          ],
          departIds: [
            { required: true, trigger: "change", message: "请选择所属部门!" }
          ],
          positionType: [
            { required: true, trigger: "change", message: "请选择用户职位!" }
          ],
          roleIds: [
            { required: true, trigger: "change", message: "请选择角色权限!" }
          ]
        }
        : {
          userName: [
            { required: true, trigger: "blur", message: "请输入用户名称!" }
          ],
          loginName: [
            { required: true, trigger: "blur", message: "请输入登录邮箱!" },
            { validator: validateEmail, trigger: "blur" }
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入登录密码!" },
            { validator: validatePsw, trigger: "blur" }
          ],
          corporationCode: [
            { required: true, trigger: "change", message: "请选择所属企业!" }
          ],
          departIds: [
            { required: true, trigger: "change", message: "请选择所属部门!" }
          ],
          positionType: [
            { required: true, trigger: "change", message: "请选择用户职位!" }
          ],
          roleIds: [
            { required: true, trigger: "change", message: "请选择角色权限!" }
          ]
        };
    }
  },
  created() {
    this.getOutCorporationList();
  },
  methods: {
    // 打开前回调
    openDialog() {
      if (this.isEdit) {
        this.formData = this.$deepcopy(this.dialogData);
        this.formData.roleIds = this.formData.roleDtoList.map(i => {
          return i.roleId;
        });
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        });
        this.getOutOrgTree();
        this.getCorporationRoles();
      } else {
        const InitForm = initFormData();
        this.formData = InitForm;
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        });
      }
    },
    closeDialog() {
      // this.$nextTick(() => {
      this.$refs.formData.clearValidate();
      this.formData = initFormData();
      // });
    },
    handleFocusCorporation() {
      if (!this.corporationList.length) {
        this.getOutCorporationList("");
      }
    },
    handleChangeCorporation(val) {
      this.formData.departIds = [];
      this.formData.roleIds = [];
      this.$nextTick(() => {
        this.$refs.formData.clearValidate(["roleIds", "departIds"]);
        this.getOutOrgTree();
        this.getCorporationRoles();
      });
    },
    async getOutCorporationList(query) {
      const params = {
        corporationCodeOrName: query,
        outFlag: 1
      };
      await getOutCorporationList(params).then(res => {
        this.corporationList = res.data;
      });
    },
    async getOutOrgTree() {
      const params = {
        corporationCode: this.formData.corporationCode
      };
      await getOutOrgTree(params).then(res => {
        ++this.renderCascader;
        this.departTree = [res.data];
      });
    },
    async getCorporationRoles() {
      const params = {
        corporationCode: this.formData.corporationCode
      };
      await getCorporationRoles(params).then(res => {
        this.roleOptions = res.data;
      });
    },
    async submitForm() {
      await this.$refs.formData.validate();
      if (this.isEdit) {
        const params = {
          ...this.formData,
          orgId: this.formData.departIds[this.formData.departIds.length - 1]
        };
        await updateUser(params);
      } else {
        const params = {
          ...this.formData,
          password: this.$getRsaCode(this.formData.password),
          orgId: this.formData.departIds[this.formData.departIds.length - 1]
        };
        await addUser(params);
      }
      const msg = this.isEdit ? "编辑成功" : "创建成功";
      this.$message({
        message: msg,
        type: "success"
      });
      this.$emit("submit");
      this.visible = false;
      this.closeDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
.user-modal-wrap {
  .el-input,
  .el-select,
  .el-cascader {
    width: 560px;
  }
}
.eidt-user-modal-wrap {
  .el-form-item {
    margin-bottom: 0;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
}
</style>
