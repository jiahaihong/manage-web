<!-- 更新Division ID 弹窗 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="1000px"
      title="更新Parent关系"
      class="el_dialog"
      @open="OpenDialog"
      @closed="CloseDialog"
    >
      <el-tabs
        v-model="currentTab"
        @tab-click="tabsClick"
      >
        <el-tab-pane
          label="更新操作"
          name="1"
        >
          <!-- 转移操作内容 -->
          <div class="global-module table-paddings">
            <el-alert
              class="mb-20"
              type="success"
              title="由于22年返点计算会用到Division ID关系，所以暂时保留Parent ID、Parent name列更新，23年更新时可以为空不上传"
              show-icon
              :closable="false"
            />
            <el-form
              ref="divisionForm"
              :model="divisionForm"
              label-position="right"
              label-width="110px"
            >
              <el-form-item
                label="渠道"
                prop="channelId"
                :rules="$setRules({ message: '请选择渠道！'})"
              >
                <el-select
                  v-model="divisionForm.channelId"
                  style="width: 400px"
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
              <el-form-item
                label="数据文件"
                prop="data"
                :rules="$setRules({ message: '请上传相关附件且数据有效！'})"
              >
                <el-row
                  type="flex"
                  justify="space-between"
                >
                  <el-col :span="10">
                    <upload-file
                      ref="uploadFile"
                      v-model="divisionForm.fileName"
                      accepts=".xlsx,.xls"
                      info="只能上传 xlsx/xls 格式文件且大小不超过5M"
                      :size="5"
                      @onFileChange="handleUploadChange"
                    />
                  </el-col>
                  <el-col :span="2">
                    <span
                      style="cursor: pointer;color: #409EFF"
                      @click="downloadExcel"
                    >下载模板</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="数据载入">
                <div class="global-module table-paddings">
                  <el-table
                    :data="divisionForm.data"
                    style="width: 80%; line-height: 26px"
                    height="300px"
                    border
                    size="small"
                  >
                    <el-table-column
                      label="账号ID（此处最多回显20条数据）"
                      prop="ggAccountId"
                    />
                    <el-table-column
                      label="Division ID"
                      width="120"
                      prop="divisionId"
                    />
                    <el-table-column
                      label="Division Name"
                      width="120"
                      prop="divisionName"
                    />
                    <el-table-column
                      label="Parent ID"
                      prop="parentId"
                    />
                    <el-table-column
                      label="Parent Name"
                      prop="parentName"
                    />
                    <el-table-column
                      label="Parent状态"
                      prop="parentIdStatusDesc"
                    />
                  </el-table>
                </div>
              </el-form-item>
              <el-form-item label="数据分析">
                <el-row>
                  <el-col :span="6">
                    账号总数: {{ exportParams.dataSize }}
                  </el-col>
                  <el-col :span="6">
                    系统中未找到的账号: {{ exportParams.notFindAccountSize }}
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="exportNotFoundAccountXlsx"
                    >
                      导出结果数据
                    </el-button>
                  </el-col>
                </el-row>
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
                :loading="isLoading"
                @click="SubmitForm"
              >
                更 新
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="操作记录"
          name="2"
        >
          <div class="global-module table-paddings">
            <el-table
              v-loading="listData.isLoading"
              :data="listData.info"
              border
              size="small"
            >
              <template v-for="(col) in tableColumn">
                <el-table-column
                  :key="col.prop"
                  :fixed="col.fixed"
                  :prop="col.prop"
                  :label="col.label"
                  :formatter="col.formatter"
                  :width="col.width"
                />
              </template>
            </el-table>
            <el-pagination
              :total="listData.total"
              :page-sizes="[10, 20, 30, 40]"
              :current-page="listData.pageNo"
              :page-size.sync="listData.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              @size-change="getList(1)"
              @current-change="getList"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { downloadExcelTemplate, fuzzySearchChannelWithCount } from "@/api/common";
