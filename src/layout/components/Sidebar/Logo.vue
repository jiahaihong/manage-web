<!--
 * @Author: georege.qiao
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-06-30 10:34:12
 * @LastEditors: Please set LastEditors
 * @Description: logo组件
-->
<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          :src="logo"
          class="sidebar-logo"
        >
        <h1
          v-else
          class="sidebar-title"
        >
          <span style="color:#677392;margin:0 18px;">|</span>
          <span>{{ title }}</span>
        </h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          :src="logo"
          class="sidebar-logo"
        >
        <h1 class="sidebar-title">
          <span style="color:#677392;margin:0 18px;">|</span>
          <span>{{ title }}</span>
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: "客户管理中心",
      logo: require("@/assets/images/logo.svg")
    };
  }
};
</script>

<style lang="scss" scoped>
// @import "@/styles/variables.scss";
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 78px;
  line-height: 50px;
  background: $menuBg;
  text-align: center;
  overflow: hidden;
  padding-top: 18px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: bold;
      line-height: 22px;
      color: $color-deepgray;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
