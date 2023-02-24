<template>
  <div class="navbar">
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown
        class="avatar-container ml-20"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            v-if="avatar"
            :src="avatar"
            class="user-avatar"
          >
          <svg
            v-else
            class="iconfont fs-28"
            aria-hidden="true"
          >
            <use xlink:href="#icontouxiang" />
          </svg>
          <span style="margin-left: 3px">{{ userInfo.userName || "用户" }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <el-dropdown-item>
            <span
              style="display: block"
              @click="logout"
            >退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userInfo", "avatar"]),
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  display: flex;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-menu {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }
    .cloudy_icon {
      text-align: center;
      cursor: pointer;
      font-size: 24px;
      color: var(--global-color-primary);
      height: 24px;
      line-height: 24px;
    }
    .avatar-container {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 14px 0 2px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #2d3446;
      background: #f3f6fe;
      border-radius: 6px;

      .avatar-wrapper {
        // position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          display: block;
          margin-right: 5px;
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          margin-left: 5px;
          // position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
