<!--
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2021-10-19 11:38:35
 * @LastEditors: Please set LastEditors
 * @Description: 主文件
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Cookies from "js-cookie";
// import { JUMP_LOGIN_URL } from '@/utils/auth'
export default {
  name: "App",
  created() {
    if (!Cookies.get("TGC")) {
      this.$store.dispatch("user/logout");
      return;
    }
  }
};
</script>

<style lang="scss">
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
  }
</style>
