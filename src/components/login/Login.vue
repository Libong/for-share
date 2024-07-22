<template>
  <div class="login-container">
    <div v-if="isLogin" class="form-container">
      <Bell
        :img="loginChangeItem.leftImg"
        :ropeTop="loginChangeItem.ropeTop"
        class="bell"
        @click="changeLoginWay"
      />
      <h2 style="font-weight: bold">欢迎来到</h2>
      <img class="logo" :src="LogoImg" alt="" />
      <!-- 用户名登录表单 start-->
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
        :input="{ placeholder: '用户名', name: '用户名' }"
        :noticeSpan="temp"
        v-model:inputValue="loginReq.username"
      />
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
        :type="'password'"
        :input="{ placeholder: '密码', name: '密码' }"
        v-model:input-value="loginReq.password"
      />
      <!-- 用户名登录表单 end-->
      <!-- 手机号登录表单 start-->
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.Phone"
        :input="{ placeholder: '手机号', name: '手机号' }"
        :noticeSpan="{
          text: '手机号格式不正确',
          style: { opacity: inputNoticeSpanStyle.phoneOpacity },
        }"
        :is-shaking="inputShakingCtrl.phoneShaking"
        v-model:inputValue="loginReq.phone"
      />
      <div
        v-if="loginChangeItem.loginType === FormTypeEnum.Phone"
        class="input-phoneCaptcha"
      >
        <CustomInput
          :is-show="loginChangeItem.loginType === FormTypeEnum.Phone"
          :input="{ placeholder: '验证码', name: '验证码' }"
        />
        <button
          :style="btnDisabledStyle"
          :disabled="disClick"
          class="captcha-btn"
          @click="sendPhoneCaptcha"
        >
          {{ captchaButtonText }}
        </button>
      </div>
      <!-- 手机号登录表单 end-->
      <!-- 邮箱登录表单 start-->
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
        :input="{ placeholder: '邮箱账号', name: '邮箱账号' }"
        v-model:inputValue="loginReq.email"
      />
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
        :type="'password'"
        :input="{ placeholder: '密码', name: '密码' }"
        v-model:input-value="loginReq.password"
      />
      <!-- 邮箱登录表单 end-->
      <div class="to-forget">
        <span :style="jumpSpanStyle" @click="toRegister">立即注册</span>
        <span :style="jumpSpanStyle" @click="">忘记密码?</span>
      </div>

      <Button1 :text="'登 录'" @click="login()" />
    </div>
    <div v-if="!isLogin" class="form-container">
      <img class="back-arrow" :src="BackArrowImg" alt="" @click="toLogin" />
      <h2 style="font-weight: bold">注册</h2>
      <!-- 用户名注册表单 start-->
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
        :input="{ placeholder: '用户名', name: '用户名' }"
        v-model:input-value="registerReq.name"
      />
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
        :type="'password'"
        :input="{ placeholder: '密码', name: '密码' }"
        v-model:input-value="registerReq.password"
      />
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
        :type="'password'"
        :input="{ placeholder: '确认密码', name: '确认密码' }"
        v-model:input-value="registerReq.repeatPassword"
        :noticeSpan="{
          text: '两次输入密码不一致',
          style: { opacity: inputNoticeSpanStyle.phoneOpacity },
        }"
      />
      <!-- 用户名注册表单 end-->

      <!-- 邮箱登录表单 start-->
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
        :input="{ placeholder: '邮箱账号', name: '邮箱账号' }"
        v-model:inputValue="registerReq.name"
      />
      <CustomInput
        :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
        :type="'password'"
        :input="{ placeholder: '密码', name: '密码' }"
        v-model:input-value="registerReq.password"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref } from "vue";
import Bell from "@/components/icon/Bell.vue";
import LogoImg from "@/assets/logo.png";
import Phone from "@/assets/phone.svg";
import Email from "@/assets/email.svg";
import Username from "@/assets/username.svg";
import { FormTypeEnum } from "./Login";
import BackArrowImg from "@/assets/back-arrow.svg";
import Button1 from "@/components/button/button1.vue";
import { CSSProperties } from "@vue/runtime-dom";
import CustomInput from "@/components/input/customInput.vue";

