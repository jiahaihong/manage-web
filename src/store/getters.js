/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2021-12-07 13:58:49
 * @LastEditors: Please set LastEditors
 * @Description: getters
 */
const getters = {
  userName: state => state.user.userName,
  userInfo: state => state.user.userInfo,
  avatar: state => state.user.avatar,
  permissionRoutes: state => state.user.permissionRoutes,
  token: state => state.user.token,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  dict: state => state.dict,

};
export default getters;
