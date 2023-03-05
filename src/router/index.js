import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: '登录页',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/views/authority/login'),
  meta: {
    requireAuth: false,
  },
}, {
  path: '/',
  name: '首页',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/views/index'),
  meta: {
    requireAuth: true,
  },
  children: [{
    path: '/index',
    name: '首页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/dashboard/index'),
    meta: {
      requireAuth: true,
    }
  }]
}]

const router = new VueRouter({
  // 页面刷新白屏问题
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router