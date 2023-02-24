<!--
 * @Author: george.qiao
 * @Date: 2021-11-29 11:09:11
 * @LastEditTime: 2023-01-13 17:11:37
 * @LastEditors: Please set LastEditors
 * @Description: 部门新增、编辑弹框
-->
<template>
  <div class="deptDialog">
    <el-dialog
      :title="`${dialogTitle}客户交接部门`"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      width="700px"
      @open="openDialog"
      @closed="closedDialog"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-width="100px"
      >
        <el-form-item
          label="业务线"
          prop="businessLine"
          :rules="
            $setRules({
              message: '请选择业务线',
            })
          "
        >
          <el-radio-group
            v-model="formData.businessLine"
            :disabled="isEdit"
            @change="businessLineChange"
          >
            <el-radio label="HW">
              海外大媒体
            </el-radio>
            <el-radio label="GN">
              国内大媒体
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="业务类型"
          prop="businessType"
          :rules="
            $setRules({
              message: '请选择业务类型',
            })
          "
        >
          <el-radio-group
            v-model="formData.businessType"
            :disabled="isEdit"
          >
            <el-radio label="MB">
              开户
            </el-radio>
            <el-radio label="AG">
              代投
            </el-radio>
            <el-radio
              label="BR"
            >
              品牌
            </el-radio>
            <el-radio
              :disabled="formData.businessLine === 'GN'"
              label="RE"
            >
              再营销
            </el-radio>
            <el-radio
              :disabled="formData.businessLine === 'GN'"
              label="ZX"
            >
              品牌咨询
            </el-radio>
            <el-radio
              :disabled="formData.businessLine === 'HW'"
              label="HD"
            >
              互动广告
            </el-radio>
            <el-radio
              :disabled="formData.businessLine === 'HW'"
              label="AGWF"
            >
              外放渠道
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="客户分类"
          prop="advertiserType"
          :rules="$setRules({ message: '请选择客户分类' })"
        >
          <el-select
            v-model="formData.advertiserType"
            placeholder="请选择"
            clearable
            multiple
            style="width:80%;"
          >
            <el-option
              v-for="item in CUSTOMERTYPEDICT"
              :key="item.crmKey"
              :label="item.cname"
              :value="item.crmKey"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isAm"
          key="amDepartmentOptions"
          label="AM部门"
          prop="amDepartmentOptions"
          :rules="$setRules({ message: '请选择业务线' })"
        >
          <GLCascader
            v-model="formData.amDepartmentOptions"
            clearable
            collapse-tags
            :options="departmentList"
            :props="departmentCodeProps"
            separator="-"
            style="width:80%;"
          />
        </el-form-item>
        <el-form-item
          v-if="isOperation"
          key="operationDepartmentOptions"
          label="投放部门"
          prop="operationDepartmentOptions"
          :rules="$setRules({ message: '请选择业务线' })"
        >
          <GLCascader
            v-model="formData.operationDepartmentOptions"
            clearable
            collapse-tags
            :options="departmentList"
            :props="departmentCodeProps"
            separator="-"
            style="width:80%;"
          />
        </el-form-item>
        <el-form-item
          v-if="isDepartmentCode"
          key="departmentOptions"
          label="运营部门"
          prop="departmentOptions"
          :rules="$setRules({ message: '请选择业务线' })"
        >
          <GLCascader
            v-model="formData.departmentOptions"
            clearable
            collapse-tags
            :options="departmentList"
            :props="departmentCodeProps"
            separator="-"
            style="width:80%;"
          />
        </el-form-item>
        <el-form-item
          v-if="isDesign"
          key="designDepartmentOptions"
          label="设计部门"
          prop="designDepartmentOptions"
          :rules="$setRules({ message: '请选择业务线' })"
        >
          <GLCascader
            v-model="formData.designDepartmentOptions"
            clearable
            collapse-tags
            :options="departmentList"
            :props="departmentCodeProps"
            separator="-"
            style="width:80%;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          :loading="isLoading"
          @click="isVisible = false"
        >
          取 消
        </el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          @click="onSubmit"
        >
          确认保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrgTree } from "@/api/user";
