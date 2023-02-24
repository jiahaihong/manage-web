<!--
 * @Author: your name
 * @Date: 2020-12-03 14:37:54
 * @LastEditTime: 2022-07-04 16:32:12
 * @LastEditors: Please set LastEditors
 * @Description: 主页
-->
<template>
  <div class="dashboard-container">
    <div class="user-info">
      <img
        v-if="avatar"
        :src="avatar"
        class="avtar"
      >
      <svg
        v-else
        class="iconfont"
        aria-hidden="true"
        style="font-size: 80px"
      >
        <use xlink:href="#icontouxiang" />
      </svg>
      <div class="right">
        <span class="name"> Hi ! {{ userInfo.userName }} </span>
        <div>
          <span style="color:#606266;font-size:14px;">欢迎来到客户管理中心。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["userInfo", "avatar"])
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    background: #fff;
    border-radius: 5px;
    margin: 20px;
    padding: 20px;
    // margin-top: 70px;
    .user-info {
      display: flex;
      .avtar {
        width: 80px;
        height: 80px;
      }
      .right {
        display: flex;
        margin-left: 20px;
        flex-direction: column;
        justify-content: center;
        .name {
          margin-bottom: 16px;
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
