<template>
  <div class="container" style="width: 500px;height: 500px">
    <button id="button" :class="buttonClass" @click="clickButton">
      <div v-if="state === 'ready'" class="message submitMessage">
        <!--        <svg viewBox="0 0 13 12.2" xmlns="http://www.w3.org/2000/svg">-->
        <!--          <polyline points="2,7.1 6.5,11.1 11,7.1" stroke="currentColor"/>-->
        <!--          <line stroke="currentColor" x1="6.5" x2="6.5" y1="1.2" y2="10.3"/>-->
        <!--        </svg>-->
        <span class="button-text">完成</span>
      </div>
      <div v-if="state === 'loading'" class="message loadingMessage">
        <svg viewBox="0 0 19 17" xmlns="http://www.w3.org/2000/svg">
          <circle class="loadingCircle" cx="2.2" cy="10" r="1.6"/>
          <circle class="loadingCircle" cx="9.5" cy="10" r="1.6"/>
          <circle class="loadingCircle" cx="16.8" cy="10" r="1.6"/>
        </svg>
      </div>
      <div v-if="state === 'complete'" class="message successMessage">
        <svg viewBox="0 0 13 11" xmlns="http://www.w3.org/2000/svg">
          <polyline points="1.4,5.8 5.1,9.5 11.6,2.1" stroke="currentColor"/>
        </svg>
        <span class="button-text">已完成</span>
      </div>
    </button>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";

const state = ref("ready");
const buttonClass = ref("ready");

const confettiCount = 20;
const sequinCount = 10;
const gravityConfetti = 0.3;
const gravitySequins = 0.55;
const dragConfetti = 0.075;
const dragSequins = 0.02;
const terminalVelocity = 3;

const button = ref<HTMLButtonElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const colors = [
  {front: "#7b5cff", back: "#6245e0"},
  {front: "#b3c7ff", back: "#8fa5e5"},
  {front: "#5c86ff", back: "#345dd1"},
];

const randomRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

const initConfettoVelocity = (xRange: [number, number], yRange: [number, number]) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    y += Math.random() < 0.25 ? randomRange(1, 3) : 0;
  }
  return {x, y: -y};
};

class Confetto {
  randomModifier: number;
  color: { front: string; back: string };
  dimensions: { x: number; y: number };
  position: { x: number; y: number };
  rotation: number;
  scale: { x: number; y: number };
  velocity: { x: number; y: number };

  constructor() {
    this.randomModifier = randomRange(0, 99);
    this.color = colors[Math.floor(randomRange(0, colors.length))];
    this.dimensions = {
      x: randomRange(5, 9),
      y: randomRange(8, 15),
    };
    this.position = {
      x: randomRange((canvas.value?.width ?? 0) / 2 - (button.value?.offsetWidth ?? 0) / 4,
          (canvas.value?.width ?? 0) / 2 + (button.value?.offsetWidth ?? 0) / 4),
      y: randomRange((canvas.value?.height ?? 0) / 2 + (button.value?.offsetHeight ?? 0) / 2 + 8,
          (canvas.value?.height ?? 0) / 2 + 1.5 * (button.value?.offsetHeight ?? 0) - 8),
    };
    this.rotation = randomRange(0, 2 * Math.PI);
    this.scale = {x: 1, y: 1};
    this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
  }

  update() {
    this.velocity.x -= this.velocity.x * dragConfetti;
    this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
    this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
  }
}

