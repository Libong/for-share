<template>
  <div v-if="visible" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <span>存储空间设置</span>
        <button :disabled="isSubmitting" class="close-btn" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form class="settings-form" @submit.prevent="handleSubmit">
        <div class="form-content">
          <!-- 左侧基本设置 -->
          <div class="settings-left">
            <div class="form-item">
              <label>存储空间名称</label>
              <input
                  v-model="props.bucket.name"
                  disabled
                  type="text"
              >
            </div>
            
            <div class="form-item">
              <label>访问权限</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input
                      v-model="props.bucket.accessPolicy"
                      :value="BucketAccessPolicy.Private"
                      type="radio"
                  > 私有
                </label>
                <label class="radio-label">
                  <input
                      v-model="props.bucket.accessPolicy"
                      :value="BucketAccessPolicy.Publish"
                      type="radio"
                  > 公开
                </label>
              </div>
            </div>
            
            <div class="form-item">
              <label>描述</label>
              <textarea
                  v-model="props.bucket.desc"
                  placeholder="请输入存储空间描述信息"
                  rows="3"
              ></textarea>
            </div>
          </div>
          
          <!-- 右侧关联人员 -->
          <div class="settings-right">
            <!--            <div class="account-section">-->
            <label>关联人员权限</label>
            <div class="account-list">
              <div v-for="(account) in displayAccounts"
                   :key="account.accountId"
                   class="account-item">
                <div class="account-item-up">
                  <div class="account-info">
                    <div v-if="account.avatar" class="avatar">
                      <img :alt="account.accountName" :src="account.avatar">
                    </div>
                    <div v-else class="avatar avatar-default">
                      {{ getInitials(account.accountName) }}
                    </div>
                    <span class="account-name">{{ account.accountName }}</span>
                  </div>
                  <div class="account-actions">
                    <div class="access-info-btn">
                      <button
                          :class="['access-btn', { active:displayAccountShowKeyMap.get(account.accountId)  }]"
                          style="width: 100%"
                          title="查看密钥" type="button"
                          @click.stop="toggleAccountKey(account)">
                        <i class="fas fa-key"></i>
                      </button>
                    </div>
                    <div :class="{ flipped: displayAccountShowKeyMap.get(account.accountId) }"
                         class="account-actions-inner">
                      <div class="access-mode-group">
                        <button
                            :class="['access-btn', { active: account.accessMode === 1 }]"
                            title="只读权限"
                            type="button"
                            @click="account.accessMode = 1">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button
                            :class="['access-btn', { active: account.accessMode === 2 }]"
                            title="只写权限"
                            type="button"
                            @click="account.accessMode = 2">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                            :class="['access-btn', { active: account.accessMode === 3 }]"
                            title="读写权限"
                            type="button"
                            @click="account.accessMode = 3">
                          <i class="fas fa-user-shield"></i>
                        </button>
                      </div>
                    </div>
                    <div :class="{ flipped: displayAccountShowKeyMap.get(account.accountId) }" class="access-info">
                      <div class="access-info-key">
                        <button class="copy-icon" type="button" @click.stop="copyToClipboard(account.accessKey)">
                          <i class="fa fa-clone"></i>
                        </button>
                        <div class="access-info-span">
                          <span>Access Key：</span>
                          <span>{{ account.accessKey }}</span>
                        </div>
                      </div>
                      <div class="access-info-secret">
                        <button class="copy-icon" type="button" @click.stop="copyToClipboard(account.accessSecret)">
                          <i class="fa fa-clone"></i>
                        </button>
                        <div class="access-info-span">
                          <span>Access Secret：</span>
                          <span>{{ account.accessSecret }}</span>
                        </div>
                      </div>
                    </div>
                    <button class="btn-remove"
                            title="移除"
                            type="button"
                            @click="confirmRemoveAccount(account)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!--            <div v-if="props.bucket.list.length > 0" class="account-actions-wrapper">-->
            <!--              <button v-if="!showAll && hasMore"-->
            <!--                      class="btn-show-more"-->
            <!--                      type="button"-->
            <!--                      @click="loadMore">-->
            <!--                显示更多 ({{ remainingCount }})-->
            <!--              </button>-->
            <!--              <button v-if="!showAll && props.bucket.list.length > displayCount"-->
            <!--                      class="btn-show-all"-->
            <!--                      type="button"-->
            <!--                      @click="showAllAccounts">-->
            <!--                显示全部-->
            <!--              </button>-->
            <!--            </div>-->
            
            <button class="btn-add-account"
                    type="button"
                    @click="showAddAccountDialog">
              <i class="fas fa-plus"></i> 添加关联人员
            </button>
          </div>
          <!--          </div>-->
        </div>
        
        <div class="form-actions">
          <button
              :disabled="isSubmitting"
              class="btn-cancel"
              type="button"
              @click="closeDialog"
          >取消
          </button>
          <button
              :disabled="isSubmitting"
              class="btn-submit"
              type="submit"
          >
            {{ isSubmitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- 添加关联人员的弹窗 -->
    <div v-if="showAccountDialog" class="account-dialog-overlay" @click.stop="closeAddAccountDialog">
      <div class="dialog-content account-dialog" @click.stop>
        <span>添加关联人员</span>
        <div class="search-box">
          <input v-model="searchAccountName"
                 placeholder="搜索用户..."
                 type="text"
                 @input="searchUsers">
        </div>
        <div class="search-results">
          <div v-if="searchAccounts.length === 0" class="no-results">
            暂无可关联的用户
          </div>
          <div v-for="user in searchAccounts" v-else
               :key="user.accountId"
               class="user-item"
               @click="selectUser(user)">
            <div v-if="user.account != ''">
              <span>用户名：</span>
              <span>{{ user.account }}</span>
            </div>
            <div v-if="user.name != ''">
              <span>姓名：</span>
              <span>{{ user.name }}</span>
            </div>
            <div v-if="user.name != ''">
              <span>手机号：</span>
              <span>{{ user.phone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加删除确认对话框 -->
    <ConfirmDialog
        v-model:visible="confirmDialogVisible"
        :message="`确定要移除 ${accountToRemove?.accountName || ''} 的权限吗？`"
        title="移除关联人员"
        type="danger"
        @confirm="handleRemoveConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {BucketAccessPolicy, IBucketAccountDetail, IBucketByIdResp} from "@/api/proto/bucketInterface";
import ConfirmDialog from '@/views/bucket/component/ConfirmDialog.vue'
import {IAccount, searchAccountsPageInterface} from "@/api/proto/accountInterface";

const props = defineProps<{
  visible: boolean
  bucket: IBucketByIdResp
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'updated', callback: () => void): void
}>()

const isSubmitting = ref(false)
const showAccountDialog = ref(false)
const searchAccountName = ref('')
const searchAccounts = ref<IAccount[]>([])

const displayCount = ref(5)
const showAll = ref(false)
const displayAccountShowKeyMap = ref<Map<string, boolean>>(new Map())

const displayAccounts = computed(() => {
  console.log(props.bucket.list)
  if (showAll.value) {
    return props.bucket.list
  }
  return props.bucket.list.slice(0, displayCount.value)
})

const hasMore = computed(() => {
  return props.bucket.list.length > displayCount.value
})

const remainingCount = computed(() => {
  return props.bucket.list.length - displayCount.value
})

const toggleAccountKey = (account: IBucketAccountDetail) => {
  displayAccountShowKeyMap.value.set(account.accountId, !displayAccountShowKeyMap.value.get(account.accountId))
}
const loadMore = () => {
  displayCount.value += 5
}

const showAllAccounts = () => {
  showAll.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  emit("updated", () => {
    isSubmitting.value = false
  })
}

const closeDialog = () => {
  emit('update:visible', false)
}

const showAddAccountDialog = () => {
  showAccountDialog.value = true
  searchUsers()
}

const closeAddAccountDialog = () => {
  showAccountDialog.value = false
  searchAccountName.value = ''
  searchAccounts.value = []
}

//查询可关联人员
const searchUsers = async () => {
  const resp = await searchAccountsPageInterface({
    fuzzyName: searchAccountName.value,
  })
  if (resp.list !== undefined) {
    // 过滤掉已经存在的人员
    searchAccounts.value = resp.list.filter(user =>
        !props.bucket.list.some(existingAccount =>
            existingAccount.accountId === user.accountId
        )
    )
  } else {
    searchAccounts.value = []
  }
  console.log(searchAccounts)
}

//选择人员进行关联
const selectUser = (user: IAccount) => {
  if (!props.bucket.list.some(account => account.accountId === user.accountId)) {
    props.bucket.list.push({
      accessMode: 1,
      accountId: user.accountId,
      accountName: user.account,
      avatar: "",
      accessKey: user.accessKey,
      accessSecret: user.accessSecret
    })
  }
  closeAddAccountDialog()
}
//删除关联人员
const confirmDialogVisible = ref(false)
const accountToRemove = ref<IBucketAccountDetail | null>(null)

const confirmRemoveAccount = (account: IBucketAccountDetail) => {
  accountToRemove.value = account
  confirmDialogVisible.value = true
}
const handleRemoveConfirm = () => {
  if (accountToRemove.value) {
    removeAccount(accountToRemove.value.accountId)
    accountToRemove.value = null
  }
}
const removeAccount = (accountId: string) => {
  const index = props.bucket.list.findIndex(account => account.accountId === accountId)
  if (index !== -1) {
    props.bucket.list.splice(index, 1)
  }
}

// 获取名字的首字母
const getInitials = (name: string): string => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('复制成功:', text);
    // 这里可以添加提示用户复制成功的逻辑
  }).catch(err => {
    console.error('复制失败:', err);
  });
}
</script>

