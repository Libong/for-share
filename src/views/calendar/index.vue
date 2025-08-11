<template>
  <div class="calendar-container">
    <div v-if="allOwners.length != 0" class="calendar-owner-select">
      <button v-for="item in allOwners" class="calendar-owner-select-btn">
        <img :src="item.avatar" alt="" @click="setSelectOwner(item)"/>
        <span>{{ item.account }}</span>
      </button>
    </div>
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
              <h3>{{ selectedDate }} 账单</h3>
              <el-scrollbar :height="scrollbarHeight">
                <!--设置统一的label宽度使其右对齐-->
                <el-form label-width="80px">
                  <div class="modal-expend" @click="toggleIncomes">
                    <span>收入</span>
                    <el-icon class="arrow-icon">
                      <arrow-down v-if="!isIncomeVisible"/>
                      <arrow-up v-else/>
                    </el-icon>
                  </div>
                  <transition name="fade">
                    <div v-show="isIncomeVisible" class="expenses-form">
                      <el-form-item
                          label="今日收入">
                        <el-input-number
                            v-model="form.dayIncome"
                            :min="0"
                        />
                      </el-form-item>
                      <el-form-item
                          label="现金收入">
                        <el-input-number
                            v-model="form.cash"
                            :min="0"
                        />
                      </el-form-item>
                      <el-form-item
                          label="在线收入">
                        <el-input-number
                            v-model="form.onlineIncome"
                            :min="0"
                        />
                      </el-form-item>
                      <el-form-item label="是否提款">
                        <el-radio-group v-model="form.isDraw">
                          <el-radio :value="1">是</el-radio>
                          <el-radio :value="2">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="提款收入">
                        <el-input-number
                            v-model="form.drawIncome"
                            :min="0"
                        />
                      </el-form-item>
                      <el-form-item label="卡收入">
                        <el-input-number
                            v-model="form.cardIncome"
                            :min="0"
                        />
                      </el-form-item>
                      <el-form-item label="其他备注:">
                      </el-form-item>
                      <el-form-item label-width="0px">
                        <el-input
                            v-model="form.remark"
                            :autosize="{ minRows: 2, maxRows: 5 }"
                            :maxlength="100"
                            placeholder="请输入备注内容"
                            show-word-limit
                            type="textarea"
                        />
                      </el-form-item>
                    </div>
                  </transition>
                  <span class="form-separator"></span>
                  <div class="modal-expend" @click="toggleExpenses">
                    <span>支出</span>
                    <el-icon class="arrow-icon">
                      <arrow-down v-if="!isExpensesVisible"/>
                      <arrow-up v-else/>
                    </el-icon>
                  </div>
                  <transition name="fade">
                    <div v-show="isExpensesVisible" class="expenses-form">
                      <el-form-item label="进货支出">
                        <el-input-number v-model="form.goodsExpenses" :min="0"/>
                      </el-form-item>
                      <el-form-item label="酒水支出">
                        <el-input-number v-model="form.drinksExpenses" :min="0"/>
                      </el-form-item>
                      <el-form-item label="其他支出">
                        <el-input-number v-model="form.otherExpenses" :min="0"/>
                      </el-form-item>
                      <el-form-item label="其他支出备注:" label-width="100px">
                      </el-form-item>
                      <el-form-item label-width="0px">
                        <el-input
                            v-model="form.otherExpensesRemark"
                            :autosize="{ minRows: 2, maxRows: 5 }"
                            :maxlength="100"
                            placeholder="请输入备注内容"
                            show-word-limit
                            type="textarea"
                        />
                      </el-form-item>
                    </div>
                  </transition>
                </el-form>
              </el-scrollbar>
              <div class="btn-bar">
                <button @click="save">保存</button>
                <button @click="clear">清空</button>
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
import {computed, onMounted, reactive, ref} from 'vue'
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";
import {
  addFinanceBillInterface,
  deleteFinanceBillInterface,
  IAddFinanceBillReq,
  IFinanceBill,
  IFinanceBillAccount,
  IUpdateFinanceBillReq,
  searchFinanceBillAccountsInterface,
  searchFinanceBillsPageInterface,
  updateFinanceBillInterface
} from "@/api/proto/calendarInterface";
import {ObjClear, timestampToYYYYMMDD} from "@/tool/tool";
import {ShowCommonMessage} from "@/tool/message";
import {localStorage_roleObj_label} from "@/config/localStorage";

onMounted(() => {
  updateMonthBillData();
  userIsManager();
})

/* 管理员功能 选择人*/
const selectOwner = ref("")
const allOwners = ref<IFinanceBillAccount[]>([])

function userIsManager() {
  const roleObjStr = localStorage.getItem(localStorage_roleObj_label);
  if (roleObjStr) {
    const roleObj = JSON.parse(roleObjStr);
    if (roleObj.id == "manager") {
      searchOwners();
    }
  }
}