class Sequin {
  color: string;
  radius: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };

  constructor() {
    this.color = colors[Math.floor(randomRange(0, colors.length))].back;
    this.radius = randomRange(1, 2);
    this.position = {
      x: randomRange((canvas.value?.width ?? 0) / 2 - (button.value?.offsetWidth ?? 0) / 3,
          (canvas.value?.width ?? 0) / 2 + (button.value?.offsetWidth ?? 0) / 3),
      y: randomRange((canvas.value?.height ?? 0) / 2 + (button.value?.offsetHeight ?? 0) / 2 + 8,
          (canvas.value?.height ?? 0) / 2 + 1.5 * (button.value?.offsetHeight ?? 0) - 8),
    };
    this.velocity = {
      x: randomRange(-6, 6),
      y: randomRange(-8, -12),
    };
  }

  update() {
    this.velocity.x -= this.velocity.x * dragSequins;
    this.velocity.y += gravitySequins;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const confetti = ref<Confetto[]>([]);
const sequins = ref<Sequin[]>([]);
let animationFrameId: number | null = null; // 用于存储

const initBurst = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.value.push(new Confetto());
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.value.push(new Sequin());
  }
};

const render = () => {
  if (!ctx.value || !canvas) {
    return;
  }

  ctx.value.clearRect(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0);

  confetti.value.forEach((confetto, index) => {
    if (!ctx.value) {
      return;
    }
    const width = confetto.dimensions.x * confetto.scale.x;
    const height = confetto.dimensions.y * confetto.scale.y;

    ctx.value.translate(confetto.position.x, confetto.position.y);
    ctx.value.rotate(confetto.rotation);

    confetto.update();

    ctx.value.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    ctx.value.fillRect(-width / 2, -height / 2, width, height);

    ctx.value.setTransform(1, 0, 0, 1, 0, 0);

    if (confetto.velocity.y < 0) {
      ctx.value.clearRect(
          (canvas.value?.width ?? 0) / 2 - (button.value?.offsetWidth ?? 0) / 2,
          (canvas.value?.height ?? 0) / 2 + (button.value?.offsetHeight ?? 0) / 2,
          button.value?.offsetWidth ?? 0,
          button.value?.offsetHeight ?? 0
      );
    }
  });

  sequins.value.forEach((sequin, index) => {
    if (!ctx.value) {
      return;
    }
    ctx.value.translate(sequin.position.x, sequin.position.y);

    sequin.update();

    ctx.value.fillStyle = sequin.color;
    ctx.value.beginPath();
    ctx.value.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
    ctx.value.fill();

    ctx.value.setTransform(1, 0, 0, 1, 0, 0);

    if (sequin.velocity.y < 0) {
      ctx.value.clearRect(
          (canvas.value?.width ?? 0) / 2 - (button.value?.offsetWidth ?? 0) / 2,
          (canvas.value?.height ?? 0) / 2 + (button.value?.offsetHeight ?? 0) / 2,
          button.value?.offsetWidth ?? 0,
          button.value?.offsetHeight ?? 0
      );
    }
  });

  confetti.value = confetti.value.filter((confetto) => confetto.position.y < ((canvas.value?.height || 0)) ?? 0);
  sequins.value = sequins.value.filter((sequin) => sequin.position.y < ((canvas.value?.height || 0)) ?? 0);
  animationFrameId = requestAnimationFrame(render);
};

const clickButton = () => {
  if (state.value !== "ready") return;

  state.value = "loading";
  buttonClass.value = "loading";

  setTimeout(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId); // 停止之前的动画
    }
    state.value = "complete";
    buttonClass.value = "complete";

    setTimeout(() => {
      initBurst();
      render();

      setTimeout(() => {
        state.value = "ready";
        buttonClass.value = "ready";
      }, 4000);
    }, 320);
  }, 1800);
};

onMounted(() => {
  canvas.value = document.getElementById("canvas") as HTMLCanvasElement;
  ctx.value = canvas.value.getContext("2d");

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  button.value = document.getElementById("button") as HTMLButtonElement;

  window.addEventListener("resize", () => {
    if (canvas.value) {
      canvas.value.width = window.innerWidth;
      canvas.value.height = window.innerHeight;
    }
  });

  document.body.onkeyup = (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      clickButton();
    }
  };
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {
  });
  document.body.onkeyup = null;
});

</script>
<style scoped lang="scss" >
@keyframes loading {
  0% {
    cy: 10;
  }
  25% {
    cy: 3;
  }
  50% {
    cy: 10;
  }
}

