<template>
  <div class="empty-state">
    <img alt="" src="@/assets/noData.jpg"/>
    <div class="text">好像没有东西诶</div>
  </div>
</template>

<script lang="ts" setup>
// 这里不需要额外的 Composition API 逻辑，因为样式完全由 CSS 控制
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  
  img {
    width: 10%;
  }
}

.text {
  font-size: 18px;
  color: #42517b;
}
</style>