<template>
  <div class="bucket-container">
    <main class="bucket-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.bucket-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.bucket-content {
  padding: 0.5rem;
  width: 100%;
  margin: 0 auto;
  height: 100%;
}
</style>