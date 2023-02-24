import router from "@/router";
import Layout from "@/layout";
import { notFoundPage } from "@/router";

import { indexPath, accountTemplate } from "@/router/routerPath";
import { $isEmpty } from "@/utils/methods";
import { login, logout } from "@/api/auth";
import { getCurrentUserInfo, getAvatar } from "@/api/user";
import { JUMP_LOGIN_URL } from "@/utils/auth";
import Cookies from "js-cookie";

/**
 * 生成动态路由
 *
 * @export
 * @param {*} permission
 * // 动态路由list
 * @returns
 */
export function filterPermissionRoutes(permission) {
  const routes = [];
  permission.forEach(e => {
    const routerItem = {
      path: `/${e.routeName}`,
      component: Layout
    };

    if (e.resources && e.resources.length > 0) {
      routerItem.name = `${e.routeName}`;
      routerItem.meta = {
        title: e.name,
        icon: "example"
      };
      routerItem.redirect = "noRedirect";
      routerItem.alwaysShow = true;
      routerItem.children = [];
      e.resources.forEach(c => {
        let component = null;
        /**
         * @description: 权限控制
         */
        const permissionButtons = [];
        const permissionTabs = [];
        if (Array.isArray(c.buttons) && c.buttons.length) {
          const btn = c.buttons.map(item => item.englishName);
          permissionButtons.push(...btn);
        }
        if (Array.isArray(c.tabs) && c.tabs.length) {
          const tabs = c.tabs.map(item => item.englishName);
          permissionTabs.push(...tabs);
        }

        const singleRoute = indexPath[c.routeName];
        /**
         * @description: 账号模板
         */
        if (c.webType === 3) {
          component = accountTemplate;
        } else if ($isEmpty(singleRoute)) {
          component = notFoundPage;
        } else {
          component = singleRoute.component;

          // 注册详情页(后端没有返回的path,前端需要自行注册)
          if (singleRoute.detail) {
            const detail = singleRoute.detail.map(item => {
              const { meta, ...last } = item;
              return {
                path: `/detail/${item.name}`,
                meta: {
                  ...meta,
                  permissionButtons,
                  permissionTabs
                },
                ...last
              };
            });
            // console.warn(detail, permissionButtons)
            routerItem.children.push(...detail);
          }
        }
        /**
         * @description: 添加组件
         */
        routerItem.children.push({
          path: `/${e.routeName}/${c.routeName}`,
          component: component,
          name: `${c.routeName}`,
          meta: {
            title: c.name,
            permissionButtons,
            permissionTabs
            // icon: 'example',
          }
        });
      });

      // /**
      //  * @description: 开发环境用
      //  * @param {*} e
      //  * @return {*}
      //  */
      // if (e.routeName === 'systemManage') {
      //   routerItem.children.push(
      //   {
      //     path: `/systemManage/permissionPack`,
      //     component: () => import(`@/views/systemManage/permissionPack`),
      //     name: `permissionPack`,
      //     meta: { title: '权限包',icon: "example", btn: [] },
      //   })
      // }
    }
    routes.push(routerItem);
  });
  return routes;
}

const state = {
  token: "",
  userInfo: {}, // 个人信息
  avatar: "", // 头像
  permissionRoutes: [], // 菜单和按钮权限
  addRoutes: [] // 动态路由数组
};