import { saveConfigs, updateConfigs } from "@/api/system";
import GLCascader from '@/components/Cascader'
const resetForm = () => ({
  id: null,

  businessLine: "HW",
  businessType: "MB",
  advertiserType: [],
  amDepartmentOptions: [],
  amDepartmentIds: null,

  operationDepartmentOptions: [],
  operationDepartmentIds: null,

  departmentOptions: [],
  departmentIds: null,

  designDepartmentOptions: [],
  designDepartmentIds: null,

});
export default {
  components: {
    GLCascader
  },
  props: {
    dialogData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isVisible: false,
      isLoading: false,
      departmentCodeProps: {
        multiple: true,
        expandTrigger: "hover",
        value: "id",
        label: "name",
        emitPath: false,
        checkStrictly: true,
        children: "children"
      },
      formData: resetForm(),
      departmentList: [] // 运营部门
    };
  },
  computed: {
    CUSTOMERTYPEDICT: function() {
      return this.$store.state.common.CUSTOMERTYPEDICT;
    },
    isEdit() {
      return this.dialogData.$type === "EDIT";
    },
    dialogTitle() {
      return this.dialogData.$type === "EDIT" ? "编辑" : "新增";
    },
    isAm() {
      const { businessType, businessLine } = this.formData
      return ['MB'].includes(businessType) || (['AG', 'AGWF'].includes(businessType) && businessLine === 'GN')
    },
    /**
     * @description: 海外与国内代投、海外品牌、品牌咨询
     * @param {*}
     * @return {*}
     */
    isOperation() {
      const { businessType, businessLine } = this.formData
      return ['AG'].includes(businessType) || (['BR', 'ZX'].includes(businessType) && businessLine === 'HW') || (['AGWF'].includes(businessType) && businessLine === 'GN')
    },
    isDepartmentCode() {
      return ['BR', 'RE', 'ZX', 'HD'].includes(this.formData.businessType)
    },
    isDesign() {
      return ['AG'].includes(this.formData.businessType) && this.formData.businessLine === 'HW'
    }
  },
  created() {
    this.formData = resetForm()
  },
  methods: {
    openDialog() {
      this.getOrgTreeList()
      const { $type, ...last } = this.dialogData
      if ($type === "EDIT") {
        this.formData = { ...last };
      }
    },
    closedDialog() {
      this.formData = resetForm();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
    },
    async getOrgTreeList() {
      try {
        const res = await getOrgTree();
        this.departmentList = res.data.children;
      } catch (error) {
        this.departmentList = [];
      }
    },
    businessLineChange() {
      this.formData.businessType = "MB";
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    async onSubmit() {
      try {
        await this.$refs.formData.validate();
        const {
          id, businessLine, businessType, advertiserType,
          amDepartmentOptions, amDepartmentIds,
          operationDepartmentOptions, operationDepartmentIds,
          departmentOptions, departmentIds,
          designDepartmentOptions, designDepartmentIds
        } = this.formData
        const query = [];
        /**
         * @description: typeId: 1 运营部门, 2 投放部门, 3 am部门, 4 设计部门
         * @param {*} this
         * @return {*}
         */
        if (this.isAm) {
          query.push({
            id,
            typeId: 3,
            businessLine, businessType, advertiserType,
            departmentCode: amDepartmentOptions,
            departmentIds: amDepartmentIds,
          })
        }
        if (this.isOperation) {
          query.push({
            id,
            typeId: 2,
            businessLine, businessType, advertiserType,
            departmentCode: operationDepartmentOptions,
            departmentIds: operationDepartmentIds,
          })
        }
        if (this.isDepartmentCode) {
          query.push({
            id,
            typeId: 1,
            businessLine, businessType, advertiserType,
            departmentCode: departmentOptions,
            departmentIds: departmentIds,
          })
        }
        if (this.isDesign) {
          query.push({
            id,
            typeId: 4,
            businessLine, businessType, advertiserType,
            departmentCode: designDepartmentOptions,
            departmentIds: designDepartmentIds,
          })
        }
        // console.warn(query)
        this.isLoading = true;
        const res = this.isEdit
          ? await updateConfigs(query)
          : await saveConfigs(query);
        this.$message({
          type: "success",
          message: res.msg
        });
        this.isVisible = false;
        this.$emit('submit')
      } catch (error) {
        console.warn("提交", error);
      }
      this.isLoading = false;
    }
  }
};
</script>

<style lang="scss">
.deptDialog {
  .el-radio-group {
    line-height: 32px;
  }
}
</style>
