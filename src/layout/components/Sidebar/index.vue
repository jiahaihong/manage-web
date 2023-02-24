<!--
 * @Author: george.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-06-30 10:29:31
 * @LastEditors: Please set LastEditors
 * @Description: 侧边栏主文件
-->
<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />

    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="{ collapse: isCollapse }"
    >
      <div class="layout_sidebar_menu_box">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in permissionRoutes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </div>
    </el-scrollbar>

    <div class="layout_sidebar_btn">
      <el-button
        type="primary"
        @click="toggleSideBar"
      >
        <svg
          class="iconfont fs-18"
          aria-hidden="true"
        >
          <use
            :xlink:href="
              isCollapse ? '#iconcaidanzhankai' : '#iconcaidanshouqi'
            "
          />
        </svg>
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar", "permissionRoutes"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return "@/styles/variables.scss";
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    handleClick() {
      this.$router.push("/");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    }
  }
};
</script>
<style lang="scss">
.el-scrollbar:not(.collapse) {
  .layout_sidebar_menu_box {
    padding: 0 20px;
  }
}
.layout_sidebar_btn {
  padding-right: 10px;
  text-align: right;
  .el-button--primary {
    color: $menu-noselect-font !important;
    background: $menu-select-bg !important;
    border: 0;
    text-shadow: none;
    box-shadow: none;
  }
}
</style>
