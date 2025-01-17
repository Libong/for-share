<script lang="ts" setup>

import DeleteIcon from "@/assets/delete-icon.svg";
import UpdateIcon from "@/assets/update-icon.svg";
import MoreVertical from "@/assets/more-vertical.svg";
import {computed, PropType, ref} from "vue";
import {toSecondOrMilli} from "@/tool/tool";
import {ElMessage, ElMessageBox} from "element-plus";
import {IRecord} from "@/views/record/index";

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

const boxColor = boxColorMap[Math.floor(Math.random() * 6) + 1];

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
//当前时间的偏移量
let currentTimeOffsetPercent = Math.floor((new Date().getTime() / 1000 - props.data.produceAt) / (props.data.overdueAt - props.data.produceAt) * 100);
if (currentTimeOffsetPercent > 100) {
  currentTimeOffsetPercent = 100;
}

//购买时间下标的偏移量
const triangleOffsetPercent = Math.floor((props.data.buyAt - props.data.produceAt) / (props.data.overdueAt - props.data.produceAt) / 86400 * 100);
//购买时间文字的偏移量
let buyTimeOffsetPercent = 0;
if (triangleOffsetPercent > 10) {
  buyTimeOffsetPercent = triangleOffsetPercent - 11;
  buyTimeTextAlignItems.value = 'center';
}

let leftDayStr = "剩余 ";
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
  leftDayStr = "已过期";
}


/*菜单操作*/
// const showDeleteIcon = ref(false)
// const showUpdateIcon = ref(false)
const isEnteringOrLeaving = ref(false);
const showMenuIcon = ref(false);

function showMenus() {
  // showDeleteIcon.value = !showDeleteIcon.value;
  showMenuIcon.value = !showMenuIcon.value;
}

function closePoint() {
  isEnteringOrLeaving.value = true;
}

function openPoint() {
  isEnteringOrLeaving.value = false;
}


// function startSecondAnimation() {
//   showUpdateIcon.value = !showUpdateIcon.value
// }

const emits = defineEmits(['delete', 'update']);
const boxDelete = () => {
  //TODO 待优化 使用自定义
  ElMessageBox.confirm(
      '确认删除该记录吗？',
      // 'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        emits('delete');
      })
      .catch(() => {
        //TODO 提示需要放到外面去
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
}
const boxUpdate = () => {
  emits('update', props.data);
}
</script>

<template>
  <div :style="{backgroundColor: boxColor}" class="box">
    <div class="box-header">
      <span>{{ insideEstablishTime }}</span>
      <div class="box-header-more-wrapper">
        <div v-if="showMenu" class="box-header-more-wrapper-menu">
          <transition-group name="fade" tag="div"
                            @before-enter="closePoint"
                            @before-leave="closePoint"
                            @after-enter="openPoint"
                            @after-leave="openPoint">
            <!--          <transition name="fadeUpdate">-->
            <img v-if="showMenuIcon" :src="UpdateIcon" :style="{pointerEvents: isEnteringOrLeaving ? 'none':'auto'}"
                 alt="" class="box-header-more-wrapper-menu-update"
                 title="编辑"
                 @click="boxUpdate">
            <!--          </transition>-->
            <!--          <transition name="fadeDelete" @after-enter="startSecondAnimation">-->
            <img v-if="showMenuIcon" :src="DeleteIcon" :style="{pointerEvents: isEnteringOrLeaving ? 'none':'auto'}"
                 alt="" class="box-header-more-wrapper-menu-delete" title="删除"
                 @click="boxDelete">
            <!--          </transition>-->
          </transition-group>
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
        <span :style="{width:currentTimeOffsetPercent+ '%',backgroundColor:'#ff942e'}" class="box-progress"></span>
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
    <div class="project-box-footer">
      <div class="days-left" style="color: #ff942e;">
        {{ leftDayStr }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./box";

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
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>