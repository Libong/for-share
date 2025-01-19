<script lang="ts" setup>


import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElDialog, ElMessage} from "element-plus";
import {Camera, Edit} from '@element-plus/icons-vue'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const defaultAvatar = '/src/assets/default-avatar.png'

// 控制修改弹窗的显示
const showNicknameDialog = ref(false)
const showPasswordDialog = ref(false)

interface UserInfo {
  username: string
  avatar: string
  tempUsername?: string // 用于临时存储修改的昵称
  phone?: string
}

interface Passwords {
  current: string
  new: string
  confirm: string
}

const userInfo = reactive<UserInfo>({
  username: '测试用户',
  avatar: '',
  tempUsername: ''
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

const openNicknameDialog = () => {
  userInfo.tempUsername = userInfo.username
  showNicknameDialog.value = true
}

const saveNickname = async () => {
  try {
    // 这里添加保存昵称的API调用
    userInfo.username = userInfo.tempUsername || userInfo.username
    showMessage('保存成功', CommonMessageState.Success)
    showNicknameDialog.value = false
  } catch (error) {
    showMessage('保存失败，请重试', CommonMessageState.Error)
  }
}

const openPasswordDialog = () => {
  passwords.current = ''
  passwords.new = ''
  passwords.confirm = ''
  showPasswordDialog.value = true
}

const savePassword = async () => {
  if (passwords.new !== passwords.confirm) {
    showMessage('两次输入的密码不一致', CommonMessageState.Error)
    return
  }

  try {
    // 这里添加修改密码的API调用
    showMessage('密码修改成功', CommonMessageState.Success)
    showPasswordDialog.value = false
  } catch (error) {
    showMessage('修改失败，请重试', CommonMessageState.Error)
  }
}
</script>

<template>
  <div class="edit-profile-body">
    <div class="edit-profile-header">
      <!--      <el-button class="back-btn" @click="handleCloseProfile">-->
      <!--        <el-icon>-->
      <!--          <ArrowRight/>-->
      <!--        </el-icon>-->
      <!--      </el-button>-->
      <span>个人信息</span>
    </div>
    <div class="profile-container">
      <div class="avatar-section">
        <div class="avatar-wrapper" @click="triggerUpload">
          <img :src="userInfo.avatar || defaultAvatar" class="avatar-image"/>
          <div class="avatar-overlay">
            <el-icon>
              <Camera/>
            </el-icon>
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

      <div class="info-section">
        <div class="info-item">
          <div class="info-label">昵称</div>
          <div class="info-content">
            <span class="info-value">{{ userInfo.username }}</span>
            <el-button class="edit-btn" @click="openNicknameDialog">
              <el-icon>
                <Edit/>
              </el-icon>
            </el-button>
          </div>
        </div>

        <div class="info-item">
          <div class="info-label">手机号</div>
          <div class="info-content">
            <span class="info-value">{{ userInfo.phone || '未绑定' }}</span>
            <el-button class="edit-btn" @click="openPhoneDialog">
              <el-icon>
                <Edit/>
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <div class="action-section">
        <el-button class="password-btn" @click="openPasswordDialog">
          修改密码
        </el-button>
      </div>
    </div>

    <!-- 修改昵称弹窗 -->
    <el-dialog
        v-model="showNicknameDialog"
        :close-on-click-modal="false"
        title="修改昵称"
        width="30%"
    >
      <div class="dialog-content">
        <input
            v-model="userInfo.tempUsername"
            class="dialog-input"
            placeholder="请输入新的昵称"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNicknameDialog = false">取消</el-button>
          <el-button type="primary" @click="saveNickname">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog
        v-model="showPasswordDialog"
        :close-on-click-modal="false"
        class="edit-profile-update-dialog"
        title="修改密码"
        width="30%"
    >
      <div class="dialog-content">
        <input
            v-model="passwords.current"
            class="dialog-input"
            placeholder="请输入当前密码"
            type="password"
        />
        <input
            v-model="passwords.new"
            class="dialog-input"
            placeholder="请输入新密码"
            type="password"
        />
        <input
            v-model="passwords.confirm"
            class="dialog-input"
            placeholder="请确认新密码"
            type="password"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="savePassword">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import "./index.scss";

.edit-btn.el-button {
  padding: 4px 8px;
  height: auto;
  border: none;
  background: transparent;
  color: #8e44ad;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background: rgba(142, 68, 173, 0.1);
  }

  .el-icon {
    font-size: 16px;
  }
}

.password-btn.el-button {
  width: 100%;
  height: 40px;
  border: none;
  background: #8e44ad;
  color: white;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #7d3c98;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style> 