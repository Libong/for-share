<script lang="ts" setup>
// Props
import {onMounted, onUnmounted, ref, watch} from "vue";

const props = defineProps({
  enable: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Are you sure?",
  },
  message: {
    type: String,
    default: "Do you really want to continue? This process cannot be undone.",
  },
});

// Emits
const emit = defineEmits(["update:enable", "confirm", "cancel"]);

// Local state
const isOpen = ref(props.enable);

// Sync local state with parent
watch(() => props.enable, (newVal) => {
  isOpen.value = newVal;
});

// Update parent when local state changes
const updateParent = (value: boolean) => {
  emit("update:enable", value);
};

// Handle button clicks
const handleCancel = () => {
  emit("cancel");
  updateParent(false);
};

const handleConfirm = () => {
  emit("confirm");
  updateParent(false);
};

// Close modal when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    updateParent(false);
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="custom-modal">
      <div class="modal-content">
        <svg
            class="modal-icon"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          />
        </svg>
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-buttons">
          <button
              class="cancel-button"
              @click="emit('cancel')"
          >
            取消
          </button>
          <button
              class="confirm-button"
              @click="emit('confirm')"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$gray-600: #4b5563;
$gray-200: #e5e7eb;
$gray-500: #6b7280;
$gray-700: #1f2937;
$gray-800: #111827;
$red-500: #ef4444;
$white: #ffffff;
.custom-modal {
  // 遮罩层
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  //background-color: rgba(0, 0, 0, 0.7);
  //backdrop-filter: blur(2px);
  z-index: 1000; // 确保弹出框在最上层
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  transition: opacity 0.3s ease;

  // 弹出框内容
  .modal-content {
    position: relative;
    background-color: $gray-800;
    border: 1px solid $gray-800;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    border-radius: 1rem;
    padding: 1rem;
    max-width: 350px;
    width: 100%; // 适应移动设备
    opacity: 0.9;

    text-align: center;

    .modal-icon {
      width: 3rem;
      height: 3rem;
      fill: $red-500;
      animation: bounce 1s infinite;

      path {
        fill: $red-500;
      }
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      padding: 0.5rem 0;
      color: $gray-200;
    }

    .modal-message {
      font-size: 0.875rem;
      font-weight: 700;
      color: $gray-500;
      padding: 0 1rem;
    }

    .modal-buttons {
      padding: 0.5rem 0;
      display: flex;
      justify-content: center;
      gap: 2.5rem;

      .cancel-button {
        background-color: $gray-700;
        color: $gray-200;
        border: 2px solid $gray-600;
        padding: 0.5rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        border-radius: 9999px;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: $gray-800;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      }

      .confirm-button {
        background-color: $red-500;
        border: 2px solid $red-500;
        color: $white;
        padding: 0.5rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        border-radius: 9999px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
          background-color: transparent;
          color: $red-500;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>