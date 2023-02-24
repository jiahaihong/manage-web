<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-24 13:24:44
 * @LastEditors: Please set LastEditors
 * @Description: 编辑媒体弹窗
-->
<template>
  <el-dialog
    :visible.sync="visible"
    width="1000px"
    :title="dialogTitle"
    @open="OpenDialog"
    @closed="ClosedDialog"
  >
    <el-form
      ref="modalForm"
      :model="modalForm"
      label-position="right"
      label-width="110px"
    >
      <el-form-item
        label="媒体编号"
        required
      >
        {{ modalForm.mediaCode }}
      </el-form-item>
      <el-form-item
        label="媒体名称"
        required
      >
        {{ modalForm.mediaName }}
      </el-form-item>
      <el-form-item
        label="业务线"
        prop="businessLine"
        :rules="$setRules({
          message: '请选择业务线'
        })"
      >
        <el-radio-group v-model="modalForm.businessLine">
          <el-radio label="HW">
            海外大媒体
          </el-radio>
          <el-radio label="GN">
            国内大媒体
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="modalForm.virtualMedia !== 1">
        <el-form-item
          label="对接方式"
          required
        >
          <el-radio-group v-model="modalForm.recType">
            <el-radio :label="1">
              API对接
            </el-radio>
            <el-radio :label="2">
              手动对接
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="合作方式"
          prop="mbType"
          :rules="$setRules({
            message: '请选择合作方式'
          })"
        >
          <el-radio-group v-model="modalForm.mbType">
            <el-radio :label="1">
              线上
            </el-radio>
            <el-radio :label="2">
              线下
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="modalForm.mbType === 1">
          <el-form-item
            label="服务范围"
            prop="mediaScopeIds"
            :rules="$setRules({
              message: '请选择服务范围'
            })"
          >
            <el-checkbox-group v-model="modalForm.mediaScopeIds">
              <el-checkbox :label="1">
                开户服务
              </el-checkbox>
              <el-checkbox :label="2">
                充值服务
              </el-checkbox>
              <el-checkbox :label="3">
                清零服务
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label
            prop="defaultChannelId"
            :rules="$setRules({
              message: '请选择客户默认渠道'
            })"
          >
            <el-select
              v-model="modalForm.defaultChannelId"
              placeholder="选择客户默认渠道"
              clearable
              filterable
              remote
              :remote-method="getListChannelForPlatform"
              style="width:40%;"
              @focus="getListChannelForPlatform('')"
            >
              <el-option
                v-for="item in channelList"
                :key="item.channelId"
                :label="item.label"
                :value="item.channelId"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          label="账号管理"
          required
        >
          <el-checkbox-group v-model="modalForm.functionCodes">
            <el-checkbox
              v-for="item in functionCodesOptions"
              :key="item.label"
              :label="item.label"
              :disabled="item.disabled"
            >
              {{ item.text }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="渠道返点"
          prop="channelRebateWay"
          :rules="$setRules({
            message: '请选择渠道返点'
          })"
        >
          <el-checkbox-group v-model="modalForm.channelRebateWay">
            <el-checkbox
              v-for="item in channelRebateWayOptions"
              :key="item.label"
              :label="item.label"
            >
              {{ item.text }}
            </el-checkbox>
          </el-checkbox-group>
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
import { addPlatform, updatePlatform } from "@/api/system";
// import { listChannelForPlatform } from "@/api/channel";
import { setOption } from '../platformConfig'
const initForm = () => ({
  mediaCode: '',
  mediaName: '',
  businessLine: 'HW',
  mbType: 1,
  mediaScopeIds: [],
  defaultChannelId: '',
  virtualMedia: 2, // 是否虚拟媒体
  recType: 1, // 对接方式
  functionCodes: ['queryAccountList'],
  customerRebateWay: [],
  channelRebateWay: [],
})

export default {
  props: {
    dialogData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      channelList: [],
      // 表单
      modalForm: initForm(),
    };
  },
  computed: {
    isAdd() { // 是否处于添加状态
      return this.dialogData.$type === 'add'
    },
    dialogTitle() {
      const is = this.dialogData.virtualMedia === 1 ? '虚拟' : ''
      if (this.isAdd) {
        return `添加${is}媒体`
      } else {
        return `编辑${is}媒体`
      }
    },
    // 账号管理下拉框 需要联动
    functionCodesOptions() {
      const ALL = setOption('functionCodesOptions')
      const result = [
        { label: 'queryAccountList', text: '查询账号列表', disabled: true },
        ...ALL
      ]
      return result.filter(item => {
        let isShow = true
        if (this.modalForm.recType === 1) {
          isShow = !['modifyAccountName'].includes(item.label)
        }

        if (this.modalForm.businessLine === 'HW' && isShow) {
          isShow = !['modifyAccountOperating'].includes(item.label)
        }
        return isShow
      })
    },
    // 渠道返点下拉框
    channelRebateWayOptions() {
      return setOption('channelRebateWayOptions')
    }
  },
  methods: {
    // 获取返点历史记录
    async OpenDialog() {
      const {
        defaultChannelId,
        functionCodes, customerRebateWay, channelRebateWay, mediaScopeIds,
        ...last
      } = this.$deepcopy(this.dialogData, 'JSON')
      if (!this.isAdd) {
        Object.assign(this.modalForm, { defaultChannelId, ...last })
        /**
         * @description: 编辑状态(兼容以前数据结构),数据结构必须为数组
         * @param {*} Array
         * @return {*}
         */
        if (Array.isArray(functionCodes)) {
          this.modalForm.functionCodes = functionCodes
        }
        if (Array.isArray(customerRebateWay)) {
          this.modalForm.customerRebateWay = customerRebateWay
        }
        if (Array.isArray(channelRebateWay)) {
          this.modalForm.channelRebateWay = channelRebateWay
        }
        if (Array.isArray(mediaScopeIds)) {
          this.modalForm.mediaScopeIds = mediaScopeIds
        }
      }
      this.$nextTick(() => {
        this.$refs.modalForm.clearValidate();
      })
      this.getListChannelForPlatform('')
      console.warn(this.modalForm)
    },
    ClosedDialog() {
      this.modalForm = initForm()
      this.$nextTick(() => {
        this.$refs.modalForm.clearValidate();
      })
    },
    /**
     * @description: 渠道下拉框
     * @param {*} query
     * @return {*}
     */
    async getListChannelForPlatform(query) {
      try {
        const res = await listChannelForPlatform({
          platform: this.modalForm.id,
          channelIdOrName: query,
          pageSize: 10
        })
        this.channelList = res.data.map(t => {
          const { channelId, channelName } = t
          return {
            label: `${channelId}-${channelName}`,
            ...t
          }
        })
      } catch (error) {
        this.channelList = []
      }
    },
    // 提交返点
    async submitForm() {
      try {
        await this.$refs.modalForm.validate()
        const query = this.$deepcopy(this.modalForm, 'JSON')

        // 合作方式选择 线下 需要清空数据
        if (query.mbType === 2) {
          query.mediaScopeIds = []
          query.defaultChannelId = ''
        }

        // 合作方式选择 线下 需要清空数据
        if (query.businessLine === 'HW') {
          query.functionCodes = query.functionCodes.filter(item => !['modifyAccountOperating'].includes(item))
        }
        this.loading = true;
        const res = this.isAdd ? await addPlatform(query) : await updatePlatform(query);
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
    },
  }
};
</script>

<style lang="scss" scoped>
.el-input__inner{
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  }
}

input.el-input__inner[type="number"] {
-moz-appearance: textfield !important;
}
</style>