defineComponent({
  components: {
    Bell,
  },
});
//数据
let loginReq = reactive({
  phone: "",
  captcha: "",
  username: "",
  password: "",
  email: "",
});
let registerReq = reactive({
  name: "",
  password: "",
  repeatPassword: "",
});
/*输入框提示词样式*/
let inputNoticeSpanStyle = reactive({
  usernameOpacity: 0,
  phoneOpacity: 0,
});
let temp = reactive({
  text: "用户名已被占用",
  style: { opacity: inputNoticeSpanStyle.usernameOpacity },
});
/*抖动控制*/
let inputShakingCtrl = reactive({
  usernameShaking: false,
  phoneShaking: false,
});
/*校验*/
//确认密码校验
let noticeTextStyle = reactive({
  top: "40px",
  opacity: 0,
});
const checkConfirmPassword = (ev: any) => {
  const { target } = ev;
  if (!target?.value) return;

  if (registerReq.password != target.value) {
    noticeTextStyle.opacity = 1;
  } else {
    noticeTextStyle.opacity = 0;
  }
};
//登录功能切换
let isLogin = ref(true);
let loginChangeItem = reactive({
  //切换图片
  leftImg: Phone,
  //切换绳索位置
  ropeTop: "-2px",
  //登录类型
  loginType: FormTypeEnum.UserName,
});
let jumpSpanStyle = reactive<CSSProperties>({
  visibility: "visible",
  "font-weight": "bold",
  cursor: "pointer",
});
function changeLoginWay() {
  switch (loginChangeItem.loginType) {
    case FormTypeEnum.Phone:
      loginChangeItem.leftImg = Username;
      loginChangeItem.ropeTop = "-3px";
      loginChangeItem.loginType = FormTypeEnum.Email;
      jumpSpanStyle.visibility = "visible";
      break;
    case FormTypeEnum.Email:
      loginChangeItem.leftImg = Phone;
      loginChangeItem.ropeTop = "-2px";
      loginChangeItem.loginType = FormTypeEnum.UserName;
      jumpSpanStyle.visibility = "visible";
      break;
    case FormTypeEnum.UserName:
      loginChangeItem.leftImg = Email;
      loginChangeItem.ropeTop = "-6px";
      loginChangeItem.loginType = FormTypeEnum.Phone;
      jumpSpanStyle.visibility = "hidden";
      break;
  }
}
function login() {
  // ObjClear(loginReq);
  if (loginReq.username == "123") {
    inputNoticeSpanStyle.usernameOpacity = 1;
  } else {
    inputNoticeSpanStyle.usernameOpacity = 0;
  }
}
/*验证码*/
let captchaButtonText = ref("获取验证码");
let countDown = ref(9);
let disClick = ref(false);
let btnDisabledStyle = reactive({
  color: "rgba(0, 0, 0, 0.75)",
  cursor: "pointer",
});
function btnDisable() {
  btnDisabledStyle.color = "rgb(111,123,159)";
  disClick.value = true;
  btnDisabledStyle.cursor = "default";
}
function btnAble() {
  btnDisabledStyle.color = "rgba(0, 0, 0, 0.75)";
  disClick.value = false;
  btnDisabledStyle.cursor = "pointer";
}
const phoneRegex = /^1[3-9]\d{9}$/;
function sendPhoneCaptcha() {
  //手机号校验 判断输入内容格式是否正确
  if (!phoneRegex.test(loginReq.phone)) {
    inputShakingCtrl.phoneShaking = !inputShakingCtrl.phoneShaking;
    setTimeout(() => {
      inputShakingCtrl.phoneShaking = !inputShakingCtrl.phoneShaking;
    }, 500);
    inputNoticeSpanStyle.phoneOpacity = 1;
    return;
  } else {
    inputNoticeSpanStyle.phoneOpacity = 0;
  }
  //将button改为不可点击
  btnDisable();
  //先展示提示
  captchaButtonText.value = countDown.value + "秒后重试";
  //这个函数会过1秒后才会进去
  let intervalId = setInterval(() => {
    if (countDown.value === 0) {
      clearInterval(intervalId);
      countDown.value = 9;
      captchaButtonText.value = "获取验证码";
      btnAble();
      return;
    }
    countDown.value -= 1;
    captchaButtonText.value = countDown.value + "秒后重试";
  }, 1000);
}
//注册
function toRegister() {
  isLogin.value = false;
}
function toLogin() {
  isLogin.value = true;
  for (let key in registerReq) {
    registerReq[key as keyof typeof registerReq] = "";
  }
  //TODO 很蠢就
  noticeTextStyle.opacity = 0;
}
//忘记密码
</script>

<style lang="scss" scoped>
@import "./login";
</style>
