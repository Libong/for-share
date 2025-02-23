<template>
  <div
      ref="cardRef"
      class="card-wrap"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
  >
    <div :style="cardStyle" class="card">
      <div :style="[cardBgTransform, cardBgImage]" class="card-bg"></div>
      <div class="card-info">
        <slot name="header"></slot>
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
  mouseX.value = e.pageX - cardRef.value.offsetLeft - width.value / 2;
  mouseY.value = e.pageY - cardRef.value.offsetTop - height.value / 2;
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

<style scoped>
/* Your styles here */
</style>