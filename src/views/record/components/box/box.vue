<script lang="ts" setup>

import DeleteIcon from "@/assets/delete-icon.svg";
import UpdateIcon from "@/assets/update-icon.svg";
import MoreVertical from "@/assets/more-vertical.svg";
import {computed, PropType, ref} from "vue";
import {ISearchRecord} from "@/views/record/index";

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
    type: Object as PropType<ISearchRecord>,
    default: {},
  },
  insideEstablishTime: String,
})

const boxColor = boxColorMap[Math.floor(Math.random() * 6) + 1];

/*时间相关操作*/
const insideEstablishTime = computed(() => {
  const date = new Date(props.data.establishAt * 1000);
// 格式化为两位数
  const formatTwoDigits = (number: number) => number.toString().padStart(2, '0');
  return formatTwoDigits(date.getFullYear()) + ' ' + formatTwoDigits(date.getMonth() + 1) + ' ' + formatTwoDigits(date.getDate()) + ' '
      + formatTwoDigits(date.getHours()) + ":" + formatTwoDigits(date.getMinutes()) + ":" + formatTwoDigits(date.getSeconds())
})

function timestamp2Date(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const formatTwoDigits = (number: number) => number.toString().padStart(2, '0');
  return formatTwoDigits(date.getFullYear()) + ' ' + formatTwoDigits(date.getMonth() + 1) + ' ' + formatTwoDigits(date.getDate())
}

const insideBugTime = computed(() => {
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
const currentTimeOffsetPercent = Math.floor((new Date().getTime() / 1000 - props.data.produceAt) / (props.data.overdueAt - props.data.produceAt) * 100)
//购买时间下标的偏移量
const triangleOffsetPercent = Math.floor((props.data.buyAt - props.data.produceAt) / (props.data.overdueAt - props.data.produceAt) / 86400 * 100)
//购买时间文字的偏移量
let buyTimeOffsetPercent = 0;
if (triangleOffsetPercent > 10) {
  buyTimeOffsetPercent = triangleOffsetPercent - 11;
  buyTimeTextAlignItems.value = 'center';
}

let leftDay = Math.ceil((props.data.overdueAt - new Date().getTime() / 1000) / 86400)
if (leftDay < 0) {
  leftDay = 0;
}

/*菜单操作*/
// const showDeleteIcon = ref(false)
// const showUpdateIcon = ref(false)
const showMenuIcon = ref(false)

function showMenus() {
  // showDeleteIcon.value = !showDeleteIcon.value;
  showMenuIcon.value = !showMenuIcon.value;
}

// function startSecondAnimation() {
//   showUpdateIcon.value = !showUpdateIcon.value
// }
</script>

<template>
  <div :style="{backgroundColor: boxColor}" class="project-box">
    <div class="project-box-header">
      <span>{{ insideEstablishTime }}</span>
      <div class="more-wrapper">
        <div v-if="showMenu" class="more-wrapper-menu">
          <transition-group name="fade" tag="div">
            <!--          <transition name="fadeUpdate">-->
            <img v-if="showMenuIcon" :src="UpdateIcon" alt="" class="more-wrapper-menu-update" title="编辑" @click="">
            <!--          </transition>-->
            <!--          <transition name="fadeDelete" @after-enter="startSecondAnimation">-->
            <img v-if="showMenuIcon" :src="DeleteIcon" alt="" class="more-wrapper-menu-delete" title="删除" @click="">
            <!--          </transition>-->
          </transition-group>
        </div>
        <button class="project-btn-more">
          <img :src="MoreVertical" alt="" class="" @click="showMenus">
        </button>
      </div>
    </div>
    <div class="project-box-content-header">
      <p class="box-content-header">{{ data.goodsName }}</p>
      <p class="box-content-subheader">{{ data.goodsTypes[0].name }}</p>
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
          <span class="box-progress-header">{{ insideBugTime }}</span>
        </div>
      </div>
    </div>
    <div class="project-box-footer">
      <!--            <div class="participants">-->
      <!--              <img-->
      <!--                  alt="participant"-->
      <!--                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80">-->
      <!--              <img-->
      <!--                  alt="participant"-->
      <!--                  src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60">-->
      <!--              <button class="add-participant" style="color: #ff942e;">-->
      <!--                <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"-->
      <!--                     stroke-linecap="round"-->
      <!--                     stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"-->
      <!--                     xmlns="http://www.w3.org/2000/svg">-->
      <!--                  <path d="M12 5v14M5 12h14"/>-->
      <!--                </svg>-->
      <!--              </button>-->
      <!--            </div>-->
      <div class="days-left" style="color: #ff942e;">
        {{ leftDay }} Days Left
      </div>
      <div class="box-over">
        <!--        <Button2></Button2>-->
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
  transition: opacity 1s, transform 1s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>