import {
  importDivisionId,
  exportDivisionIdAnalyseResult,
  updateDivisionID,
  getUpdateDivisionIdLog,
} from "@/api/account";
export default {
  props: {},
  data() {
    return {
      visible: false,
      isLoading: false,
      currentTab: "1",
      exportParams: {
        notFindAccountSize: 0, // 未找到数量
        dataSize: 0, // 账号总数
        exportResultKey: "", // 导出key值
      },
      divisionForm: {
        file: null,
        fileName: "", // 上传文件名
        fileUrl: "", // 上传文件路径
        channelId: "",
        data: []
      },
      channelList: [], // 渠道列表
      listData: {
        isLoading: false,
        info: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
      }
    };
  },
  computed: {
    PlatFormAllListObj() {
      return this.$store.state.common.PlatFormAllListObj || {}
    },
    tableColumn() {
      const _this = this
      return Object.freeze([
        {
          label: "渠道",
          prop: "channelId"
        },
        {
          label: "更新时间",
          prop: "updateTime"
        },
        {
          label: "操作人",
          prop: "updateUser"
        },
        {
          label: "操作",
          prop: "opration",
          formatter: (row) => {
            return (
              <el-button
                size="mini"
                type="primary"

                on-click={() => _this.handleDownloadFile(row)}
              >
                导出数据
              </el-button>
            )
          }
        },
      ])
    },
  },
  methods: {
    OpenDialog() {
      this.currentTab = "1";
      this.getchannelList();
    },
    CloseDialog() {
      // eslint-disable-next-line
      const { visible, currentTab, ...last } = this.$options.data()
      // vue 重置data数据
      Object.assign(this.$data, { ...last })
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.handleDeleteFile()
      }

      this.$nextTick(() => {
        this.$refs["divisionForm"].clearValidate();
      })
    },
    tabsClick(obj) {
      if (obj.name == "1") {
        // 更新操作
        this.CloseDialog()
      } else {
        this.getList(1);
      }
    },
    // 获取渠道列表
    async getchannelList(queryString) {
      try {
        const res = await fuzzySearchChannelWithCount({
          channelIdOrName: queryString,
          platform: 2
        })
        if (!Array.isArray(res.data)) {
          throw new Error('数据为空')
        }
        this.channelList = res.data.map(e => ({
          value: e.channelId,
          label: `${e.channelId}-${this.PlatFormAllListObj[e.platform]}-${e.channelName}`
        }));
      } catch (error) {
        this.channelList = []
      }
    },
    // 上传数据文件
    async handleUploadChange(file) {
      try {
        if (!file) {
          throw new Error('数据为空')
        }
        const form = new FormData();
        form.append("file", file);
        const res = await importDivisionId(form);

        const {
          fileName, fileUrl, notFindAccountSize, dataSize, exportResultKey, data, errorMsgs
        } = res.data

        this.divisionForm.fileName = fileName;
        this.divisionForm.fileUrl = fileUrl;
        this.divisionForm.data = data;

        this.exportParams = {
          notFindAccountSize, dataSize, exportResultKey
        }
        if (Array.isArray(errorMsgs) && errorMsgs.length) {
          const error = errorMsgs.map(t => <div style="color: #f56c6c; font-size: 14px; line-height: 18px">{t}</div>)
          this.$message({
            message: (
              <div>{error}</div>
            ),
            type: "error",
            duration: 3 * 1000
          });
        }
      } catch (error) {
        this.divisionForm.fileName = "";
        this.divisionForm.fileUrl = "";
        this.divisionForm.data = [];

        this.exportParams = {
          notFindAccountSize: 0, // 未找到数量
          dataSize: 0, // 账号总数
          exportResultKey: "", // 导出key值
        }

        this.$refs.uploadFile.handleDeleteFile()
      }

      this.$refs.divisionForm.validateField("data");
    },
    // 提交
    async SubmitForm() {
      try {
        await this.$refs.divisionForm.validate();

        // eslint-disable-next-line
        const { data, ...last } = this.divisionForm
        this.isLoading = true
        const res = await updateDivisionID({
          ...last,
          key: this.exportParams.exportResultKey
        })
        this.visible = false;
        this.$emit('submit')
        this.$message({
          type: "success",
          message: res.msg,
        });
      } catch (error) {
        console.warn(error)
      }
      this.isLoading = false
    },

    downloadExcel() {
      downloadExcelTemplate({ type: "UPDATE_DIVISION" }).then((res) => {
        if (res.code === 200) {
          this.$ExportXLSX(res.data || [], '更新DivisionID模板.xlsx')
        }
      });
    },
    exportNotFoundAccountXlsx() {
      if (this.exportParams.notFindAccountSize == 0) {
        this.$message({
          message: "暂无可导出数据",
          type: "error",
        });
        return;
      }
      exportDivisionIdAnalyseResult({ key: this.exportParams.exportResultKey }).then((file) => {
        this.$CreatDownload({
          file: file,
          FileName: `未找到的账号.xlsx`
        })
      });
    },
    // 查询
    async getList(page = 1) {
      this.listData.isLoading = true
      try {
        this.listData.pageNo = page
        const params = {
          pageSize: this.listData.pageSize,
          pageNo: this.listData.pageNo,
        };
        const res = await getUpdateDivisionIdLog(params)
        this.listData.info = res.data.dataList;
        this.listData.total = res.data.total;
      } catch (error) {
        this.listData.info = [];
        this.listData.total = 0;
      }
      this.listData.isLoading = false
    },
    async handleDownloadFile(row) {
      window.location.href = row.sourceFile;
    },

  },
};
</script>
<style lang="scss" scoped>
.table-paddings {
  padding: 0;
}
.btn-position {
  margin-bottom: 10px;
}
.dialog-footer {
  float: right;
}
</style>
