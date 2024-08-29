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
      <img :src="LogoImg" alt="" class="logo"/>
      <!-- 用户名登录表单 start-->
      <CustomInput
          ref="userNameEl"
          v-model:inputValue="loginReq.account"
          :input="{ placeholder: '用户名', name: '用户名' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
          notice-text="用户名已被占用"
      />
      <CustomInput
          v-model:inputValue="loginReq.password"
          :input="{ placeholder: '密码', name: '密码' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
          :type="'password'"
      />
      <!-- 用户名登录表单 end-->
      <!-- 手机号登录表单 start-->
      <CustomInput
          ref="phoneEl"
          v-model:inputValue="loginReq.phone"
          :input="{ placeholder: '手机号', name: '手机号' }"
          :is-shaking="inputShakingCtrl.phoneShaking"
          :is-show="loginChangeItem.loginType === FormTypeEnum.Phone"
          notice-text="手机号格式不正确"
          @input="phoneInputCallback"
      />
      <div
          v-if="loginChangeItem.loginType === FormTypeEnum.Phone"
          class="input-phoneCaptcha"
      >
        <CustomInput
            :input="{ placeholder: '验证码', name: '验证码' }"
            :is-show="loginChangeItem.loginType === FormTypeEnum.Phone"
        />
        <button
            :disabled="disClick"
            :style="btnDisabledStyle"
            class="captcha-btn"
            @click="sendPhoneCaptcha"
        >
          {{ captchaButtonText }}
        </button>
      </div>
      <!-- 手机号登录表单 end-->
      <!-- 邮箱登录表单 start-->
      <CustomInput
          ref="emailEl"
          v-model:inputValue="loginReq.email"
          :input="{ placeholder: '邮箱账号', name: '邮箱账号' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
      />
      <CustomInput
          v-model:input-value="loginReq.password"
          :input="{ placeholder: '密码', name: '密码' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
          :type="'password'"
      />
      <!-- 邮箱登录表单 end-->
      <div class="to-forget">
        <span :style="jumpSpanStyle" @click="toRegister">立即注册</span>
        <span :style="jumpSpanStyle" @click="">忘记密码?</span>
      </div>

      <Button1 :text="'登 录'" @click="login()"/>
      <!--      <el-button @click="login()">test</el-button>-->
    </div>
    <div v-if="!isLogin" class="form-container">
      <img :src="BackArrowImg" alt="" class="back-arrow" @click="toLogin"/>
      <h2 style="font-weight: bold">注册</h2>
      <!-- 用户名注册表单 start-->
      <CustomInput
          v-model:input-value="registerReq.name"
          :input="{ placeholder: '用户名', name: '用户名' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
      />
      <CustomInput
          v-model:input-value="registerReq.password"
          :input="{ placeholder: '密码', name: '密码' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
          :type="'password'"
      />
      <CustomInput
          ref="confirmPasswordEl"
          v-model:input-value="registerReq.repeatPassword"
          :input="{ placeholder: '确认密码', name: '确认密码' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.UserName"
          :type="'password'"
          notice-text="两次输入密码不一致"
          @input="checkConfirmPassword"
      />
      <!-- 用户名注册表单 end-->

      <!-- 邮箱登录表单 start-->
      <CustomInput
          v-model:inputValue="registerReq.name"
          :input="{ placeholder: '邮箱账号', name: '邮箱账号' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
      />
      <CustomInput
          v-model:input-value="registerReq.password"
          :input="{ placeholder: '密码', name: '密码' }"
          :is-show="loginChangeItem.loginType === FormTypeEnum.Email"
          :type="'password'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, reactive, ref} from "vue";
import Bell from "@/components/common/icon/Bell.vue";
import LogoImg from "@/assets/logo.png";
import Phone from "@/assets/phone.svg";
import Email from "@/assets/email.svg";
import Username from "@/assets/username.svg";
import {FormTypeEnum, ILoginInReq, loginInInterface, sendLoginSmsInterface,} from "./Login";
import BackArrowImg from "@/assets/back-arrow.svg";
import Button1 from "@/components/common/button/button1.vue";
import {CSSProperties} from "@vue/runtime-dom";
import CustomInput from "@/components/common/input/customInput.vue";
import {ElMessage, ElNotification} from "element-plus";
import {ObjClear} from "@/tool/tool";

defineComponent({
  components: {
    Bell,
  },
});
/*------数据------*/
let loginReq = reactive(<ILoginInReq>{
  loginInType: 0,
  phone: "",
  verifyCode: "",
  account: "",
  password: "",
  email: "",
});
let registerReq = reactive({
  name: "",
  password: "",
  repeatPassword: "",
});
/*抖动控制*/
let inputShakingCtrl = reactive({
  usernameShaking: false,
  phoneShaking: false,
});
/*校验*/
//确认密码校验
let confirmPasswordEl = ref();
let checkConfirmPassword = (ev: any) => {
  const {target} = ev;
  if (!target?.value) return;

  if (registerReq.password != target.value) {
    confirmPasswordEl.value.showNotice(true);
  } else {
    confirmPasswordEl.value.showNotice(false);
  }
};
//用户名校验
let userNameEl = ref();
//手机号校验
const phoneRegex = /^1[3-9]\d{9}$/;
let phoneEl = ref();

function checkPhone(): boolean {
  //手机号校验 判断输入内容格式是否正确
  if (!phoneRegex.test(loginReq.phone)) {
    inputShakingCtrl.phoneShaking = !inputShakingCtrl.phoneShaking;
    setTimeout(() => {
      inputShakingCtrl.phoneShaking = !inputShakingCtrl.phoneShaking;
    }, 500);
    phoneEl.value.showNotice(true);
    return false;
  } else {
    phoneEl.value.showNotice(false);
    return true;
  }
}

let phoneInputCallback = (ev: any) => {
  const {target} = ev;
  if (!target?.value) return;
  console.log("phoneInputCallback in ", target.value, phoneEl.value.isNoticeShow());
  if (phoneEl.value.isNoticeShow() && checkPhone()) {
    phoneEl.value.showNotice(false);
  }
};
//邮箱校验
let emailEl = ref();
/*------登录功能切换------*/
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

/*------验证码------*/
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

//发送短信
async function sendPhoneCaptcha() {
  if (!checkPhone()) {
    return;
  }
  await sendLoginSmsInterface({
    phone: loginReq.phone,
  });
  ElMessage({
    message: "发送成功",
  });
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

//登录
async function login() {
  ObjClear(loginReq);
  if (loginReq.account == "123") {
    userNameEl.value.showNotice(true);
  } else {
    userNameEl.value.showNotice(false);
  }

  loginReq.loginInType = loginChangeItem.loginType;

  let loginResp = await loginInInterface(loginReq);
  ElNotification({
    title: "",
    message: "登录成功",
  });
  console.log("login over:", loginResp);
}

//去注册页面
function toRegister() {
  isLogin.value = false;
  ObjClear(loginReq);
}

//去登录页面
function toLogin() {
  isLogin.value = true;
  ObjClear(registerReq);
  //关闭提示红字
  confirmPasswordEl.value.showNotice(false);
}

//忘记密码
</script>

<style lang="scss" scoped>
@import "./login";
</style>
