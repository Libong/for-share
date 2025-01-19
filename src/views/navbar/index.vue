<script lang="ts" setup>
import feather from 'feather-icons';
import {onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
import Moon from "@/assets/moon.svg"
import Settings from "@/assets/settings.svg"
import Bell from "@/assets/bell.svg"
import {userInfoInterface} from "@/views/login/Login";
import EditProfile from '@/views/mine/edit-profile/index.vue'

function initModeSwitch() {
  let modeSwitch = document.querySelector('.mode-switch');
  if (modeSwitch === null) {
    return;
  }
  modeSwitch.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');
    modeSwitch.classList.toggle('active');
  });
}

const userInfo = reactive({
  account: "",
  avatar: "",
  has_password: false
})

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const showProfileEdit = ref(false)
const isClosing = ref(false)

const handleEditProfile = () => {
  showDropdown.value = false
  showProfileEdit.value = true
}

const handleCloseProfile = () => {
  isClosing.value = true
  setTimeout(() => {
    showProfileEdit.value = false
    isClosing.value = false
  }, 300) // 动画持续时间
}

const profileDropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (
      profileDropdownRef.value &&
      !profileDropdownRef.value.contains(event.target as Node) &&
      showDropdown.value
  ) {
    showDropdown.value = false
  }
}

onMounted(() => {
  feather.replace();
  initUserInfo();
  initModeSwitch();
  document.addEventListener('click', handleClickOutside)
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function initUserInfo() {
  let userInfoResp = await userInfoInterface();
  userInfo.avatar = userInfoResp.avatar;
  userInfo.account = userInfoResp.account;
  userInfo.has_password = userInfoResp.has_password;
}

function to(path: string) {
  router.push(path)
}

const options = [
  {label: '首页', path: '/home', feather: 'home'},
  {label: '记录', path: '/navbar/mine', feather: 'clipboard'},
  {label: '分享', path: '/share', feather: 'slack'}
]

const navbarEl = ref()

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
        <div ref="profileDropdownRef" class="profile-dropdown">
          <!--          -->
          <button class="profile-btn" @click="toggleDropdown">
            <img :src="userInfo.avatar" alt=""/>
            <span>{{ userInfo.account }}</span>
          </button>
          <div v-show="showDropdown" class="dropdown-menu">
            <div class="dropdown-item" @click="handleEditProfile">
              <i class="iconfont icon-edit"></i>
              <span>个人信息</span>
            </div>
            <!-- 可以添加更多下拉选项 -->
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <router-view/>
    </div>
    <div v-if="showProfileEdit" class="profile-modal">
      <div class="modal-backdrop" @click="handleCloseProfile"></div>
      <div :class="{ 'slide-out': isClosing }" class="modal-content">
        <EditProfile/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "index";
@import "mineDropDown";
</style>
