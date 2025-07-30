<template>
  <div class="calendar-container">
    <div class="header-title">
      <span>！！开始记账 ！！</span>
    </div>
    <div class="calendar-wrapper">
      <!-- 顶部年月 -->
      <header class="calendar-header">
        <button @click="prevMonth">‹</button>
        <span>{{ year }} 年 {{ month + 1 }} 月</span>
        <button @click="nextMonth">›</button>
      </header>
      
      <!-- 星期 -->
      <ul class="weekdays">
        <li v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</li>
      </ul>
      
      <!-- 日期网格 -->
      <ul class="days">
        <li
            v-for="(item, idx) in calendarGrid"
            :key="idx"
            :class="{
          placeholder: !item.inMonth,
          today: item.isToday,
        }"
            @click="openModal(item)"
        >
          {{ item.day }}
        </li>
      </ul>
      
      <!-- 弹窗 -->
      <teleport to="body">
        <transition name="fade">
          <div v-if="modalVisible" class="modal-mask" @click.self="closeModal">
            <div class="modal">
              <h3>{{ selectedDate }} 事件</h3>
              
              <label>
                事件名称
                <input v-model="form.title"/>
              </label>
              
              <label>
                事件类型
                <select v-model="form.type">
                  <option value="meeting">会议</option>
                  <option value="travel">出行</option>
                  <option value="life">生活</option>
                </select>
              </label>
              
              <label>
                备注
                <textarea v-model="form.note" rows="3"></textarea>
              </label>
              
              <div class="btn-bar">
                <button @click="save">保存</button>
                <button @click="closeModal">取消</button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

/* ===== 日历逻辑 ===== */
const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth())

const calendarGrid = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const arr: any[] = []
  
  // 上月占位
  const prevDays = new Date(year.value, month.value, 0).getDate()
  for (let i = 0; i < firstDay; i++) {
    arr.unshift({day: prevDays - i, inMonth: false})
  }
  
  // 当月
  for (let i = 1; i <= daysInMonth; i++) {
    arr.push({
      day: i,
      inMonth: true,
      isToday:
          year.value === today.getFullYear() &&
          month.value === today.getMonth() &&
          i === today.getDate(),
    })
  }
  
  // 下月占位（凑满 6 行 42 格）
  const len = 42 - arr.length
  for (let i = 1; i <= len; i++) {
    arr.push({day: i, inMonth: false})
  }
  
  return arr
})

function prevMonth() {
  if (month.value === 0) {
    year.value--
    month.value = 11
  } else {
    month.value--
  }
}

function nextMonth() {
  if (month.value === 11) {
    year.value++
    month.value = 0
  } else {
    month.value++
  }
}

/* ===== 弹窗逻辑 ===== */
interface Form {
  title: string
  type: string
  note: string
}

const modalVisible = ref(false)
const selectedDate = ref('')
const form = ref<Form>({title: '', type: 'meeting', note: ''})

// 以 2025-07-30 为 key 的对象
const eventMap = ref<Record<string, Form>>({})

function openModal(item: any) {
  if (!item.inMonth) return
  selectedDate.value = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(
      item.day,
  ).padStart(2, '0')}`
  // 如果已有数据则回填
  form.value = eventMap.value[selectedDate.value] || {title: '', type: 'meeting', note: ''}
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function save() {
  eventMap.value[selectedDate.value] = {...form.value}
  closeModal()
}
</script>

<style lang="scss" scoped>
@import "index";
</style>