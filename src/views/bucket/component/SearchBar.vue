<template>
  <div class="search-bar">
    <input 
      type="text" 
      placeholder="搜索文件或存储空间..." 
      v-model="searchQuery"
    >
    <button class="search-btn">
      <i class="fas fa-search"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input {
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 2rem;
  outline: none;
  width: 200px;
}

.search-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}
</style> 