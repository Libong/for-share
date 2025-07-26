<script lang="ts" setup>

import DeleteIcon from "@/assets/delete-icon.svg";
import UpdateIcon from "@/assets/update-icon.svg";
import MoreVertical from "@/assets/more-vertical.svg";
import {computed, PropType, ref} from "vue";
import {toSecondOrMilli} from "@/tool/tool";
import {IRecord} from "@/api/proto/recordinterface";
import Button6 from "@/components/common/button/Button6.vue";

const boxColorMap: Record<number, string> = {
  1: '#e9e7fd',
  2: '#ffd3e2',
  3: '#c8f7dc',
  4: '#d5deff',
  5: '#fee4cb',
  6: '#e9e7fd',
}

const showMenu = ref(true)
let props = defineProps({
  data: {
    type: Object as PropType<IRecord>,
    default: {},
  },
  insideEstablishTime: String,
})

/*时间相关操作*/
const insideEstablishTime = computed(() => {
  if (!props.data.establishAt || props.data.establishAt == 0) {
    return "";
  }
  const date = new Date(toSecondOrMilli(props.data.establishAt, false));
// 格式化为两位数
  const formatTwoDigits = (number: number) => number.toString().padStart(2, '0');
  return formatTwoDigits(date.getFullYear()) + ' ' + formatTwoDigits(date.getMonth() + 1) + ' ' + formatTwoDigits(date.getDate()) + ' '
      + formatTwoDigits(date.getHours()) + ":" + formatTwoDigits(date.getMinutes()) + ":" + formatTwoDigits(date.getSeconds());
})

function timestamp2Date(timestamp: number): string {
  if (timestamp == 0) {
    return "";
  }
  const date = new Date(toSecondOrMilli(timestamp, false));
  const formatTwoDigits = (number: number) => number.toString().padStart(2, '0');
  return formatTwoDigits(date.getFullYear()) + ' ' + formatTwoDigits(date.getMonth() + 1) + ' ' + formatTwoDigits(date.getDate());
}

const insideBuyTime = computed(() => {
  return timestamp2Date(props.data.buyAt);
})
const insideOverdueTime = computed(() => {
  return timestamp2Date(props.data.overdueAt);
})
const insideProduceTime = computed(() => {
  return timestamp2Date(props.data.produceAt);
})

const buyTimeTextAlignItems = ref('normal');

/*进度条相关操作*/
let currentTimeOffsetColor = computed(() => {
  if (currentTimeOffsetPercent >= 80) {
    return '#ff0000';
  } else if (currentTimeOffsetPercent >= 50) {
    return '#fffb00';
  } else {
    return '#52c518';
  }
})

//当前时间的偏移量
let currentTimeOffsetPercent = Math.floor((new Date().getTime() / 1000 - props.data.produceAt) / (props.data.overdueAt - props.data.produceAt) * 100);
if (currentTimeOffsetPercent > 100) {
  currentTimeOffsetPercent = 100;
}


//购买时间下标的偏移量
const triangleOffsetPercent = Math.floor((props.data.buyAt - props.data.produceAt) / (props.data.overdueAt - props.data.produceAt) * 100);
//购买时间文字的偏移量
let buyTimeOffsetPercent = 0;
if (triangleOffsetPercent > 10) {
  buyTimeOffsetPercent = triangleOffsetPercent - 11;
  buyTimeTextAlignItems.value = 'center';
}

let leftDayStr = "剩余 ";
const hasOverDue = ref(false);
let leftDay = Math.ceil((props.data.overdueAt - new Date().getTime() / 1000) / 86400);
if (leftDay >= 0) {
  let year = Math.floor(leftDay / 360);
  let month = Math.floor(leftDay % 360 / 30);
  let day = leftDay % 360 % 30;
  
  if (year != 0) {
    leftDayStr += year + "年";
  }
  if (month != 0) {
    leftDayStr += month + "个月";
  }
  if (day != 0) {
    leftDayStr += day + "日";
  }
} else {
  handleOverdue();
}

const showCompleteButton = ref(false);
let daysLeftTimer: number | NodeJS.Timeout | null = null; // 定时器

const handleDaysLeftMouseEnter = () => {
  // 如果已经有定时器，先清除
  if (daysLeftTimer !== null) {
    clearTimeout(daysLeftTimer);
  }
  console.log("handleDaysLeftMouseEnter in")
  // 设置定时器，1秒后显示按钮
  daysLeftTimer = setTimeout(() => {
    showCompleteButton.value = true;
  }, 1000);
};

// 鼠标离开时
const handleDaysLeftMouseLeave = () => {
  // 清除定时器
  if (daysLeftTimer !== null) {
    clearTimeout(daysLeftTimer);
    daysLeftTimer = null;
  }
  console.log("handleDaysLeftMouseEnter out")
  // 隐藏按钮
  showCompleteButton.value = false;
};

