<script lang="ts" setup>
</script>

<template>
  <div class="love">
    <input id="switch" type="checkbox">
    <label class="love-heart" for="switch">
      <i class="left"></i>
      <i class="right"></i>
      <i class="bottom"></i>
      <i class="straight"></i>
      <div class="round"></div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.love-heart:before, #switch {
  display: none;
}

.love-heart, .love-heart::after {
  border-color: hsl(231deg 28% 86%);
  border: 1px solid;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  width: 10px;
  height: 0px;
  border-bottom: 0;
}

/* 路径伪元素 */
.love-heart::before {
  content: "";
  position: absolute;
  width: 200px; /* 路径长度 */
  height: 2px; /* 路径宽度 */
  background: transparent; /* 初始透明 */
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: draw-animation 2s forwards; /* 应用绘制动画 */
}

.round {
  position: absolute;
  z-index: 1;
  width: 8px;
  height: 8px;
  background: hsl(0deg 0% 100%);
  box-shadow: rgb(0 0 0 / 24%) 0px 0px 4px 0px;
  border-radius: 100%;
  left: 0px;
  bottom: -1px;
  transition: all .5s ease;
  animation: check-animation2 .5s forwards;
  opacity: 0;
}

input:checked + label .round {
  transform: translate(0px, 0px);
  animation: check-animation 1s forwards;
  background-color: hsl(0deg 0% 100%);
  opacity: 1;
}

@keyframes check-animation {
  0% {
    transform: translate(0px, 0px);
  }

  25% {
    transform: translate(0px, 7px);
  }

  50% {
    transform: translate(7px, 7px);
  }
  100% {
    transform: translate(19px, 7px);
  }
}

@keyframes check-animation2 {
  0% {
    transform: translate(19px, 7px);
  }
  25% {
    transform: translate(7px, 7px);
  }
  50% {
    transform: translate(0px, 7px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

/* 路径绘制动画 */
@keyframes draw-animation {
  0% {
    background: transparent; /* 初始透明 */
    width: 0; /* 初始宽度为 0 */
  }
  100% {
    background: #ff6b6b; /* 路径颜色 */
    width: 200px; /* 最终宽度 */
  }
}

.love-heart {
  box-sizing: border-box;
  position: relative;
  transform: rotate(-45deg) translate(-50%, -33px) scale(4);
  display: block;
  box-shadow: inset 6px -5px 0px 2px hsl(0, 0%, 0%);
  cursor: pointer;
  top: 0;
  transition: all .5s;
}

@keyframes loveHeartHoverAnimation {
  0% {
    height: 0px; /* 初始高度 */
  }
  100% {
    height: 8px; /* 鼠标悬停时的高度 */
  }
}

@keyframes bottomHoverAnimation {
  0% {
    height: 0px; /* 初始高度 */
  }
  100% {
    height: 11yarpx; /* 鼠标悬停时的高度 */
  }
}

.love-heart:hover {
  animation: loveHeartHoverAnimation 0.5s forwards; /* 动画持续时间为 0.5 秒 */
  //animation-delay: 0.5s; /* 动画延迟 0.5 秒后执行 */
}

.love-heart:hover .bottom {
  animation: bottomHoverAnimation 0.5s forwards; /* 动画持续时间为 0.5 秒 */
  animation-delay: 0.5s; /* 动画延迟 0.5 秒后执行 */
}

input:checked + .love-heart, input:checked + .love-heart::after, input:checked + .love-heart .bottom, input:checked + .love-heart .straight {
  border-color: hsl(0, 0%, 1%);
  box-shadow: inset 6px -5px 0px 2px hsl(351, 16%, 33%);
}

.love-heart::after, .love-heart .bottom, .love-heart .straight {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  border-color: hsl(231deg 28% 86%);
}

.love-heart::after {
  right: -21px;
  transform: rotate(90deg);
  top: 7px;
}

.love-heart .bottom {
  width: 11px;
  height: 0px;
  //border-left: 1px solid;
  //border-bottom: 1px solid;
  box-shadow: inset 6px -5px 0px 2px hsl(0, 0%, 0%);
  border-color: hsl(231deg 28% 86%);
  left: -1px;
  top: 5px;
  border-radius: 0px 0px 0px 5px;
  animation: all .5s;
  animation-delay: 0.5s;
}

.love-heart .straight {
  width: 12px;
  height: 10px;
  border-bottom: 1px solid;
  border-top: 1px solid;
  border-color: hsl(231deg 28% 86%);
  left: 8px;
  top: 6px;
}

</style>