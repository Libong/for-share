<template>
  <div
      ref="cardRef"
      class="card-wrap"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
  >
    <div :style="cardStyle" class="card">
      <div :style="[cardBgTransform, cardBgImage]" class="card-wrap-bg"></div>
      <div class="card-info">
        <!--当使用插槽时 插槽中的样式是由父组件进行设置的        -->
        <!--        <slot name="header"></slot>-->
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';

const props = defineProps<{
  dataImage: string;
}>();

const cardRef = ref<HTMLDivElement | null>(null);
const width = ref(0);
const height = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);
const mouseLeaveDelay = ref(0);

const mousePX = computed(() => mouseX.value / width.value);
const mousePY = computed(() => mouseY.value / height.value);

const cardStyle = computed(() => {
  const rX = mousePX.value * 30;
  const rY = mousePY.value * -30;
  return {
    transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
  };
});

const cardBgTransform = computed(() => {
  const tX = mousePX.value * -40;
  const tY = mousePY.value * -40;
  return {
    transform: `translateX(${tX}px) translateY(${tY}px)`,
  };
});

const cardBgImage = computed(() => ({
  backgroundImage: `url(${props.dataImage})`,
}));

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;
  // 获取卡片的视口位置
  const rect = cardRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 计算鼠标相对于卡片中心的偏移量
  mouseX.value = e.clientX - centerX;
  mouseY.value = e.clientY - centerY;
};

const handleMouseEnter = () => {
  clearTimeout(mouseLeaveDelay.value);
};

const handleMouseLeave = () => {
  mouseLeaveDelay.value = window.setTimeout(() => {
    mouseX.value = 0;
    mouseY.value = 0;
  }, 1000);
};

onMounted(() => {
  if (cardRef.value) {
    width.value = cardRef.value.offsetWidth;
    height.value = cardRef.value.offsetHeight;
  }
});

onUnmounted(() => {
  clearTimeout(mouseLeaveDelay.value);
});
</script>

<style lang="scss" scoped>
$hoverEasing: cubic-bezier(0.23, 1, 0.32, 1);
$returnEasing: cubic-bezier(0.445, 0.05, 0.55, 0.95);

.card-wrap {
  width: 100%;
  height: 100%;
  transform: perspective(800px);
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;

  &:hover {
    .card-info {
      transform: translateY(0);
    }

    .card-info p {
      opacity: 1;
    }

    .card-info, .card-info p {
      transition: 0.6s $hoverEasing;
    }

    .card-info:after {
      transition: 5s $hoverEasing;
      opacity: 1;
      transform: translateY(0);
    }

    .card-wrap-bg {
      transition: 0.6s $hoverEasing,
      opacity 5s $hoverEasing;
      opacity: 1;
      filter: blur(0); // 初始模糊程度
    }

    .card {
      transition: 0.6s $hoverEasing,
      box-shadow 2s $hoverEasing;
      box-shadow: rgba(white, 0.2) 0 0 40px 5px,
      rgba(white, 1) 0 0 0 1px,
      rgba(black, 0.66) 0 10px 10px 0,
      inset #333 0 0 0 5px,
      inset white 0 0 0 6px;
    }
  }
}

.card {
  position: relative;
  width: 95%;
  height: 95%;
  background-color: #333;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: rgba(black, 0.66) 0 10px 10px 0,
  inset #333 0 0 0 5px,
  inset rgba(white, 0.5) 0 0 0 6px;
  transition: 1s $returnEasing;
}

.card-wrap-bg {
  opacity: 0.8;
  position: absolute;
  top: -20px;
  left: -20px;
  width: 120%;
  height: 120%;
  //padding: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transition: 1s $returnEasing,
  opacity 5s 1s $returnEasing;
  pointer-events: none;
  filter: blur(10px); // 初始模糊程度
}

.card-info {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  color: #fff;
  //transform: translateY(40%);
  transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);

  p {
    opacity: 0;
    text-shadow: rgba(black, 1) 0 2px 3px;
    transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  * {
    position: relative;
    z-index: 1;
  }

  //card-info部分的一个颜色渐变 逐渐变黑从下到上
  //&:after {
  //  content: '';
  //  position: absolute;
  //  top: 0;
  //  left: 0;
  //  z-index: 0;
  //  width: 100%;
  //  height: 100%;
  //  background-image: linear-gradient(to bottom, transparent 0%, rgba(#000, 0.6) 100%);
  //  background-blend-mode: overlay;
  //  opacity: 0;
  //  transform: translateY(100%);
  //  transition: 5s 1s $returnEasing;
  //}
}
</style>