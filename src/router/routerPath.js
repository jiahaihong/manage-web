/*
 * @Author: your name
 * @Date: 2021-02-22 17:36:11
 * @LastEditTime: 2023-02-24 11:33:18
 * @LastEditors: Please set LastEditors
 * @Description: 路由库
 */
// 账户管理列表
export const accountTemplate = () =>
  import('@/views/accountManage/accountTemplate')

export const indexPath = {
  // userManage-用户管理
  externalUserManage: {
    component: () => import('@/views/userManage/externalUser'),
  },

  // accountManage-账号管理
  transferAdvertiserList: {
    component: () => import(`@/views/accountManage/transferAdvertiserList`),
  },
  // systemManage-系统管理
  mediaConfig: {
    component: () => import('@/views/systemManage/mediaConfig'),
  },
  log: {
    component: () => import('@/views/systemManage/log'),
  },
  deptConfig: {
    component: () => import('@/views/systemManage/deptConfig'),
  },
  menuConfig: {
    component: () => import('@/views/systemManage/menuConfig'),
  }
}
