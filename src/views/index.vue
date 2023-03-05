<template>
  <a-layout class="layoutbox" id="components-layout-demo-custom-trigger">
    <!-- 左侧菜单 -->
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <div class="logo">{{ collapsed ? "admin" : "管理云平台" }}</div>
      <a-menu
        theme="dark"
        mode="inline"
        :defaultSelectedKeys="['1']"
        @click="selectItem"
        :selectedKeys="[$route.path]"
      >
        <a-sub-menu v-for="item in menu" :key="item.path">
          <span slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span v-show="!collapsed">{{ item.name }}</span>
          </span>
          <a-menu-item
            v-for="childrenitem in item.children"
            :key="childrenitem.showPath"
          >
            <i class="iconfont" :class="childrenitem.icon"></i>
            <span>{{ childrenitem.name }}</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- 页面整体头部导航 -->
      <a-layout-header class="headbox" style="background: #fff; padding: 0">
        <!-- 左侧展示与隐藏 -->
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div class="user-head">
          <!-- 切换语言 -->
          <!-- <div class="toggle">
            <a-select :defaultValue="defaultValue" @change="handleChange">
              <a-select-option value="cn">中文</a-select-option>
              <a-select-option value="en">English</a-select-option>
              <a-select-option value="ja">日本語</a-select-option>
            </a-select>
          </div> -->
          <!-- 用户信息 -->
          <a-dropdown>
            <a class="ant-dropdown-link" href="#">
              {{ UserInfo.username }}
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item @click="headClick('home')">
                <i class="iconfont iconicon_huabanfuben"></i>
                <span>{{ $t("logistics.index") }}</span>
              </a-menu-item>
              <a-menu-item @click="headClick('msg')">
                <i class="iconfont icongerenzhongxin"></i>
                <span>{{ $t("logistics.PersonalInformation") }}</span>
              </a-menu-item>
              <a-menu-item @click="headClick('quit')">
                <i class="iconfont icontuichu2"></i>
                <span>{{ $t("logistics.LogOut") }}</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <!-- 中间主体部分 -->
      <a-layout-content
        :style="{
          margin: '10px 10px',
          padding: '0px',
          background: '#fff',
          minHeight: '280px'
        }"
      >
        <router-view class="avue-view" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { disposereq } from "@/utils/util";
import router from "@/router";
import Layout from "@/views/index/";
export default {
  data() {
    return {
      collapsed: false,
      menu: [],
      UserInfo: {
        username: '测试'
      },
      defaultValue: localStorage.lang
    };
  },
  created() {
    this.getMenu();
    //  获取用户信息
    // this.UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  },
  methods: {
    // 获取菜单
    getMenu() {
      const data = [
        {
          "id":1000,"parentId":-1,
          "icon":"iconquanxianguanli","name":"权限管理","spread":false,"path":"/upms","component":"Layout","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"权限管理","sort":0,
          "children":[
            {
              "id":1100,
              "parentId":1000,
              "children":[],
              "icon":"iconyonghuguanli",
              "name":"用户管理","spread":false,"path":"user","component":"views/authority/userManage",
              "authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"用户管理","sort":1
            },
            {
              "id":1300,"parentId":1000,"children":[],"icon":"iconjiaoseguanli","name":"角色管理","spread":false,"path":"role","component":"views/authority/roleManage","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"角色管理","sort":3
            },
            {
              "id":1200,"parentId":1000,"children":[],"icon":"iconcaidanguanli","name":"菜单管理","spread":false,"path":"menu","component":"views/admin/menu/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"菜单管理","sort":2},
            
            {
              "id":1400,"parentId":1000,"children":[],"icon":"iconbumenguanli","name":"部门管理","spread":false,"path":"dept","component":"views/admin/dept/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"部门管理","sort":4}
          ],
        },
        {
          "id":2000,"parentId":-1,
          "children":[{"id":2100,"parentId":2000,"children":[],"icon":"iconrizhiguanli2","name":"日志管理","spread":false,"path":"log","component":"views/admin/log/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"日志管理","sort":5},{"id":2200,"parentId":2000,"children":[],"icon":"iconzidianguanli","name":"字典管理","spread":false,"path":"dict","component":"views/admin/dict/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"字典管理","sort":6},{"id":2300,"parentId":2000,"children":[],"icon":"icondaimashengcheng","name":"代码生成","spread":false,"path":"gen","component":"views/gen/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"代码生成","sort":8},{"id":2400,"parentId":2000,"children":[],"icon":"icondishuizhongduanguanli","name":"终端管理","spread":false,"path":"client","component":"views/admin/client/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"终端管理","sort":9},{"id":2600,"parentId":2000,"children":[],"icon":"iconlingpai","name":"令牌管理","spread":false,"path":"token","component":"views/admin/token/index","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"令牌管理","sort":11}],
          "icon":"iconxitongguanli","name":"系统管理","spread":false,"path":"/admin","component":"Layout","authority":null,"redirect":null,"keepAlive":"0","code":null,"type":"0","label":"系统管理","sort":1
        }
      ]
      this.formatData(data);
      let asyncRouters = this.routerPackag(data);
      asyncRouters.push({ path: "*", redirect: "/index" });
      router.addRoutes(asyncRouters);
          // disposereq(this, err);
    },
    // 路由数据重新封装
    routerPackag(routers) {
      let accessedRouters = routers.filter(router => {
        if (router.component === "Layout") {
          // Layout组件特殊处理
          router.component = Layout;
        } else {
          //处理组件---重点
          router.component = this.loadView(router.component);
        }
        //存在子集
        if (router.children && router.children.length) {
          router.children = this.routerPackag(router.children);
        }
        return true;
      });
      return accessedRouters;
    },
    loadView(view) {
      // 路由懒加载
      return () => import(`@/${view}`);
    },
    // 菜单点击事件
    selectItem(item) {
      this.$router.push({
        path: item.key
      });
    },
    // 由于数据格式不符合，需要对数据进行处理
    formatData(data) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].children.length; j++) {
          data[i].children[j].showPath =
            data[i].path + "/" + data[i].children[j].path;
        }
      }
      console.warn(data)
      this.menu = data;
    },
    headClick(type) {
      if (type == "home") {
        this.$router.push({
          path: "/index"
        });
      } else if (type == "msg") {
      } else {
        localStorage.removeItem("token");
        this.$router.push({
          path: "/login"
        });
      }
    },
    // 切换多语言
    handleChange(val) {
      this.$root.Bus.$emit("switchLanguage", val);
    }
  }
};
</script>
<style>
.layoutbox {
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}
.headbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconfont {
  font-size: 14px !important;
  margin-right: 5px;
}
.toggle {
  display: inline-block;
  box-sizing: border-box;
  padding-right: 20px;
}
.user-head {
  display: inline-block;
  box-sizing: border-box;
  padding-right: 20px;
}
</style>
