/*
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2023-02-24 14:22:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yeahmedia-webc:\AAPerson\Bjob\business-admin\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
Vue.use(Router);

/* Layout */
import Layout from "@/layout";
export const notFoundPage = () => import("@/views/404");
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "个人中心", icon: "dashboard" }
      }
    ]
  }
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

router.beforeEach(async(to, from, next) => {
  // start progress bar
  if (!store.state.user.userInfo.userName) {
    /**
     * @description: 这里优先拉去接口
     * @param {*}
     * @return {*}
     */
    // 获取媒体平台
    await store.dispatch("common/getPlatForm");
  }
  next();
});

router.afterEach(async(to, from, next) => {
  try {
    if (!store.state.user.userInfo.userName) {
      // 获取用户信息菜单树
      await store.dispatch("user/getCurrentUserInfo");
      await store.dispatch("user/getResource");
    }
  } catch (error) {
    console.warn(error);
  }
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export const resetRouter = async() => {
  const newRouter = createRouter();

  // reset router
  router.matcher = newRouter.matcher;
  await store.dispatch("user/getResource");
  // 获取流量平台
  store.dispatch("common/getPlatForm");
};

export default router;
