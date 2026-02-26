<script lang="ts" setup>
import BackArrow from "@/assets/back-arrow.svg";
import CustomInput from "@/components/common/input/CustomInput.vue";

//定义事件 用于给父组件获取
const emits = defineEmits<{
  (event: 'backToLogin'): void;
}>();

const backToLogin = () => {
  emits('backToLogin');
}

let account = ""
</script>

<template>
  <img :src="BackArrow" alt="" class="back-arrow" @click="backToLogin"/>
  <div class="forget-text-container">
    <span class="forget-text">忘记密码？</span>
  </div>
  <span class="forget-prompt">请在下方输入绑定的手机号以获取短信验证码，并重置你的密码</span>
  <CustomInput
      ref="accountEl"
      v-model:inputValue="account"
      :input="{ placeholder: '手机号', name: '手机号' }"
  />
</template>

<style lang="scss" scoped>
@import "forget";
</style>