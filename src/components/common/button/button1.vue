<script lang="ts" setup>
import {ref} from "vue";

let buttonClass = ref('bubbly-button')
let animateButton = function () {
  buttonClass.value += ' animate'
  setTimeout(function () {
    buttonClass.value = 'bubbly-button'
  }, 700);
};

const props = defineProps({
  width: {
    type: String,
    default: '50%'
  },
  height: {
    type: String,
    default: '35px'
  },
  marginTop: {
    type: String,
    default: '30px'
  },
  text: {
    type: String,
    default: ''
  }
})
const customStyle = ref({
  width: props.width,
  height: props.height,
  'margin-top': props.marginTop,
})
</script>

<template>
  <button :class="buttonClass" :style="customStyle" @click="animateButton">{{ text }}</button>
</template>

<style lang="scss" scoped>

.bubbly-button {
  font-family: 'Helvetica', 'Arial', sans-serif;
  border-radius: 10px;
  background: transparent;
  outline: 2px solid rgb(31, 27, 27);
  font-weight: bold;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;

  &:before, &:after {
    position: absolute;
    content: '';
    display: block;
    width: 140%;
    height: 100%;
    left: -20%;
    z-index: 100;
    transition: all ease-in-out 1s;
    background-repeat: no-repeat;
  }

  &:before {
    display: none;
    top: -75%;
    background-image: radial-gradient(circle, #33798b 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, #99cdd9 20%, transparent 30%),
    radial-gradient(circle, #0e5d8f 20%, transparent 20%),
    radial-gradient(circle, #7abcc2 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #064e77 15%, transparent 20%),
    radial-gradient(circle, #3f96ad 20%, transparent 20%),
    radial-gradient(circle, #48c6e0 20%, transparent 20%),
    radial-gradient(circle, #0d4761 20%, transparent 20%),
    radial-gradient(circle, #2cabd0 20%, transparent 20%);
    background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
    //background-position: 0% 80%, -5% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 85% 30%;
  }

  &:after {
    display: none;
    bottom: -75%;
    background-image: radial-gradient(circle, #0c4369 20%, transparent 20%),
    radial-gradient(circle, #0a5988 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, white 15%, transparent 20%),
    radial-gradient(circle, #3f96ad 20%, transparent 20%),
    radial-gradient(circle, #48c6e0 20%, transparent 20%),
    radial-gradient(circle, #0d4761 20%, transparent 20%),
    radial-gradient(circle, #2cabd0 20%, transparent 20%);
    background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
    //background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }

  &:active {
    transform: scale(0.9);

  }

  &.animate {
    &:before {
      display: block;
      animation: topBubbles ease-in-out 0.75s forwards;
    }

    &:after {
      display: block;
      animation: bottomBubbles ease-in-out 0.75s forwards;
    }
  }
}


@keyframes topBubbles {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
  }
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}

@keyframes bottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
  }
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
</style>