/*过期状态处理*/

function handleOverdue() {
  leftDayStr = "已过期";
  hasOverDue.value = true;
}

/*菜单操作*/
const isEnteringOrLeaving = ref(false);
const showMenuIcon = ref(false);

function showMenus() {
  showMenuIcon.value = !showMenuIcon.value;
}

function closePoint() {
  isEnteringOrLeaving.value = true;
}

function openPoint() {
  isEnteringOrLeaving.value = false;
}

const emits = defineEmits(['delete', 'update']);
const boxDelete = () => {
  emits('delete');
}
const boxUpdate = () => {
  emits('update', props.data);
}
</script>

<template>
  <div class="box">
    <div class="box-header">
      <span>{{ insideEstablishTime }}</span>
      <div class="box-header-more-wrapper">
        <div v-if="showMenu" class="box-header-more-wrapper-menu">
          <transition name="fade" tag="div"
                      @before-enter="closePoint"
                      @before-leave="closePoint"
                      @after-enter="openPoint"
                      @after-leave="openPoint">
            <img v-if="showMenuIcon && !hasOverDue" :src="UpdateIcon"
                 :style="{pointerEvents: isEnteringOrLeaving ? 'none':'auto'}"
                 alt="" class="box-header-more-wrapper-menu-update"
                 title="编辑"
                 @click="boxUpdate">
          </transition>
          <transition name="fade" tag="div"
                      @before-enter="closePoint"
                      @before-leave="closePoint"
                      @after-enter="openPoint"
                      @after-leave="openPoint">
            <img v-if="showMenuIcon" :src="DeleteIcon" :style="{pointerEvents: isEnteringOrLeaving ? 'none':'auto'}"
                 alt="" class="box-header-more-wrapper-menu-delete" title="删除"
                 @click="boxDelete">
          </transition>
        </div>
        <button class="box-header-btn-more">
          <img :src="MoreVertical" alt="" class="" @click="showMenus">
        </button>
      </div>
    </div>
    <div class="box-content-name">
      <p>{{ data.goodsName }}</p>
      <div class="box-content-category">
        <div v-for="item in data.goodsTypes" :key="item.id" class="box-content-category-child">
        <span class="box-content-subheader">{{
            item.name
          }}</span>
        </div>
      </div>
    
    </div>
    <div class="box-progress-wrapper">
      <div class="box-progress-top-date">
        <div class="box-progress-top-date-text">
          <span class="box-progress-header">生产日期</span>
          <span class="box-progress-header">{{ insideProduceTime }}</span>
        </div>
        <div class="box-progress-top-date-text">
          <span class="box-progress-header">过期时间</span>
          <span class="box-progress-header">{{ insideOverdueTime }}</span>
        </div>
      </div>
      <div class="box-progress-bar">
        <span :style="{width:currentTimeOffsetPercent+ '%',backgroundColor:currentTimeOffsetColor}"
              class="box-progress"></span>
        <span :style="{left: triangleOffsetPercent + '%'}" class="box-progress-triangle"></span>
      </div>
      <div class="box-progress-bottom-date">
        <div :style="{left: buyTimeOffsetPercent + '%',alignItems:buyTimeTextAlignItems}"
             class="box-progress-bottom-date-text">
          <span class="box-progress-header">购买时间</span>
          <span class="box-progress-header">{{ insideBuyTime }}</span>
        </div>
      </div>
    </div>
    <div class="project-box-footer"
         @mouseenter="handleDaysLeftMouseEnter"
         @mouseleave="handleDaysLeftMouseLeave"
    >
      <div class="days-left" style="color: #c8ffff;">
        <div>{{ leftDayStr }}
        </div>
      </div>
      <div class="record-complete">
        <Button6></Button6>
      </div>
      <!--      <CustomTick class="customTick"></CustomTick>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./box";

.customTick {
  scale: 0.2;
  padding: 0.5rem;
}

//效果1 不够连贯 TODO 先淡入第一个图标 再接着淡入第二个图标
.fadeUpdate-enter-active {
  transition: opacity 1s;
}

.fadeUpdate-leave-active {
  transition: opacity 1s;
}

.fadeUpdate-enter-from, .fadeUpdate-leave-to,
.fadeDelete-enter-from, .fadeDelete-leave-to {
  opacity: 0;
}

.fadeDelete-enter-active {
  transition: opacity 1s;
}

.fadeDelete-leave-active {
  transition: opacity 1.3s;
}

//效果2 整体淡入淡出
.fade-leave-active, .fade-enter-active {
  opacity: 1;
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>