const mutations = {
  // 页面权限
  SET_ROUTES: (state, permissionRoutes) => {
    // console.warn('权限', permissionRoutes)
    state.permissionRoutes = permissionRoutes;
    state.addRoutes = [...permissionRoutes, { path: "*", redirect: "/", hidden: true }];
  },
  SET_USERINFO: (state, data) => {
    state.userInfo = data;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // 个人信息
  async getCurrentUserInfo({ commit }) {
    const res = await getCurrentUserInfo();
    window.localStorage.setItem("userId", res.data.id);

    gtag("config", "G-H3H9PF2FC3", {
      user_id: window.localStorage.getItem("userId")
    });
    gtag("set", "user_properties", { crm_id: window.localStorage.getItem("userId") });

    commit("SET_USERINFO", res.data);
    const resA = await getAvatar();
    commit("SET_AVATAR", resA.data);
  },
  // 菜单接口
  async getResource({ commit, state }) {
    const data = [
      { "id": 10146, "name": "用户管理", "enName": "userManage", "routeName": "userManage", "resources": [
        {
          "id": 10147, "name": "外部用户", "enName": "externalUserManage", "routeName": "externalUserManage", "resources": [], "tabs": null, "sort": 1, "href": "/user/pageOutUserInfos", "parentId": 10146, "type": 2, "webType": 1, "icon": null }], "tabs": null, "buttons": null, "sort": 3, "href": "/userManage", "parentId": 6, "type": 1, "webType": 1, "icon": null
      },

      {
        "id": 105, "name": "账号管理", "enName": "accountManage", "routeName": "accountManage",
        "resources": [{ "id": 106, "name": "Meta账号", "enName": "facebook", "routeName": "FBK", "resources": [], "tabs": null, "sort": 1, "href": "/accountManage/facebook", "parentId": 105, "type": 2, "webType": 3, "icon": null }],
        "tabs": null, "buttons": null, "sort": 4, "href": "/accountManage", "parentId": 6, "type": 1, "webType": 1, "icon": null },

      {
        "id": 114, "name": "系统管理", "enName": "systemManage", "routeName": "systemManage",
        "resources": [{ "id": 136, "name": "媒体配置", "enName": "mediaConfig", "routeName": "mediaConfig", "resources": [], "tabs": null, "sort": 1, "href": "/systemManage/mediaConfig", "parentId": 114, "type": 2, "webType": 1, "icon": null }, { "id": 10227, "name": "部门配置", "enName": "deptConfig", "routeName": "deptConfig", "resources": [], "tabs": null, "sort": 2, "href": "/systemManage/deptConfig", "parentId": 114, "type": 2, "webType": 1, "icon": null }, { "id": 10384, "name": "菜单配置", "enName": "menuConfig", "routeName": "menuConfig", "resources": [], "tabs": null, "sort": 3, "href": "", "parentId": 114, "type": 2, "webType": 1, "icon": "" }, { "id": 10391, "name": "权限包配置", "enName": "permissionPack", "routeName": "permissionPack", "resources": [], "tabs": null, "sort": 4, "href": "", "parentId": 114, "type": 2, "webType": 1, "icon": "" }, { "id": 115, "name": "操作日志", "enName": "log", "routeName": "log", "resources": [], "tabs": null, "sort": 5, "href": "/systemManage/log", "parentId": 114, "type": 2, "webType": 1, "icon": null }, { "id": 11115, "name": "应用中心", "enName": "InterfaceAudit", "routeName": "InterfaceAudit", "resources": [], "tabs": null, "sort": 6, "href": "", "parentId": 114, "type": 2, "webType": 1, "icon": "" }],
        "tabs": null, "buttons": null, "sort": 8, "href": "/systemManage", "parentId": 6, "type": 1, "webType": 1, "icon": null }
    ]
    const permissionRoutes = filterPermissionRoutes(data);
    commit("SET_ROUTES", permissionRoutes);
    router.addRoutes(state.addRoutes);
  },

  /**
   * @description: 退出登录
   * @param {*} commit
   * @param {*} state
   * @return {*}
   */
  async logout({ commit, state }) {
    try {
      const res = await logout({
        targetUrl: window.location.href
      });
      window.localStorage.clear();
      Cookies.remove("TGC");
      if (res.data) {
        // 内部用户idaas退出
        window.location.href = res.data;
      } else {
        // 外部用户退出
        JUMP_LOGIN_URL();
      }
    } catch (error) {
      console.warn(error);
    }
  },
  // 已弃用
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
