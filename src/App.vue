<script lang="ts" setup>

</script>

<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view :key="$route.fullPath"></router-view>
    </el-config-provider>
  </div>
</template>
