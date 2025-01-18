<script lang="ts" setup>
import feather from 'feather-icons';
import {onMounted, onUnmounted, reactive, ref} from "vue";
import router from "@/router";
import Moon from "@/assets/moon.svg"
import Settings from "@/assets/settings.svg"
import Bell from "@/assets/bell.svg"
import {userInfoInterface} from "@/views/login/Login";
import { ArrowLeft } from '@element-plus/icons-vue'
import EditProfile from '@/views/mine/edit-profile/index.vue'

const navbarEl = ref()

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

const handleEditProfile = () => {
  showDropdown.value = false
  showProfileEdit.value = true
}

const handleCloseProfile = () => {
  showProfileEdit.value = false
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
          <button class="profile-btn" @click.stop="toggleDropdown">
            <img :src="userInfo.avatar" alt=""/>
            <span>{{ userInfo.account }}</span>
          </button>
          <div v-show="showDropdown" class="dropdown-menu" @click.stop>
            <div class="dropdown-item" @click="handleEditProfile">
              <i class="iconfont icon-edit"></i>
              <span>编辑个人信息</span>
            </div>
            <!-- 可以添加更多下拉选项 -->
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <router-view/>
    </div>

    <div class="profile-modal" v-if="showProfileEdit">
      <div class="modal-backdrop" @click="handleCloseProfile"></div>
      <div class="modal-content">
        <div class="modal-header">
          <el-button class="back-btn" @click="handleCloseProfile">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span>个人信息</span>
        </div>
        <EditProfile />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "index";

.profile-dropdown {
  position: relative;

  .profile-btn {
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: transparent;
    border: 0;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 8px;
    }

    span {
      color: var(--main-color);
      font-size: 14px;
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 150px;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    right: 20px;
    width: 8px;
    height: 8px;
    background: white;
    transform: rotate(45deg);
    box-shadow: -2px -2px 2px rgba(0, 0, 0, 0.02);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: var(--main-color);
  cursor: pointer;
  transition: all 0.3s ease;

  i {
    margin-right: 8px;
    font-size: 16px;
  }

  span {
    font-size: 14px;
  }

  &:hover {
    background: rgba(142, 68, 173, 0.1);
    color: #8e44ad;
  }
}

// 添加暗色主题支持
:root[class='dark'] {
  .dropdown-menu {
    background: var(--background-dark);

    &::before {
      background: var(--background-dark);
    }
  }

  .dropdown-item {
    color: var(--main-color-dark);

    &:hover {
      background: rgba(142, 68, 173, 0.2);
    }
  }
}

.profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;
  background: var(--app-background);
  z-index: 1;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--header-bg);

  .back-btn {
    padding: 8px;
    margin-right: 12px;
    border: none;
    background: transparent;
    color: var(--main-color);

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .el-icon {
      font-size: 20px;
    }
  }

  span {
    font-size: 16px;
    font-weight: 500;
    color: var(--main-color);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

// 暗色主题支持
:root[class='dark'] {
  .modal-content {
    background: var(--background-dark);
  }

  .modal-header {
    background: var(--background-dark);
    border-color: var(--border-color-dark);

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
