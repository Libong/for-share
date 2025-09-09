<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// onMounted(() => {
//   setRem();
//   window.addEventListener('resize', setRem);
// })
//
// function setRem() {
//   const baseSize = 37.5; // 设计稿宽度 375px 下的基准
//   const scale = document.documentElement.clientWidth / 375;
//   document.documentElement.style.fontSize = baseSize * scale + 'px';
// }
</script>

<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
