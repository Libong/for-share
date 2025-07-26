<template>
  <div class="wind-chime-container">
    <div class="rope"></div>
    <img :src="img" :style="customStyle" alt="Wind Chime"/>
    
    <!-- 其他模板代码 -->
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, watch} from 'vue';
import {CSSProperties} from "@vue/runtime-dom";

/*定义组件的入参 并使用ts规定类型*/
const props = defineProps({
  img: String,
  ropeTop: {
    type: String,
    default: '0px'
  }
})
onMounted(() => {
  customStyle.top = props.ropeTop
})
let customStyle = reactive<CSSProperties>({
  top: '0px',
  left: '-1px',
  position: 'relative',
  width: '0.8rem',
  height: '0.8rem',
})

//必须要监听修改customStyle的top才能响应式的更新其值
watch(() => props.ropeTop, (newValue) => {
  customStyle.top = newValue;
});
</script>

<style>
@import "bell.scss";
</style>