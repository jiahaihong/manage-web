export const indexPath = {
  // userManage-用户管理
  externalUserManage: {
    component: () => import('@/views/userManage/externalUser'),
  },
  FBK: {
    component: () => import('@/views/accountManage/accountTemplate'),
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
