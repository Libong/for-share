<script lang="ts" setup>

// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <div>
    <!--    <CardView></CardView>-->
    <el-config-provider :locale="zhCn">
      <router-view :key="$route.fullPath"></router-view>
    </el-config-provider>
  </div>
</template>
