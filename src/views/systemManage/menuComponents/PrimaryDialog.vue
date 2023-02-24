<!-- 添加/编辑一级目录 -->
<template>
  <el-dialog
    :visible.sync="visible"
    width="600px"
    :title="dialogTitle"
    :close-on-click-modal="false"
    @open="OpenDialog"
    @close="CloseDialog"
  >
    <el-form
      ref="modalForm"
      :model="modalForm"
      :rules="modalFormRules"
      label-position="right"
      label-width="110px"
      style="width: 90%"
    >
      <el-form-item
        label="目录中文名"
        prop="name"
      >
        <el-input
          v-model="modalForm.name"
          placeholder="请输入目录中文名"
        />
      </el-form-item>
      <el-form-item
        label="目录英文名"
        prop="enName"
      >
        <el-input
          v-model="modalForm.enName"
          placeholder="请输入目录英文名"
        />
      </el-form-item>
      <el-form-item
        label="路由名称"
        prop="routeName"
      >
        <el-input
          v-model="modalForm.routeName"
          placeholder="请输入路由名称"
        />
      </el-form-item>
      <el-form-item
        label="排序"
        prop="sort"
      >
        <el-input
          v-model="modalForm.sort"
          placeholder="请输入排序"
        />
      </el-form-item>
      <el-form-item
        label="icon"
        prop="icon"
      >
        <el-input
          v-model="modalForm.icon"
          placeholder="请输入icon名称"
        />
      </el-form-item>
      <el-form-item
        v-if="isGeorge"
        label="菜单树/下拉悬浮(1/2)"
      >
        <el-input
          v-model.number="modalForm.webType"
          placeholder="请输入webType"
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
        :loading="loading"
        @click="submitForm"
      >
        确认保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addSysResource } from "@/api/system";
const initForm = () => ({
  name: "",
  enName: "",
  routeName: "",
  sort: "",
  icon: "",
  // 1-菜单树 2-下拉悬浮 3-账号模板
  webType: 1, // 页面类型
});

export default {
  props: ["sysRoot"],
  data() {
    return {
      visible: false,
      loading: false,
      modalForm: initForm(),
      modalFormRules: {
        name: [
          { required: true, message: "请输入目录中文名", trigger: "blur" }
        ],
        enName: [
          { required: true, message: "请输入目录英文名", trigger: "blur" }
        ],
        routeName: [
          { required: true, message: "请输入路由名称", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      }
    };
  },
  computed: {
    dialogTitle() {
      return "添加一级目录";
    },
    isGeorge() {
      try {
        const loginName = this.$store.state.user.userInfo.loginName;
        return ['george.qiao@yeahmobi.com', 'george.qiao@cyberklick.com'].includes(loginName) && !this.isAdd
      } catch (error) {
        return false
      }
    },
  },
  methods: {
    async OpenDialog() {
      this.$nextTick(() => {
        this.$refs.modalForm.clearValidate();
      });
    },
    CloseDialog() {
      this.modalForm = initForm();
    },
    submitForm() {
      this.$refs["modalForm"].validate(async valid => {
        if (!valid) return;
        this.loading = true;
        try {
          const query = Object.assign(
            {
              type: 1,
              systemCode: this.sysRoot.code,
              parentId: this.sysRoot.rootId
            },
            this.modalForm
          );
          const res = await addSysResource(query);
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.visible = false;
            this.$emit("submit");
          }
        } catch (error) {
          console.log("[submitForm]", error);
        }
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
