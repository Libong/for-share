<script lang="ts" setup>
import feather from 'feather-icons';
import {onMounted, ref} from "vue";
import router from "@/router";
import Moon from "@/assets/moon.svg"
import Settings from "@/assets/settings.svg"
import Bell from "@/assets/bell.svg"

const navbarEl = ref()

onMounted(() => {
  feather.replace();
});

function to(path: string) {
  router.push(path)
}


const options = [
  {label: '首页', path: '/home', feather: 'home'},
  {label: '记录', path: '/navbar/mine', feather: 'clipboard'},
  {label: '分享', path: '/share', feather: 'slack'}
]


function mouseenter() {
  navbarEl.value.at(-1).classList.add('navbar__transition')

}

function mouseleave() {
  navbarEl.value.at(-1).classList.remove('navbar__transition')
}
</script>

<template>
  <div class="bg-container">
    <div class="header">
      <div class="header-left">

      </div>
      <div class="header-center">
        <nav class="navbar">
          <ul class="navbar__lu" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <li v-for="item in options" ref="navbarEl" class="navbar__li" @click="to(item.path)">
              <a class="navbar__link">
                <i :data-feather="item.feather"></i>
                <span>{{ item.label }}</span>
              </a>
            </li>
            <!--        <li class="navbar__li" @click="toMine">-->
            <!--          <a class="navbar__link">-->
            <!--            <i data-feather="user"></i>-->
            <!--            <span>我的</span></a>-->
            <!--        </li>-->
            <!--        <li class="navbar__li" @click="toHome">-->
            <!--          <a class="navbar__link">-->
            <!--            <i data-feather="slack"></i>-->
            <!--            <span>分享</span></a>-->
            <!--        </li>-->
          </ul>
        </nav>
      </div>
      <div class="header-right">
        <button class="mode-switch" title="Switch Theme">
          <img :src="Moon" alt=""/>
        </button>
        <button class="setting-btn" title="Add New Project">
          <img :src="Settings" alt=""/>
        </button>
        <button class="notification-btn">
          <img :src="Bell" alt=""/>
        </button>
        <button class="profile-btn">
          <img src="https://assets.codepen.io/3306515/IMG_2025.jpg"/>
          <span>Aybüke C.</span>
        </button>
      </div>
    </div>

    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>
