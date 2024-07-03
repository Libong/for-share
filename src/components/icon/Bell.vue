<template>
  <div class="wind-chime-container">
    <div class="rope"></div>
    <img :src="img" :style="customStyle" alt="Wind Chime" />
    <!-- 其他模板代码 -->
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import Phone from "@/assets/phone.svg";


/*定义组件的入参 并使用ts规定类型*/
const props = defineProps({
  img: String,
  ropeTop: {
    type:String,
    default: '0px'
  }
})

const customStyle = ref({
  top: props.ropeTop,
  left:'-1px',
  position: 'relative',
  width: '30px',
  height: '30px',
})

//必须要监听修改customStyle的top才能响应式的更新其值
watch(() => props.ropeTop, (newValue) => {
  customStyle.value.top = newValue;
});
</script>

<style>
.wind-chime-container {
  display: inline-block;
  animation: sway 4s ease-in-out infinite;
  transform-origin: 50% 0; /* 以绳子的顶部中心点为旋转中心 */
}

.rope {
  transform: translateX(-50%);
  width: 2px; /* 绳子的宽度 */
  height: 40px; /* 绳子的长度 */
  background-color: #3f3f3f; /* 绳子的颜色 */
  margin-left: 14px;
}
@keyframes sway {
  0%,100% {
    transform: rotate(10deg); /* 动画开始和结束时，不旋转 */
  }
  50% {
    transform: rotate(-10deg); /* 动画中间，绳子摆动到最大角度 */
  }
}
</style>