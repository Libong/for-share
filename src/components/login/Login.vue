<template>
  <div class="login-container">
    <div v-if="isLogin" class="form-container">
      <Bell :img="loginChangeItem.leftImg" :ropeTop="loginChangeItem.ropeTop" class="bell" @click="ChangeLoginWay"/>
      <h2 style="font-weight: bold">欢迎来到</h2>
      <img class="logo" :src="LogoImg" alt="">
      <!-- 用户名登录表单 start-->
      <div v-if="loginChangeItem.loginType === FormTypeEnum.UserName" class="input-er">
        <input type="text"  placeholder="用户名" />
        <span class="label">用户名</span>
      </div>
      <div v-if="loginChangeItem.loginType === FormTypeEnum.UserName" class="input-er">
        <input :type="passwordEye.type"  placeholder="密码" />
        <span class="label">密码</span>
        <span class="eye-icon">
            <img @click="showPassword(false)" class="eye" :src="passwordEye.src" width="25px" height="25px" alt="">
          </span>
      </div>
      <!-- 用户名登录表单 end-->
      <!-- 手机号登录表单 start-->
      <div v-if="loginChangeItem.loginType === FormTypeEnum.Phone" class="input-er">
        <input type="text" v-model="loginReq.phone" placeholder="手机号" />
        <span class="label">手机号</span>
      </div>
      <div v-if="loginChangeItem.loginType === FormTypeEnum.Phone" class="input-phoneCaptcha">
        <div :style="phoneCaptchaStyle" class="input-er">
          <input type="text"  placeholder="验证码" />
          <span class="label">验证码</span>
        </div>
        <button :style="btnDisabledStyle" :disabled="disClick" class="captcha-btn" @click="sendCaptcha">{{ captchaButtonText }}</button>
      </div>
      <!-- 手机号登录表单 end-->
      <!-- 邮箱登录表单 start-->
      <div v-if="loginChangeItem.loginType === FormTypeEnum.Email" class="input-er">
        <input type="text"  placeholder="邮箱账号" />
        <span class="label">邮箱账号</span>
      </div>
      <div v-if="loginChangeItem.loginType === FormTypeEnum.Email" class="input-er">
        <input :type="passwordEye.type"  placeholder="密码" />
        <span class="label">密码</span>
        <span class="eye-icon">
            <img @click="showPassword(false)" class="eye" :src="passwordEye.src" width="25px" height="25px" alt="">
          </span>
      </div>
      <!-- 邮箱登录表单 end-->
      <div class="to-forget">
        <span :style="jumpSpanStyle" @click="toRegister">立即注册</span>
        <span :style="jumpSpanStyle" @click="">忘记密码?</span>
      </div>

      <Button1 :text="'登 录'"/>
      <!--      <div class="to-inline">-->
      <!--        <span class="to-register" @click="">立即注册</span>-->
      <!--      </div>-->
    </div>
    <div v-if="!isLogin" class="form-container">
      <img class="back-arrow" :src="BackArrowImg" alt="" @click="toLogin">
      <h2 style="font-weight: bold">注册</h2>
      <!-- 用户名注册表单 start-->
      <div v-if="loginChangeItem.loginType === FormTypeEnum.UserName" class="input-er">
        <input type="text"  placeholder="用户名" />
        <span class="label">用户名</span>
      </div>
      <div v-if="loginChangeItem.loginType === FormTypeEnum.UserName" class="input-er">
        <input :type="passwordEye.type"  v-model="registerReq.password" placeholder="密码" />
        <span class="label">密码</span>
        <span class="eye-icon">
            <img @click="showPassword(false)" class="eye" :src="passwordEye.src" width="25px" height="25px" alt="">
          </span>
      </div>
      <div v-if="loginChangeItem.loginType === FormTypeEnum.UserName" class="input-er">
        <input :type="confirmPasswordEye.type" v-model="registerReq.repeatPassword" @input="checkConfirmPassword" placeholder="确认密码" />
        <span class="label">确认密码</span>
        <span :style="noticeTextStyle" class="notice-label">两次输入密码不一致</span>
        <span class="eye-icon">
            <img @click="showPassword(true)" class="eye" :src="confirmPasswordEye.src" width="25px" height="25px" alt="">
          </span>
      </div>
      <!-- 用户名注册表单 end-->

      <!-- 邮箱登录表单 start-->
      <div v-if="loginChangeItem.loginType === FormTypeEnum.Email" class="input-er">
        <input type="text"  placeholder="邮箱账号" />
        <span class="label">邮箱账号</span>
      </div>
      <div v-if="loginChangeItem.loginType === FormTypeEnum.Email" class="input-er">
        <input :type="passwordEye.type"  placeholder="密码" />
        <span class="label">密码</span>
        <span class="eye-icon">
            <img @click="showPassword(false)" class="eye" :src="confirmPasswordEye.src" width="25px" height="25px" alt="">
          </span>
      </div>

      <!--      <button class="submit-btn">提 交</button>-->
      <Button1 :text="'确 认'"/>
      <!--      <Button3/>-->
      <!--      <div class="to-inline">-->
      <!--        <span class="to-register" @click="">立即注册</span>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, reactive, ref, watch} from 'vue';
