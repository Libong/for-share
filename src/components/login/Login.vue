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
        <input :type="passwordType"  placeholder="密码" />
        <span class="label">密码</span>
        <span class="eye-icon">
            <img @click="showPassword" class="eye" :src="eyeSvgUrl" width="25px" height="25px" alt="">
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
        <input :type="confirmPasswordEye.type" v-model="registerReq.repeatPassword" @input="checkConfirmPassword($event.target.value)" placeholder="确认密码" />
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
        <input :type="passwordType"  placeholder="密码" />
        <span class="label">密码</span>
        <span class="eye-icon">
            <img @click="showPassword" class="eye" :src="eyeSvgUrl" width="25px" height="25px" alt="">
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
import {defineComponent, onMounted, reactive, ref, watch} from 'vue';
import Bell from "@/components/icon/Bell.vue";
import LogoImg from "@/assets/logo.png"
import Phone from "@/assets/phone.svg";
import Email from "@/assets/email.svg";
import Username from "@/assets/username.svg";
import {FormTypeEnum} from "./Login"
import type {WatchStopHandle} from "@vue/runtime-core";
import BackArrowImg from "@/assets/back-arrow.svg"
import Button1 from "@/components/button/button1.vue";

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
  const checkConfirmPassword = (confirmPassword: string) => {
    console.log(confirmPassword)
    if (registerReq.password != confirmPassword){
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
  let jumpSpanStyle = reactive({
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
      registerReq[key] = ''
    }
    //TODO 很蠢就
    noticeTextStyle.opacity = 0
  }
  //忘记密码
</script>

<style lang="scss" scoped>
.login-container {
  /*视口宽度的百分比 vw*/
  width: 100vw;
  /*作为flex容器*/
  display: flex;
  /*类似水平和垂直居中 */
  justify-content: center;
  align-items: center;
  /*视口高度的百分比 vh*/
  height: 100vh;
  background: url("../../assets/login-light-bg.png") no-repeat center center;
  /*背景大小 覆盖整个 会失真*/
  background-size: cover;
}
.form-container {
  height: 60%;
  width: 25%;
  position: relative;
  /*作为flex容器*/
  display: flex;
  /*row时控制水平 column时反之 */
  justify-content: center;
  /*row时控制垂直 column时反之 flex-start靠上*/
  align-items: center;
  /*将容器内的子div 排列改为横向 默认row纵向*/
  flex-direction: column;
  background: transparent;
/*  background: rgb(17, 25, 40,0.75);*/
  /*可以使背景朦胧 16px表示模糊半径为16像素 越大越朦胧*/
/*  backdrop-filter: blur(0px) saturate(0);*/
  box-shadow: 0 0 10px 10px rgba(7, 3, 3, 0.2);
  /*圆角边框*/
  border-radius: 20px;
  /*简写 边框 width宽度 样式style 颜色color*/
/*  border: 1px solid rgba(8, 10, 12, 0.75);*/
  /*边距 4->上右下左 2->上下左右*/
  color: black;
  padding: 40px 60px;
  .bell{
    position: absolute;
    top: 0;
    left: 300px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .logo{
    width: 200px;
    height: 70px;
    margin-top: 10px;
  }
  .input-phoneCaptcha{
    /*必须加宽度否则子标签无法变化*/
    width: 100%;
    display: flex;
    /*设置子标签为一左一右*/
    justify-content: space-between;
    align-items: center;
  }
  /*使跟随父标签*/
  .input-er{
    /*固定位置*/
    position: relative;
    width: 100%;
    /*position: relative;*/
    margin-top: 30px;
    input{
      width: 100%;
      height: 35px;
      /*不设置边框 否则会有边框会有阴影*/
      border: none;
      /*背景设置透明*/
      background: transparent;
      /*类似于边框border 描边*/
      outline: 2px solid rgb(0, 0, 0,0.5);
      /*圆角边框*/
      border-radius: 5px;
      /*字体大小*/
      font-size: 14px;
      font-weight: bold;
      /*字体颜色*/
      color: rgba(0, 0, 0, 0.75);
      /*加边距使文本浮空 不会贴紧输入框*/
      padding: 0 15px;
      /*设置颜色*/
      &::placeholder{
        color: rgba(255, 255, 255, 0.6);
        font-weight: bold;
        font-size: 12px;
      }
      /*聚焦时*/
      &:focus{
        /*改变描边的颜色*/
        outline: 2px solid rgb(255, 255, 255,0.5);
        /*提示字消失*/
        &::placeholder{
          /*完全透明*/
          opacity: 0;
        }
        /*输入框外展示提示字*/
        & + .label{
          /*显示*/
          opacity: 1;
          top: -20px;
        }
      }
      /*当内部提示字未展示时(输入框中有内容) 展示外部提示字*/
      &:not(:placeholder-shown) + .label{
        /*显示*/
        opacity: 1;
        top: -20px;
      }
    }
    .label{
      /*会根据父标签中为relative的div 移动*/
      position: absolute;
      /*偏移到合适的位置*/
      top: -10px;
      left: 0;
      /*字体颜色*/
      color: #dddddd;
      /*字体大小 比提示小点*/
      font-size: 11px;
      /*字体加粗*/
      font-weight: bold;
      /*当改元素被改变时的动画 时间0.25 ease-out函数(使得变化开始较快，然后逐渐减慢)*/
      transition: 0.25s ease-out;
      /*默认隐藏*/
      opacity: 0;
    }
    .notice-label{
      /*会根据父标签中为relative的div 移动*/
      position: absolute;
      left: 0;
      /*字体颜色*/
      color: rgba(255, 0, 0, 0.8);
      /*字体大小 比提示小点*/
      font-size: 11px;
      /*字体加粗*/
      font-weight: bold;
      /*当改元素被改变时的动画 时间0.25 ease-out函数(使得变化开始较快，然后逐渐减慢)*/
      transition: 0.25s ease-out;
    }
    .eye{
      position: absolute;
      right: 10px;
      top: 5px;
      /*手指*/
      cursor: pointer;
    }
  }
  .to-forget{
    width: 100%;
    height: 5%;
    margin-top: 5px;
    font-size: 12px;
    display: flex;
    /*设置子标签为一左一右*/
    justify-content: space-between;
  }
}
/*验证码*/
.captcha-btn{
  width: 35%;
  height: 35px;
  margin-top: 30px;
  /*圆角边框*/
  border-radius: 5px;
  /*背景设置透明*/
  background: transparent;
  /*不设置边框 否则会有边框会有阴影*/
  border: none;
  /*类似于边框border 描边*/
  outline: 2px solid rgb(31, 27, 27);
  /*手指*/
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}
/*返回箭头*/
.back-arrow{
  position: absolute;
  width: 30px;
  height: 30px;
  top: 0;
  left: 0;
  margin: 30px;
  cursor: pointer;
}
</style>