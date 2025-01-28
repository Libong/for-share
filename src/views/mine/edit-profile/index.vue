<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {ElDialog, ElMessage} from "element-plus";
import {Camera, Edit} from '@element-plus/icons-vue'
import {fileUploadInterface, UploadFileType} from "@/api/proto/fileinterface";
import {CommonMessageState} from "@/config/enum";
import {UploadFileTypeText} from "@/config/common";

// 定义 props
let props = defineProps<{
  userInfo: {
    account: string
    avatar: string
    encryptPhone: string,
    hasPassword: boolean
  }
}>()

// 修改 emit 定义，添加回调函数参数
const emit = defineEmits<{
  'update-nickname': [
    nickname: string,
    callback: (success: boolean) => void
  ]
  'update-avatar': [
    avatar: string,
    callback: (success: boolean) => void
  ]
  'update-password': [
    passwords: { current: string, new: string },
    callback: (success: boolean) => void
  ]
  'update-phone': [
    phone: string,
    callback: (success: boolean) => void
  ]
}>()
const fileInput = ref<HTMLInputElement | null>(null)

// 控制修改弹窗的显示
const showNicknameDialog = ref(false)
const showPasswordDialog = ref(false)
const showPhoneDialog = ref(false)

// 临时存储修改的值
const tempUserInfo = reactive({
  account: '',
})

const passwords = reactive({
  current: '',
  new: '',
  confirm: ''
})

const tempPhone = ref('')

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

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    // 创建 FormData 对象
    const formData = new FormData()
    formData.append('file', file)
    const params = {
      [UploadFileTypeText]: UploadFileType.UploadFileTypeImage
    }
    // 调用上传接口
    const resp = await fileUploadInterface(formData, params);

    // 假设接口返回的数据格式为 { url: string }
    const avatarUrl = resp.Url;

    // 更新用户头像
    emit('update-avatar', avatarUrl, (success) => {
      if (success) {
        showMessage('头像更新成功', CommonMessageState.Success)
      } else {
        showMessage('头像更新失败', CommonMessageState.Error)
      }
    })
  } catch (error) {
    console.error('Upload failed:', error)
    showMessage('文件上传失败', CommonMessageState.Error)
  } finally {
    // 无论成功还是失败，都清空 input 的值
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const openNicknameDialog = () => {
  tempUserInfo.account = props.userInfo.account
  showNicknameDialog.value = true
}

const saveNickname = async () => {
  emit('update-nickname', tempUserInfo.account, (success) => {
    if (success) {
      showMessage('保存成功', CommonMessageState.Success)
      showNicknameDialog.value = false
    } else {
      showMessage('保存失败，请重试', CommonMessageState.Error)
    }
  })
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

  emit('update-password',
      {
        current: passwords.current,
        new: passwords.new
      },
      (success) => {
        if (success) {
          showMessage('密码修改成功', CommonMessageState.Success)
          showPasswordDialog.value = false
        } else {
          showMessage('修改失败，请重试', CommonMessageState.Error)
        }
      }
  )
}

const openPhoneDialog = () => {
  tempPhone.value = props.userInfo.encryptPhone || ''
  showPhoneDialog.value = true
}

const savePhone = () => {
  // 简单的手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(tempPhone.value)) {
    showMessage('请输入正确的手机号', CommonMessageState.Error)
    return
  }

  emit('update-phone', tempPhone.value, (success) => {
    if (success) {
      showMessage('手机号更新成功', CommonMessageState.Success)
      showPhoneDialog.value = false
    } else {
      showMessage('更新失败，请重试', CommonMessageState.Error)
    }
  })
}
</script>

<template>
  <div class="edit-profile-body">
    <div class="edit-profile-header">
      <span>个人信息</span>
    </div>
    <div class="profile-container">
      <div class="avatar-section">
        <div class="avatar-wrapper" @click="triggerUpload">
          <img :src="props.userInfo.avatar" alt="" class="avatar-image"/>
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
            <span class="info-value">{{ props.userInfo.account }}</span>
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
            <span class="info-value">{{ props.userInfo.encryptPhone || '未绑定' }}</span>
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
            v-model="tempUserInfo.account"
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

    <!-- 添加手机号修改弹窗 -->
    <el-dialog
        v-model="showPhoneDialog"
        :close-on-click-modal="false"
        class="edit-profile-update-dialog"
        title="修改手机号"
        width="30%"
    >
      <div class="dialog-content">
        <input
            v-model="tempPhone"
            class="dialog-input"
            maxlength="11"
            placeholder="请输入新的手机号"
            type="tel"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPhoneDialog = false">取消</el-button>
          <el-button type="primary" @click="savePhone">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import "./index.scss";
</style>