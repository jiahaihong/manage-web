import { getListPlatform } from '@/api/system'
export default {
  namespaced: true,
  state: {
    dictCountry: [], // 国家列表
    PlatFormAllList: [], // 平台列表(Array, 原始数据)
    PlatFormAllListObj: [], // 平台列表(Object, id对应名字)
    // 行业类型
    CUSTOMERTYPEDICT: [],
    CUSTOMERTYPEDICT_OBJ: {}, // 行业类型(对象类型,方便回显)
    DEPARTMENT_Obj: {}, // 全量部门
    DOWNLOAD_FILES: [], // 待下载文件
  },
  mutations: {
    SET_PlatFormAll(state, val) {
      state.PlatFormAllList = Object.freeze(val)
      const obj = {}
      if (Array.isArray(val)) {
        val.forEach((item) => {
          obj[item.id] = item.mediaName
        })
      }
      state.PlatFormAllListObj = Object.freeze(obj)
    }
  },
  actions: {
    // 获取平台列表接口 、 全量部门
    getPlatForm(context) {
      getListPlatform({ pageSize: 10000, pageNo: 1 }).then((res) => {
        context.commit('SET_PlatFormAll', res.data.dataList)
      })
    }
  },
  getters: {},
}
