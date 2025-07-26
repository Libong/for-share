<script lang="ts" setup>
// import Button5 from "@/components/common/button/Button5.vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <div>
    <!--    <Button6></Button6>-->
    <el-config-provider :locale="zhCn">
      <router-view :key="$route.fullPath"></router-view>
    </el-config-provider>
  </div>
</template>