//body {
//  -webkit-font-smoothing: antialiased;
//  background-color: #f4f7ff;
//}

.container {
  width: 100%;
  height: 100%;
  position: relative;
}

canvas {
  height: 1600%;
  pointer-events: none;
  position: absolute;
  width: 600%;
  z-index: 2;
  //scale: 0.5;
  left: -200%;
  top: -800%;
  //background-color: #0a5988;
}

button {
  background: none;
  border: none;
  color: #f4f7ff;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 100%;
  outline: none;
  overflow: hidden;
  position: absolute;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  z-index: 1;


  &::before {
    background: #1f2335;
    border-radius: 50px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .4) inset;
    content: '';
    display: block;
    height: 100%;
    margin: 0 auto;
    position: relative;
    transition: width .2s cubic-bezier(.39, 1.86, .64, 1) .3s;
    width: 100%;
  }
}

// READY STATE
button.ready {
  .submitMessage svg {
    opacity: 1;
    top: 1px;
    transition: top .4s ease 600ms, opacity .3s linear 600ms;
  }

  .submitMessage .button-text span {
    top: 0;
    opacity: 1;
    transition: all .2s ease calc(var(--dr) + 600ms);
  }
}

// LOADING STATE
button.loading {
  &::before {
    transition: width .3s ease;
    width: 80%;
  }

  .loadingMessage {
    opacity: 1;
  }

  .loadingCircle {
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-name: loading;
    cy: 10;
  }
}

// COMPLETE STATE
button.complete {
  .submitMessage svg {
    top: -30px;
    transition: none;
  }

  .submitMessage .button-text span {
    top: -8px;
    transition: none;
  }

  .loadingMessage {
    top: 80px;
  }

  .successMessage .button-text span {
    left: 0;
    opacity: 1;
    transition: all .2s ease calc(var(--d) + 1000ms);
  }

  .successMessage svg {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset .3s ease-in-out 1.4s;
  }
}

.button-text span {
  opacity: 0;
  position: relative;
}

.message {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.message svg {
  display: inline-block;
  fill: none;
  margin-right: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.submitMessage {
  .button-text span {
    top: 8px;
    transition: all .2s ease var(--d);
  }

  svg {
    color: #5c86ff;
    margin-left: -1px;
    opacity: 0;
    position: relative;
    top: 30px;
    transition: top .4s ease, opacity .3s linear;
    width: 14px;
  }
}

.loadingMessage {
  opacity: 0;
  transition: opacity .3s linear .3s, top .4s cubic-bezier(.22, 0, .41, -0.57);

  svg {
    fill: #5c86ff;
    margin: 0;
    width: 22px;
  }
}

.successMessage {
  .button-text span {
    left: 5px;
    transition: all .2s ease var(--dr);
  }

  svg {
    color: #5cffa1;
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    transition: stroke-dashoffset .3s ease-in-out;
    width: 14px;
  }
}

.loadingCircle:nth-child(2) {
  animation-delay: .1s
}

.loadingCircle:nth-child(3) {
  animation-delay: .2s
}


/* Website Link */
.website-link {
  background: #f8faff;
  border-radius: 50px 0 0 50px;
  bottom: 30px;
  color: #324b77;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  height: 34px;
  filter: drop-shadow(2px 3px 4px rgba(#000, .1));
  padding: 0 20px 0 40px;
  position: fixed;
  right: 0;
  text-align: left;
  text-decoration: none;

  &__icon {
    left: -10px;
    position: absolute;
    top: -12px;
    width: 44px;
  }

  &__name {
    display: block;
    font-size: 14px;
    line-height: 14px;
    margin: 5px 0 3px;
  }

  &__last-name {
    color: #55bada;
  }

  &__message {
    color: #8aa8c5;
    display: block;
    font-size: 7px;
    line-height: 7px;
  }
}
</style>