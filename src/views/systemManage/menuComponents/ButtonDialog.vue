<!--
 * @Author: geroge.qiao
 * @Date: 2021-12-07 14:36:07
 * @LastEditTime: 2023-02-06 16:30:03
 * @LastEditors: Please set LastEditors
 * @Description: 添加/编辑按钮或链接或Tab
-->
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
      label-position="right"
      label-width="110px"
      style="width: 90%"
    >
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group
          v-model="modalForm.type"
          :disabled="!isAdd"
          @change="changeType"
        >
          <el-radio
            v-for="t in typeOptions"
            :key="t.label"
            :label="t.label"
          >
            {{ t.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="modalForm.type === 3"
        label="按钮类型"
        prop="look"
      >
        <el-radio-group
          v-model="modalForm.look"
          :disabled="!isAdd"
          @change="changeLook"
        >
          <el-radio :label="2">
            自定义按钮
          </el-radio>
          <el-radio :label="1">
            列表查看
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="!(modalForm.look === 1 && modalForm.type === 3)">
        <el-form-item
          label="中文名"
          prop="name"
          :rules="$setRules({ message: '请输入中文名', trigger: 'blur' })"
        >
          <el-input
            v-model="modalForm.name"
            placeholder="请输入中文名"
          />
        </el-form-item>
        <el-form-item
          label="英文名"
          prop="enName"
          :rules="$setRules({ message: '请输入英文名', trigger: 'blur' })"
        >
          <el-input
            v-model="modalForm.enName"
            placeholder="请输入英文名"
          />
        </el-form-item>
        <el-form-item
          label="路由名称"
          prop="routeName"
          :rules="$setRules({ message: '请输入路由名称', trigger: 'blur' })"
        >
          <el-input
            v-model="modalForm.routeName"
            placeholder="请输入路由名称"
          />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
          :rules="$setRules({ message: '请输入排序', trigger: 'blur' })"
        >
          <el-input
            v-model="modalForm.sort"
            type="number"
            placeholder="请输入排序"
          />
        </el-form-item>
        <el-form-item
          label="请求地址"
          prop="href"
          :rules="$setRules({ required: modalForm.type === 4, message: '请输入请求地址', trigger: 'blur' })"
        >
          <el-input
            v-model="modalForm.href"
            placeholder="请输入请求地址"
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
          label="下拉悬浮(1/2)"
        >
          <el-input
            v-model.number="modalForm.webType"
            placeholder="请输入webType"
          />
        </el-form-item>
      </div>
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
import { addSysResource, editSysResource } from "@/api/system";

// 1-菜单树 2-下拉悬浮 3-账号模板
const initForm = (type = 3, look = 2, webType = 1) => ({
  /**
   * @description: 1-目录 2- 菜单 3-按钮 4-链接 5-tab页签
   * @param {*}
   * @return {*}
   */
  type,
  look,
  /**
   * @description: 1: 表示 真是页面； 2：表示链接或者 不注册页面
   * @param {*}
   * @return {*}
   */
  webType,
  name: "",
  enName: "",
  routeName: "",
  sort: undefined,
  href: "",
  icon: "",
});
export default {
  props: {
    type: String,
    modalData: Object,
    sysCode: String,
  },
  data() {
    return {
      visible: false,
      loading: false,
      modalForm: initForm()
    };
  },
  computed: {
    isAdd() {
      return this.type === "add";
    },
    dialogTitle() {
      return `${this.isAdd ? "添加" : "编辑"}目录/菜单按钮/链接/Tab`;
    },
    isGeorge() {
      try {
        const loginName = this.$store.state.user.userInfo.loginName;
        return ['george.qiao@yeahmobi.com', 'george.qiao@cyberklick.com'].includes(loginName) && !this.isAdd
      } catch (error) {
        return false
      }
    },
    typeOptions() {
      const type = this.modalData.type
      const result = [
        { label: 1, name: "目录", only: [1] },
        { label: 2, name: "菜单", only: [1] },
        { label: 3, name: "按钮", only: [2, 5] },
        { label: 4, name: "链接", only: [1, 2, 5] },
        { label: 5, name: "Tab", only: [2, 5] },
      ]
      if (!this.isAdd) {
        return result.filter(t => t.label === type)
      } else {
        return result.filter(t => t.only.includes(type))
      }
    }
  },
  methods: {
    async OpenDialog() {
      if (this.isAdd) {
        this.$nextTick(() => {
          const type = this.typeOptions[0].label
          this.modalForm = initForm(type);
          // console.warn(type, this.typeOptions, this.modalForm)
        });
      } else {
        for (const key in this.modalForm) {
          this.modalForm[key] = this.modalData[key];
        }
      }
      this.$nextTick(() => {
        this.$refs.modalForm.clearValidate();
      });
    },
    CloseDialog(type = 3, look = 2, webType = 1) {
      this.modalForm = initForm(type, look, webType);
      this.$nextTick(() => {
        this.$refs.modalForm.clearValidate();
      });
    },
    // 切换类型
    changeType(type) {
      const webType = type === 4 ? 2 : 1
      this.CloseDialog(type, this.modalForm.look, webType)
      if (type !== 3) {
        this.modalForm.look = undefined;
      }
    },
    // 列表查看
    changeLook(look) {
      const type = this.modalForm.type;
      this.CloseDialog(type, look)
    },
    // 提交
    async submitForm() {
      try {
        await this.$refs["modalForm"].validate();
        const query = Object.assign(
          {
            systemCode: this.sysCode
          },
          this.modalForm
        );
        this.loading = true;
        let res;
        if (this.isAdd) {
          query.parentId = this.modalData.id;
          res = await addSysResource(query);
        } else {
          query.id = this.modalData.id;
          res = await editSysResource(query);
        }
        // console.warn(query)
        // return
        this.$message({
          type: "success",
          message: res.msg
        });
        this.visible = false;
        this.$emit("submit");
      } catch (error) {
        console.log("[submitForm]", error);
      }
      this.loading = false;
    },
  }
};
</script>

<style lang="scss" scoped></style>
