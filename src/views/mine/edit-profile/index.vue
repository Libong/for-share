<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from "element-plus";

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const defaultAvatar = '/src/assets/default-avatar.png'

interface UserInfo {
  username: string
  avatar: string
}

interface Passwords {
  current: string
  new: string
  confirm: string
}

const userInfo = reactive<UserInfo>({
  username: '',
  avatar: ''
})

const passwords = reactive<Passwords>({
  current: '',
  new: '',
  confirm: ''
})

function showMessage(msg: string, state: CommonMessageState) {
  ElMessage({
    message: msg,
    type: state,
    plain: true,
    customClass: "global-message",
    duration: 1000
  });
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSave = async () => {
  if (passwords.new !== passwords.confirm) {
    showMessage('两次输入的密码不一致', CommonMessageState.Error)
    return
  }

  try {
    // 这里添加保存信息的API调用
    showMessage('保存成功', CommonMessageState.Success)
    router.back()
  } catch (error) {
    showMessage('保存失败，请重试', CommonMessageState.Error)
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="edit-profile-body">
    <div class="edit-profile-container">
      <div class="profile-header">
        <div class="avatar-wrapper" @click="triggerUpload">
          <img :src="userInfo.avatar || defaultAvatar" class="avatar-image"/>
          <div class="avatar-overlay">
            <i class="iconfont icon-camera"></i>
          </div>
        </div>
        <input
            ref="fileInput"
            accept="image/*"
            style="display: none"
            type="file"
            @change="handleAvatarUpload"
        />
      </div>

      <div class="form-section">
        <div class="info-item">
          <label>用户名</label>
          <div class="info-content">
            <input
                v-model="userInfo.username"
                class="info-value"
                placeholder="请输入用户名"
            />
            <button class="edit-btn">
              <i class="iconfont icon-edit"></i>
            </button>
          </div>
        </div>

        <div class="info-item">
          <label>当前密码</label>
          <div class="info-content">
            <input
                v-model="passwords.current"
                class="info-value"
                placeholder="请输入当前密码"
                type="password"
            />
            <button class="edit-btn">
              <i class="iconfont icon-edit"></i>
            </button>
          </div>
        </div>

        <div class="info-item">
          <label>新密码</label>
          <div class="info-content">
            <input
                v-model="passwords.new"
                class="info-value"
                placeholder="请输入新密码"
                type="password"
            />
            <button class="edit-btn">
              <i class="iconfont icon-edit"></i>
            </button>
          </div>
        </div>

        <div class="info-item">
          <label>确认密码</label>
          <div class="info-content">
            <input
                v-model="passwords.confirm"
                class="info-value"
                placeholder="请确认新密码"
                type="password"
            />
            <button class="edit-btn">
              <i class="iconfont icon-edit"></i>
            </button>
          </div>
        </div>

        <div class="button-group">
          <button class="cancel-btn" @click="handleCancel">取消</button>
          <button class="save-btn" @click="handleSave">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./index.scss";
</style> 