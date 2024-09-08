<script lang="ts" setup>

</script>

<template>
  <div class="login-container">
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  /*视口宽度的百分比 vw*/
  width: 100vw;
  /*作为flex容器*/
  display: flex;
  /*类似水平和垂直居中 */
  justify-content: center;
  align-items: center;
  /*视口高度的百分比 vh*/
  height: 100vh;
  background: url("../../assets/login-light-bg.png") no-repeat center center;
  /*背景大小 覆盖整个 会失真*/
  background-size: cover;
}
</style>