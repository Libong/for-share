<template>
  <div v-if="visible" class="dialog-overlay" @click="cancel">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <span>{{ title }}</span>
        <button class="close-btn" @click="cancel">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="dialog-body">
        {{ message }}
      </div>
      
      <div class="dialog-actions">
        <button class="btn-cancel" @click="cancel">取消</button>
        <button
            :class="type"
            class="btn-confirm"
            @click="confirm"
        >确认
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface IConfirmDialogParam {
  title: string;
  message: string;
  visible: boolean;
  type: 'warning' | 'danger' | 'info'
}

defineProps<IConfirmDialogParam>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const confirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const cancel = () => {
  emit('cancel')
  emit('update:visible', false)
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
  z-index: 2000;
}

.dialog-content {
  background: white;
  border-radius: 1rem;
  padding: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 30%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    color: $text-color;
    font-size: 0.5rem;
    font-weight: bold;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 0.5rem;
  color: $text-light;
  cursor: pointer;
  padding: 0.5rem;
}

.dialog-body {
  color: $text-color;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 5rem;
}

.dialog-actions button {
  padding: 0.4rem 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: $text-light;
}

.btn-confirm {
  color: white;
}

.btn-confirm.warning {
  background: #e6a23c;
}

.btn-confirm.danger {
  background: #f56c6c;
}

.btn-confirm.info {
  background: $primary-color;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm.warning:hover {
  background: #cf9236;
}

.btn-confirm.danger:hover {
  background: #e04545;
}

.btn-confirm.info:hover {
  background: $secondary-color;
}
</style>