<style lang="scss" scoped>
@import "@/views/bucket/component/commonColor";
/* 对话框基础样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  width: 60%;
  display: flex;
  flex-direction: column;
  height: 90%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    color: $text-color;
    font-size: 0.8rem;
    font-weight: bold;
    font-family: "阿里妈妈方圆体 VF Regular", serif;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 0.6rem;
    color: $text-light;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s;
  }
  
  .close-btn:hover {
    color: $text-color;
  }
  
  .close-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

/* 表单样式 */
.settings-form {
  display: flex;
  flex-direction: column;
  height: 90%;
}

.form-content {
  display: flex;
  padding: 1rem 0;
  height: 100%;
  
  .form-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-item label {
    color: $text-color;
    font-weight: 500;
  }
  
  input, textarea {
    padding: 0.4rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    outline: none;
    transition: border-color 0.3s;
  }
  
  input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
  
  input:focus, textarea:focus {
    border-color: $primary-color;
  }
}

/* ----- 左边样式 ----- */
.settings-left {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 1rem;
  
  .radio-group {
    display: flex;
    gap: 2rem;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: $text-color;
  }
}

/* ----- 右边样式 ----- */
.settings-right {
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eee;
  padding-left: 1rem;
  width: 50%;
  height: 100%;
  gap: 0.5rem;
}

