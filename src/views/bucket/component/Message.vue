<template>
  <div class="message-container">
    <TransitionGroup name="message">
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="message"
        :class="msg.type"
      >
        <i :class="iconClass(msg.type)"></i>
        {{ msg.content }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  content: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const messages = ref<Message[]>([])

const iconClass = (type: string) => {
  switch (type) {
    case 'success': return 'fas fa-check-circle'
    case 'error': return 'fas fa-times-circle'
    case 'info': return 'fas fa-info-circle'
    case 'warning': return 'fas fa-exclamation-circle'
    default: return 'fas fa-info-circle'
  }
}

const show = (content: string, type: Message['type'] = 'info') => {
  const id = Date.now()
  messages.value.push({ id, content, type })
  setTimeout(() => {
    messages.value = messages.value.filter(msg => msg.id !== id)
  }, 3000)
}

// 暴露方法给全局
defineExpose({
  success: (content: string) => show(content, 'success'),
  error: (content: string) => show(content, 'error'),
  info: (content: string) => show(content, 'info'),
  warning: (content: string) => show(content, 'warning')
})
</script>

<style scoped>
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px 20px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.message i {
  font-size: 1.1em;
}

.message.success {
  background: #f0f9eb;
  color: #67c23a;
}

.message.error {
  background: #fef0f0;
  color: #f56c6c;
}

.message.info {
  background: #f4f4f5;
  color: #909399;
}

.message.warning {
  background: #fdf6ec;
  color: #e6a23c;
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style> 