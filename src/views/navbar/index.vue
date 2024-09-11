<script lang="ts" setup>
import feather from 'feather-icons';
import {onMounted, ref} from "vue";
import router from "@/router";
import Mine from '../mine/index.vue'

const navbarEl = ref()

onMounted(() => {
  feather.replace();
});

function to(path:string) {
  router.push(path)
}


const options = [
  {label:'首页',path:'/home',feathe:'home'},
  {label:'我的',path:'/mine',feathe:'user'},
  {label:'分享',path:'/share',feathe:'slack'}
]


function mouseenter(){
  navbarEl.value.at(-1).classList.add('navbar__transition')

}

function mouseleave(){
  navbarEl.value.at(-1).classList.remove('navbar__transition')
}
</script>

<template>
  <div class="bg-container">
    <nav class="navbar">
      <ul class="navbar__lu" @mouseenter="mouseenter" @mouseleave="mouseleave">
        <li ref="navbarEl" class="navbar__li" @click="to(item.path)" v-for="item in options" >
          <a class="navbar__link">
            <i :data-feather="item.feathe"></i>
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
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "index";
</style>