/* ----- 按钮样式 ----- */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  .btn-cancel, .btn-submit {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-cancel {
    background: #f5f5f5;
    color: $text-light;
  }
  
  .btn-submit {
    background: $primary-color;
    color: white;
  }
  
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .btn-cancel:hover {
    background: #e0e0e0;
  }
  
  .btn-submit:not(:disabled):hover {
    background: $secondary-color;
  }
}

/* ----- 用户列表 ----- */
.account-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  height: 65%;
}

.account-list::-webkit-scrollbar {
  width: 6px;
}

.account-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.account-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.account-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.account-actions-wrapper {
  margin: 0.5rem 0;
}

.btn-show-more,
.btn-show-all {
  background: none;
  border: none;
  color: $primary-color;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  font-size: 0.3rem;
  transition: all 0.3s;
}

.btn-show-more:hover,
.btn-show-all:hover {
  color: $secondary-color;
  text-decoration: underline;
}

.account-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.account-item-up {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 0.4rem;
  border-radius: 0.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.account-info {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  width: 25%;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-default {
  background: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: $text-color;
  font-size: 1rem;
}

.account-name {
  font-weight: 500;
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  perspective: 1000px;
  width: 70%;
  height: 100%;
}

.access-info-btn {
  display: flex;
  padding: 2px;
}

.account-actions-inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.999s;
}

.account-actions-inner.flipped {
  transform: rotateX(180deg);
}

.access-mode-group {
  width: 70%;
  position: absolute;
  display: flex;
  background: #f0f0f0;
  padding: 2px;
  border-radius: 6px;
  gap: 2px;
  backface-visibility: hidden;
  transform: rotateX(0deg);
}

.access-info {
  width: 60%;
  position: absolute;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  transform: rotateX(180deg);
  transform-style: preserve-3d;
  transition: transform 0.999s;
  justify-content: space-evenly;
  height: 200%;
  margin-left: 30%;
  
  &-key, &-secret {
    display: flex;
  }
  
  &-span {
    display: flex;
    flex-direction: column;
  }
  
  span {
    font-size: 10px;
  }
}

.access-info.flipped {
  transform: rotateX(0deg);
}

.access-btn {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: $text-light;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33%;
}

.access-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: $primary-color;
}

.access-btn.active {
  background: white;
  color: $primary-color;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-remove {
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
  background: none;
}

.btn-remove:hover {
  color: #a82a2a;
}

.btn-add-account {
  padding: 0.4rem;
  border: 2px dashed #ddd;
  border-radius: 0.5rem;
  background: none;
  color: $text-light;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 15%;
  margin-right: 0.5rem;
}

.btn-add-account:hover {
  border-color: $primary-color;
  color: $primary-color;
}

.account-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.account-dialog {
  max-width: 400px;
  
  span {
    color: $text-color;
    font-size: 0.5rem;
    font-weight: bold;
    font-family: "阿里妈妈方圆体 VF Regular", serif;
  }
}

.search-box {
  margin: 0.5rem 0;
  
  input {
    width: 100%;
    padding: 0.4rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
  }
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.no-results {
  padding: 0.5rem;
  text-align: center;
  color: $text-light;
  font-size: 0.3rem;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  cursor: pointer;
  transition: background 0.3s;
  border-bottom: 1px solid #eee;
  gap: 0.5rem;
  
  span {
    color: $text-color;
    font-size: 0.3rem;
  }
  
  &:hover {
    background: #f5f5f5;
  }
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .form-content {
    flex-direction: column;
  }
  
  .settings-right {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
    padding-left: 0;
    padding-top: 2rem;
  }
  
  .account-list {
    max-height: 300px;
  }
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: $text-light;
  transition: color 0.3s;
}

.btn-icon:hover {
  color: $primary-color;
}

.copy-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: $text-light;
  margin-right: 5px; /* 添加右边距 */
}

.copy-icon:hover {
  color: $primary-color;
}
</style>