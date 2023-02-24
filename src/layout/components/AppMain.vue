<!--
 * @Author: your name
 * @Date: 2021-05-10 17:46:43
 * @LastEditTime: 2022-06-29 16:48:21
 * @LastEditors: Please set LastEditors
 * @Description: 主文件
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss">
.app-main {
  /*50 = navbar  */
  height: calc(100% - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
  >div {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    @include scroll-bar(5px);
  }
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