async function setSelectOwner(owner: IFinanceBillAccount) {
  selectOwner.value = owner.accountId
  await updateMonthBillData()
  ShowCommonMessage("已切换至" + owner.account + "视角", "success")
}

async function searchOwners() {
  const resp = await searchFinanceBillAccountsInterface({});
  if (!resp.list) {
    return
  }
  allOwners.value = resp.list;
}

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

async function prevMonth() {
  if (month.value === 0) {
    year.value--
    month.value = 11
  } else {
    month.value--
  }
  await updateMonthBillData()
}

async function nextMonth() {
  if (month.value === 11) {
    year.value++
    month.value = 0
  } else {
    month.value++
  }
  await updateMonthBillData()
}

/* ===== 弹窗逻辑 ===== */
const modalVisible = ref(false)
const selectedDate = ref('')
const form = reactive<IFinanceBill>({
  billId: "", timestamp: 0,
  drinksExpenses: 0, otherExpenses: 0, otherExpensesRemark: "",
  cardIncome: 0, cash: 0, drawIncome: 0, goodsExpenses: 0, isDraw: 2, onlineIncome: 0, remark: "", dayIncome: 0
})

//表单内容
const isExpensesVisible = ref(false);
const toggleExpenses = () => {
  isExpensesVisible.value = !isExpensesVisible.value;
  appendScrollbarHeight();
};
const isIncomeVisible = ref(false);
const toggleIncomes = () => {
  isIncomeVisible.value = !isIncomeVisible.value;
  appendScrollbarHeight();
};
const scrollbarHeight = ref('100px')
const appendScrollbarHeight = () => {
  console.log(isExpensesVisible.value + " " + isIncomeVisible.value)
  if (!isExpensesVisible.value && !isIncomeVisible.value) {
    scrollbarHeight.value = '100px';
  } else {
    scrollbarHeight.value = '300px';
  }
}

// 以 2025-07-30 为 key 的对象
const eventMap = ref<Record<string, IFinanceBill>>({})

async function updateMonthBillData() {
  //获取当前月份的头尾时间戳
  const startMonthTimestamp = new Date(year.value, month.value, 1)
  startMonthTimestamp.setHours(0, 0, 0, 0)
  const endMonthTimestamp = new Date(year.value, month.value + 1, 1, 0, 0, -1)
  const resp = await searchFinanceBillsPageInterface({
    endTimestamp: endMonthTimestamp.getTime(),
    pageNum: 0,
    pageSize: 0,
    startTimestamp: startMonthTimestamp.getTime(),
    owner: selectOwner.value,
  });
  //更新已存在的列表的数据
  if (!resp.list) {
    return
  }
  resp.list.forEach((item) => {
    const dateStr = timestampToYYYYMMDD(item.timestamp);
    eventMap.value[dateStr] = item
  })
}

function openModal(item: any) {
  if (!item.inMonth) return
  //设置选中的日期
  selectedDate.value = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(
      item.day,
  ).padStart(2, '0')}`
  //从eventMap中获取数据到form中回显
  if (eventMap.value[selectedDate.value]) {
    Object.assign(form, eventMap.value[selectedDate.value])
  }
  modalVisible.value = true
}

function closeModal() {
  ObjClear(form);
  modalVisible.value = false
}

async function clear() {
  if (!eventMap.value[selectedDate.value]) {
    closeModal()
    return
  }
  const billId = eventMap.value[selectedDate.value].billId
  await deleteFinanceBillInterface({billId: billId})
  eventMap.value[selectedDate.value] = {} as IFinanceBill
  ShowCommonMessage("清空成功", "success")
  closeModal()
}

async function save() {
  //设置当前日期时间戳
  // if (form.timestamp == 0) {
  let date = new Date(selectedDate.value);
  date.setHours(0, 0, 0, 0)
  form.timestamp = date.getTime()
  // }
  if (form.billId != "") {
    const updateReq = {} as IUpdateFinanceBillReq
    Object.assign(updateReq, form)
    await updateFinanceBillInterface(updateReq)
  } else {
    const addReq = {} as IAddFinanceBillReq
    Object.assign(addReq, form)
    const resp = await addFinanceBillInterface(addReq)
    form.billId = resp.billId
  }
  // 确保 eventMap.value[selectedDate.value] 是一个对象
  if (!eventMap.value[selectedDate.value]) {
    eventMap.value[selectedDate.value] = {} as IFinanceBill
  }
  //更新本地数据 form数据会被清空
  Object.assign(eventMap.value[selectedDate.value], form)
  closeModal()
  ShowCommonMessage("保存成功", "success")
}
</script>

<style lang="scss" scoped>
@import "index";
</style>