<script lang="ts" setup>
import feather from 'feather-icons';
import {onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
import Moon from "@/assets/moon.svg"
import Settings from "@/assets/settings.svg"
import Bell from "@/assets/bell.svg"
import {updateUserInfoInterface, userInfoInterface} from "@/api/proto/loginInterface";
import EditProfile from '@/views/mine/edit-profile/index.vue'

onMounted(() => {
  feather.replace();
  initUserInfo();
  initModeSwitch();
});

onUnmounted(() => {
  // No need to remove event listeners as we're not using handleClickOutside
});

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
  encryptPhone: "",
  hasPassword: false
})


const showProfileEditModel = ref(false)
const isProfileEditModelLeave = ref(false)

const handleEditProfile = () => {
  showProfileEditModel.value = true
}

const handleCloseProfile = () => {
  isProfileEditModelLeave.value = true
  setTimeout(() => {
    showProfileEditModel.value = false
    isProfileEditModelLeave.value = false
  }, 300) // 动画持续时间
}

const profileDropdownRef = ref<HTMLElement | null>(null)

async function initUserInfo() {
  let userInfoResp = await userInfoInterface();
  userInfo.avatar = userInfoResp.avatar;
  userInfo.account = userInfoResp.account;
  userInfo.hasPassword = userInfoResp.hasPassword;
  userInfo.encryptPhone = userInfoResp.encryptPhone;
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

const handleUpdateNickname = async (nickname: string, callback: (success: boolean) => void) => {
  try {
    await updateUserInfoInterface({account: nickname});
    userInfo.account = nickname;
    callback(true);
  } catch (error) {
    callback(false);
  }
}

const handleUpdateAvatar = async (avatar: string, callback: (success: boolean) => void) => {
  try {
    await updateUserInfoInterface({avatar});
    userInfo.avatar = avatar;
    callback(true);
  } catch (error) {
    callback(false);
  }
}

const handleUpdatePassword = async (
    passwords: { current: string, new: string },
    callback: (success: boolean) => void
) => {
  try {
    await updateUserInfoInterface({password: passwords.new});
    callback(true);
  } catch (error) {
    callback(false);
  }
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
        <div ref="profileDropdownRef"
             class="profile-dropdown">
          <button class="profile-btn">
            <img :src="userInfo.avatar" alt=""/>
            <span>{{ userInfo.account }}</span>
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-item" @click="handleEditProfile">
              <i class="iconfont icon-edit"></i>
              <span>个人信息</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <router-view/>
    </div>
    <div v-if="showProfileEditModel" class="profile-modal">
      <div class="modal-backdrop" @click="handleCloseProfile"></div>
      <div :class="{ 'slide-out': isProfileEditModelLeave }" class="modal-content">
        <EditProfile
            :user-info="userInfo"
            @update-nickname="handleUpdateNickname"
            @update-avatar="handleUpdateAvatar"
            @update-password="handleUpdatePassword"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "index";
@import "mineDropDown";
</style>