import Bell from "@/components/icon/Bell.vue";
import LogoImg from "@/assets/logo.png"
import Phone from "@/assets/phone.svg";
import Email from "@/assets/email.svg";
import Username from "@/assets/username.svg";
import {FormTypeEnum} from "./Login"
import type {WatchStopHandle} from "@vue/runtime-core";
import BackArrowImg from "@/assets/back-arrow.svg"
import Button1 from "@/components/button/button1.vue";
import {CSSProperties} from "@vue/runtime-dom";

defineComponent({
  components: {
    Bell,
  },
});
//数据
let loginReq = reactive({
  phone:'',
  captcha:''
})
let registerReq = reactive({
  name:'',
  password:'',
  repeatPassword:''
})

/*密码相关*/
let passwordEye = reactive({
  type:'password',
  //TODO 将src里的相对路径src../../assets/eye-hide.svg改为响应式后只能用绝对路径否则会找不到
  src:'src/assets/eye-hide.svg'
})
let confirmPasswordEye = reactive({
  type:'password',
  //TODO 将src里的相对路径src../../assets/eye-hide.svg改为响应式后只能用绝对路径否则会找不到
  src:'src/assets/eye-hide.svg'
})
function showPassword(isConfirm: boolean){
  if (isConfirm){
    confirmPasswordEye.type = confirmPasswordEye.type == "text" ? "password" : "text"
    confirmPasswordEye.src = confirmPasswordEye.src == "src/assets/eye-open.svg" ? "src/assets/eye-hide.svg" :"src/assets/eye-open.svg"
  }else {
    passwordEye.type = passwordEye.type == "text" ? "password" : "text"
    passwordEye.src = passwordEye.src == "src/assets/eye-open.svg" ? "src/assets/eye-hide.svg" :"src/assets/eye-open.svg"
  }
}
//密码校验
let noticeTextStyle = reactive({
  'top':'40px',
  'opacity': 0,
})
const checkConfirmPassword = (ev:any) => {
  const {target} = ev

  if (!target?.value)return

  if (registerReq.password != target.value){
    noticeTextStyle.opacity = 1
  }else {
    noticeTextStyle.opacity = 0
  }
};
//登录功能切换
let isLogin = ref(false)
let loginChangeItem = reactive({
  //切换图片
  leftImg:Phone,
  //切换绳索位置
  ropeTop:'-2px',
  //登录类型
  loginType:FormTypeEnum.UserName,
})
let phoneCaptchaStyle = ref({
  width: '60%',
  'background-size': 'black',
})
let jumpSpanStyle = reactive<CSSProperties>({
  visibility:'visible',
  'font-weight':'bold',
  cursor: "pointer",
})
function ChangeLoginWay(){
  switch (loginChangeItem.loginType){
    case FormTypeEnum.Phone:
      loginChangeItem.leftImg = Username
      loginChangeItem.ropeTop = '-3px'
      loginChangeItem.loginType = FormTypeEnum.Email
      jumpSpanStyle.visibility = 'visible'
      stopCaptchaWatcher();
      break
    case FormTypeEnum.Email:
      loginChangeItem.leftImg = Phone
      loginChangeItem.ropeTop = '-2px'
      loginChangeItem.loginType = FormTypeEnum.UserName
      jumpSpanStyle.visibility = 'visible'
      stopCaptchaWatcher();
      break
    case FormTypeEnum.UserName:
      loginChangeItem.leftImg = Email
      loginChangeItem.ropeTop = '-6px'
      loginChangeItem.loginType = FormTypeEnum.Phone
      jumpSpanStyle.visibility = 'hidden'
      startCaptchaWatcher();
      break
  }
}
//验证码
let captchaButtonText = ref("获取验证码")
let countDown = ref(9)
let disClick = ref(true)
let btnDisabledStyle = reactive({
  cursor: "default",
  color:"black"
})
const phoneRegex = /^1[3-9]\d{9}$/;
let stopCaptchaWatcher: WatchStopHandle
const startCaptchaWatcher = ()=>{
  stopCaptchaWatcher = watch(()=>loginReq.phone, (newValue, oldValue) => {
    // 这里可以执行手机号格式的验证
    if (phoneRegex.test(newValue)) {
      makeBtnAble()
    } else {
      makeBtnDisable()
    }
  });
}

function makeBtnDisable(){
  btnDisabledStyle.cursor = "default"
  btnDisabledStyle.color = "#D0CBCBFF"
  disClick.value = true
}
function makeBtnAble(){
  btnDisabledStyle.cursor = "pointer"
  btnDisabledStyle.color = "black"
  disClick.value = false
}
function sendCaptcha(){
  //停止观察者
  stopCaptchaWatcher()
  //将button改为不可点击
  makeBtnDisable()
  //先展示提示
  captchaButtonText.value = countDown.value + "秒后重试"
  //这个函数会过1秒后才会进去
  let intervalId = setInterval(()=>{
    if (countDown.value === 0){
      clearInterval(intervalId)
      countDown.value = 9
      captchaButtonText.value = "获取验证码"
      makeBtnAble()
      //开启观察者
      startCaptchaWatcher()
      return
    }
    countDown.value -= 1
    captchaButtonText.value = countDown.value + "秒后重试"
  },1000);
}
//注册
function toRegister(){
  isLogin.value = false
}
function toLogin(){
  isLogin.value = true
  for (let key in registerReq) {
    registerReq[key as keyof typeof registerReq] = ''
  }
  //TODO 很蠢就
  noticeTextStyle.opacity = 0
}
//忘记密码
</script>

<style lang="scss" scoped src="./login.scss"></style>
