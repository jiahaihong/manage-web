<!--
 * @Author: george.qiao
 * @Date: 2022-11-08 10:37:50
 * @LastEditTime: 2022-12-27 10:57:16
 * @LastEditors: Please set LastEditors
 * @Description: 在线客户 所有组件通用，修改要谨慎！！！！！！
-->
<template>
  <div
    class="suspensionFrame"
    :style="style"
    @drag="dragoverHandle"
  >
    <a
      href="https://applink.feishu.cn/T8y0kkn3qRZ2"
      target="_blank"
    >
      <div class="suspensionFrame-box">
        <div class="service-img" />
        <p>在线客服</p>
      </div>
    </a>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      divHeight: 80,
      top: 170
    };
  },
  computed: {
    style() {
      return `top: ${this.top}px`
    }
  },
  watch: {},
  created() {
    const top = localStorage.getItem('suspensionFrameHeight')
    if (Number(top) === 0) {
      this.top = window.innerHeight - this.divHeight
    } else {
      this.top = Number(top)
    }
  },
  mounted() {

  },
  // 方法集合
  methods: {
    dragoverHandle(event) {
      // 拖拽指标
      const current = event.clientY
      if (current === 0) {
        return
      }
      const allHeight = window.innerHeight
      const bottom = allHeight - current
      if (bottom < 80) { // 距离底部有限制
        this.top = allHeight - this.divHeight
      } else if (current < 80) { // 距离顶部有限制
        this.top = 80
      } else {
        this.top = current
      }
      localStorage.setItem('suspensionFrameHeight', this.top)
      // console.warn(current, this.top)
    }
  },
}
</script>
<style lang='scss'>
.suspensionFrame {
  position: fixed;
  right: 16px;
  bottom: 70px;
  cursor: pointer;
  z-index: 2003;
  .suspensionFrame-box {
    .service-img {
      width: 60px;
      height: 50px;
      background-repeat: no-repeat;
      background-image: url(./feishu.svg);
      animation: swing-905a58e8 .5s cubic-bezier(.7, .01, .35, 1) infinite alternate
    }
    @keyframes swing-905a58e8 {
      0% {
        -webkit-transform: rotate(-5deg);
        transform: rotate(-5deg)
      }

      to {
        -webkit-transform: rotate(5deg);
        transform: rotate(5deg)
      }
    }
    p {
      text-align: center;
      font-size: 12px;
      margin: 2px 0;
      font-weight: 500;
      background-color: #2684f1;
      border-radius: 12px;
      padding: 2px 8px;
      color: #fff;
      display: inline-block;
      white-space: nowrap;
    }
  }
}
</style>
