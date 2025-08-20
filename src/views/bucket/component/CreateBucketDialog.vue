<template>
  <div v-if="props.visible" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <span>新建存储空间</span>
        <button class="close-btn" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form class="bucket-form" @submit.prevent="handleSubmit">
        <div class="form-item">
          <label>存储空间名称 <span class="required">*</span></label>
          <input
              v-model="form.name"
              :class="{ 'error': errors.name }"
              placeholder="请输入3-63个字符，仅支持小写字母、数字和短横线"
              type="text"
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        
        <div class="form-item">
          <label>访问权限</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                  v-model="form.accessPolicy"
                  :value="BucketAccessPolicy.Private"
                  type="radio"
              > 私有
            </label>
            <label class="radio-label">
              <input
                  v-model="form.accessPolicy"
                  :value="BucketAccessPolicy.Publish"
                  type="radio"
              > 公开
            </label>
          </div>
        </div>
        
        <div class="form-item">
          <label>描述</label>
          <textarea
              v-model="form.desc"
              placeholder="请输入存储空间描述信息"
              rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button class="btn-cancel" type="button" @click="closeDialog">取消</button>
          <button :disabled="isSubmitting" class="btn-submit" type="submit">
            {{ isSubmitting ? '创建中...' : '创建' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {BucketAccessPolicy, IAddBucketReq} from "@/api/proto/bucketInterface";
import {ShowCommonMessage} from "@/tool/message";

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'add', data: IAddBucketReq, callback: () => void): void
}>()

const form = reactive({
  name: '',
  accessPolicy: 0,
  desc: ''
})

const errors = reactive({
  name: ''
})

const isSubmitting = ref(false)

const validateForm = () => {
  let isValid = true
  errors.name = ''
  
  // 验证名称
  if (!form.name) {
    errors.name = '存储空间名称不能为空'
    isValid = false
  } else if (!/^[a-z0-9-_]{3,63}$/.test(form.name)) {
    errors.name = '名称只能包含小写字母、数字和短横线，长度3-63个字符'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  emit("add", {
    name: form.name,
    accessPolicy: form.accessPolicy,
  }, () => {
    isSubmitting.value = false
    closeDialog()
    ShowCommonMessage('存储空间创建成功', "success")
  })
}

const closeDialog = () => {
  emit('update:visible', false)
  // 重置表单
  form.name = ''
  form.accessPolicy = 0
  form.desc = ''
  errors.name = ''
}
</script>

<style lang="scss" scoped>
@import "@/views/bucket/component/commonColor";

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
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 80%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  height: 10%;
  
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
  }
}

.bucket-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 80%;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-item label {
  color: $text-color;
  font-weight: 500;
}

.required {
  color: #ff5252;
  margin-left: 0.25rem;
}

input, textarea {
  padding: 0.4rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  border-color: $primary-color;
}

input.error {
  border-color: #ff5252;
}

.error-message {
  color: #ff5252;
  font-size: 0.2rem;
}

.radio-group {
  display: flex;
  gap: 2rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

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
</style>