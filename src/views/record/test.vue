<template>
  <div>
    <button @click="toggleIcons">Toggle Icons</button>
    <transition-group name="fade" tag="div">
      <i v-if="isShow" class="icon">❌</i>
      <i v-if="isShow" class="icon">⭕</i>
    </transition-group>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

export default defineComponent({
  setup() {
    // const icons = ref(['❌', '⭕']);
    let isShow = ref(false)
    const toggleIcons = () => {
      isShow.value = !isShow.value;
    };

    return {
      isShow,
      toggleIcons,
    };
  },
});
</script>

<style scoped>
.icon {
  display: inline-block;
  margin-right: 10px;
}

.fade-leave-active, .fade-enter-active {
  transition: opacity 1s, transform 1s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>