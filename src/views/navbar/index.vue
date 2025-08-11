<script lang="ts" setup>
import feather from 'feather-icons';
import {ComponentPublicInstance, onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
import {loginOutInterface, updateUserInfoInterface, userInfoInterface} from "@/api/proto/loginInterface";
import EditProfile from '@/views/mine/edit-profile/index.vue'
import {ShowCommonMessage} from "@/tool/message";

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

//当前被选中的菜单下标 用于激活样式和取消样式(在悬停时)
const activeIndex = ref(-1)
//上次选中的菜单下标 用来还原当鼠标移开后 当前页面的菜单能够被选中
const lastActiveIndex = ref(-1)
//上次选中的菜单的偏移量 用于还原伪元素位置
let lastIndicatorLeft = 0

/*菜单动画*/
const navbarEl = ref<HTMLLIElement[]>([]);

function setNavbarEl(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLLIElement) {
    navbarEl.value[index] = el; // 直接赋值到指定索引位置
  }
}

const mouseenter = (index: number) => {
  //保存当前的激活下标
  lastActiveIndex.value = activeIndex.value
  //取消激活样式
  activeIndex.value = -1
  const el = navbarEl.value[index];
  if (el) {
    const firstEl = navbarEl.value[0];
    //设置伪元素的位置为当前移动到的菜单元素 并显示
    if (firstEl) {
      firstEl.style.setProperty('--indicator-left', `${el.offsetLeft}px`);
      firstEl.style.setProperty('--indicator-opacity', '1');
    }
  }
};

const mouseleave = () => {
  //还原激活样式
  activeIndex.value = lastActiveIndex.value
  const firstEl = navbarEl.value[0];
  if (firstEl) {
    firstEl.style.setProperty('--indicator-left', `${lastIndicatorLeft}px`);
    console.log(activeIndex.value)
    if (activeIndex.value === -1) {
      firstEl.style.setProperty('--indicator-opacity', '0');
    }
  }
};

function to(path: string, index: number) {
  //设置激活位置偏移量
  const el = navbarEl.value[index];
  if (el) {
    const firstEl = navbarEl.value[0];
    if (firstEl) {
      lastIndicatorLeft = el.offsetLeft;
    }
  }
  //设置激活下标
  activeIndex.value = index
  lastActiveIndex.value = index;
  switch (path) {
    case "Record":
    case "Share":
      ShowCommonMessage("功能暂未开放", "info");
      return
    default:
      break;
  }
  //TODO 使用name才能跳转 使用path的话就不行 除非在app.vue中设置routerView标签的key为$route.fullPath
  router.push({name: path})
}

const options = [
  {label: '首页', path: 'Home', feather: 'home'},
  {label: '记录', path: 'Record', feather: 'clipboard'},
  {label: '分享', path: 'Share', feather: 'slack'},
  {label: '日历', path: 'Calendar', feather: 'calendar'}
]

/*接口*/
async function handleLoginOut() {
  await loginOutInterface();
  await router.push("login");
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
    await updateUserInfoInterface({curPassword: passwords.current, newPassword: passwords.new});
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
          <ul class="navbar__lu">
            <li v-for="(item,index) in options"
                :ref="(el) => setNavbarEl(el, index)"
                :class="{ active: activeIndex === index }"
                class="navbar__li"
                @click="to(item.path,index)"
                @mouseenter="() => mouseenter(index)"
                @mouseleave="() => mouseleave()">
              <a
                  class="navbar__link">
                <i :data-feather="item.feather"></i>
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="header-right">
        <!--        <button class="mode-switch" title="Switch Theme" @click="handleSetting">-->
        <!--          <img :src="Moon" alt=""/>-->
        <!--        </button>-->
        <!--        <button class="setting-btn" title="Add New Project" @click="handleNotice">-->
        <!--          <img :src="Settings" alt=""/>-->
        <!--        </button>-->
        <!--        <button class="notification-btn" @click="handleMode">-->
        <!--          <img :src="Bell" alt=""/>-->
        <!--        </button>-->
        <div ref="profileDropdownRef"
             class="profile-dropdown">
          <button class="profile-btn">
            <img :src="userInfo.avatar" alt=""/>
            <span>{{ userInfo.account }}</span>
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-item" @click="handleEditProfile">
              <span>个人信息</span>
            </div>
            <div class="dropdown-item" @click="handleLoginOut">
              <span>退  出</span>
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
