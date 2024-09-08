<script lang="ts" setup>
import feather from 'feather-icons';
import {onMounted} from "vue";
import router from "@/router";

onMounted(() => {
  feather.replace();
});

function toHome() {
  router.push("/home")
}

function toMine() {
  router.push("/mine")
}

function toShare() {
  router.push("/home")
}
</script>

<template>
  <div class="bg-container">
    <nav class="navbar">
      <ul class="navbar__lu">
        <li class="navbar__li" @click="toHome">
          <a class="navbar__link">
            <i data-feather="home"></i>
            <span>首页</span>
          </a>
        </li>
        <li class="navbar__li" @click="toMine">
          <a class="navbar__link">
            <i data-feather="user"></i>
            <span>我的</span></a>
        </li>
        <li class="navbar__li" @click="toHome">
          <a class="navbar__link">
            <i data-feather="slack"></i>
            <span>分享</span></a>
        </li>
      </ul>
    </nav>
    <div class="content">
      <router-view/> <!-- 主内容区域 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>