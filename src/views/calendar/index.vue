<template>
  <div class="calendar-container">
    <div v-if="allOwners.length != 0" class="calendar-owner-select">
      <button v-for="item in allOwners" :class="{active:item.accountId !== selectOwner}"
              class="calendar-owner-select-btn" @click="setSelectOwner(item)">
        <img :src="item.avatar ? item.avatar : Account" alt=""/>
        <span>{{ item.account }}</span>
      </button>
    </div>
    <div class="header-title">
      <span>！！开始记账 ！！</span>
      <div :class="['header-title-btn',{active:showDailyStat}]"
           @click="()=>{showDailyStat = !showDailyStat}">每日统计
      </div>
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
        }"
        >
          <div :class="{today:item.isToday}" class="li-first" @click="openModal(item)">
            <img v-if="eventMap[item.dateKey] && eventMap[item.dateKey].isDraw && showDailyStat" :src="Draw" alt=""
                 class="draw-img draw-img-up"/>
            <span class="day-text">{{ item.day }}</span>
            <img v-if="eventMap[item.dateKey] && eventMap[item.dateKey].drawIncome && showDailyStat" :src="DrawIncome"
                 alt=""
                 class="draw-img draw-img-down"/>
          </div>
          <div v-show="!showDailyStat" class="notice-point">
            <img
                v-if="activeDateRepayPointMap[item.dateKey]"
                alt=""
                src="@/assets/red-point.png"/>
            <img
                v-else
                alt=""
                src="@/assets/red-point.png"
                style="visibility: hidden;"/>
          </div>
          
          <div v-show="showDailyStat" class="sum-content">
            <span>{{
                statDailyIncomeMap[item.dateKey] ? `+${statDailyIncomeMap[item.dateKey]}` : ''
              }}</span>
            <span>{{
                statDailyExpenseMap[item.dateKey] ? `-${statDailyExpenseMap[item.dateKey]}` : ''
              }}</span>
          </div>
        </li>
      </ul>
      
      <!-- 弹窗 -->
      <teleport to="body">
        <transition name="fade">
          <div v-if="modalVisible" class="modal-mask">
            <div class="modal">
              <h3>{{ timestampToYYYYMMDD(selectedDateTimestamp) }} 账单</h3>
              <el-scrollbar :height="scrollbarHeight" class="teleport-el-scrollbar"
                            style="padding: 0 10px 10px 10px;">
                <!--设置统一的label宽度使其右对齐-->
                <el-form ref="formRef" :model="form" :rules="rules" class="teleport-form-style" label-width="80px">
                  <div v-if="showRepayContent" class="modal-expend"
                       @click="toggleRepay">
                    <span>还款详情</span>
                    <el-icon>
                      <arrow-down v-if="!isRepayVisible"/>
                      <arrow-up v-else/>
                    </el-icon>
                  </div>
                  <transition name="fade">
                    <div v-show="isRepayVisible">
                      <el-form-item label="还款单位">
                        <el-input
                            v-model="formExtra.repayUnit"
                            :disabled="curUserRole != 'manager'">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="还款金额">
                        <el-input-number
                            v-model="form.repayExpenses"
                            :disabled="curUserRole != 'manager'">
                        </el-input-number>
                      </el-form-item>
                      <el-form-item label="还款截图证明" label-width="100px">
                      </el-form-item>
                      <el-form-item class="special-el-form-item-img" label-width="0px">
                        <div v-for="(image, index) in formExtra.repayImages" :key="index" class="image-item">
                          <el-image
                              :preview-src-list="[image]"
                              :src="image"
                              class="preview-image"
                              fit="cover"
                          ></el-image>
                          <el-icon v-if="curUserRole == 'manager'" class="image-delete-icon"
                                   @click="deleteImage(index)">
                            <Close class="el-icon-close"/>
                          </el-icon>
                        </div>
                        <!-- 如果图片数组为空，或者在最后一个图片后面显示上传按钮 -->
                        <div
                            v-if="(!formExtra.repayImages || formExtra.repayImages.length < 3) && curUserRole == 'manager'"
                            class="upload-container">
                          <el-upload
                              :before-upload="beforeUpload"
                              :http-request="handleUpload"
                              :on-error="handleUploadErr"
                              :on-success="handleUploadErrSuccess"
                              :show-file-list="false"
                              accept="image/*"
                              class="upload-item"
                              list-type="picture-card"
                          >
                            <el-icon>
                              <Plus class="el-icon-plus"/>
                            </el-icon>
                          </el-upload>
                        </div>
                      </el-form-item>
                    </div>
                  </transition>
                  <span v-if="showRepayContent" class="form-separator"></span>
                  <div class="modal-expend" @click="toggleIncomes">
                    <span>收入</span>
                    <el-icon class="arrow-icon">
                      <arrow-down v-if="!isIncomeVisible"/>
                      <arrow-up v-else/>
                    </el-icon>
                  </div>
                  <transition name="fade">
                    <div v-show="isIncomeVisible">
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
                      <el-form-item class="special-el-form-item-drawIncome" label="提款收入" prop="drawIncome">
                        <el-input-number
                            v-model="form.drawIncome"
                            :min="0"
                            style="width: 60%"
                            @input="validateSingleField('drawIncome')"
                        />
                        <el-select v-model="formExtraTempDrawDate" :disabled="!form.drawIncome"
                                   placeholder="请选择">
                          <el-option v-for="t in recentDrawTimestamps" :label="timestampToYYYYMMDD(t,true)" :value="t"/>
                        </el-select>
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
                    <div v-show="isExpensesVisible">
                      <el-form-item label="进货支出">
                        <el-input-number v-model="form.goodsExpenses" :min="0"/>
                      </el-form-item>
                      <el-form-item label="酒水支出">
                        <el-input-number v-model="form.drinksExpenses" :min="0"/>
                      </el-form-item>
                      <el-form-item label="其他支出">
                        <el-input-number v-model="form.otherExpenses" :min="0"/>
                      </el-form-item>
                      <el-form-item label="其他支出备注:" label-width="120px">
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
                <button @click="save(formRef)">保存</button>
                <button @click="clear">清空</button>
                <button @click="closeModal">取消</button>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
      
      <CalendarConfirmDialog
          v-model:visible="imageDeleteConfirmDialogVisible"
          :message="`确定要移除该照片吗？`"
          title="移除照片"
          type="danger"
          @cancel="handleDeleteImageConfirm(false)"
          @confirm="handleDeleteImageConfirm(true)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {ArrowDown, ArrowUp, Close, Plus} from "@element-plus/icons-vue";
import {
  addFinanceBillInterface,
  deleteFinanceBillInterface,
  IAddFinanceBillReq,
  IFinanceBill,
  IFinanceBillAccount,
  IFinanceBillExtra,
  IUpdateFinanceBillReq,
  searchFinanceBillAccountsInterface,
  searchFinanceBillsPageInterface,
  updateFinanceBillInterface
} from "@/api/proto/calendarInterface";
import {ObjClear, timestampToYYYYMMDD} from "@/tool/tool";
import {ShowCommonMessage} from "@/tool/message";
import {GetCurRole} from "@/config/localStorage";
import {rem} from "@/main";
import {fileUploadInterface, UploadFileType} from "@/api/proto/fileinterface";
import {FormInstance, UploadFile, UploadFiles, UploadRequestOptions} from "element-plus";
import {UploadFileTypeText} from "@/config/common";
import CalendarConfirmDialog from "@/views/calendar/calendarConfirmDialog.vue";
import {Record} from "@icon-park/vue-next";
import Account from "@/assets/username.svg";
import Draw from "@/assets/draw.png";
import DrawIncome from "@/assets/drawIncome.png";

onMounted(() => {
  updateMonthBillData();
  userIsManager();
})

/* 管理员功能 选择人*/
const selectOwner = ref("")
const allOwners = ref<IFinanceBillAccount[]>([])
const curUserRole = ref("")

function userIsManager() {
  curUserRole.value = GetCurRole();
  if (curUserRole.value == "manager") {
    searchOwners();
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

interface CalendarItem {
  day: number;
  inMonth: boolean;
  isToday: boolean;
  dateKey: number; //当前毫秒时间戳
}

const calendarGrid = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const arr: CalendarItem[] = []
  
  
  // 上月占位
  const prevDays = new Date(year.value, month.value, 0).getDate()
  for (let i = 0; i < firstDay; i++) {
    arr.unshift({day: prevDays - i, inMonth: false, isToday: false, dateKey: 0})
  }
  
  // 当月
  for (let i = 1; i <= daysInMonth; i++) {
    const monthDayTimestamp = new Date(year.value, month.value, i)
    monthDayTimestamp.setHours(0, 0, 0, 0)
    arr.push({
      day: i,
      inMonth: true,
      isToday:
          year.value === today.getFullYear() &&
          month.value === today.getMonth() &&
          i === today.getDate(),
      dateKey: monthDayTimestamp.getTime(),
    })
  }
  
  // 下月占位（凑满 6 行 42 格）
  const len = 42 - arr.length
  for (let i = 1; i <= len; i++) {
    arr.push({day: i, inMonth: false, isToday: false, dateKey: 0})
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
const showDailyStat = ref(false)
const selectedDateTimestamp = ref(0)
const form = reactive<IFinanceBill>({
  repayExpenses: 0, drinksExpenses: 0, otherExpenses: 0, otherExpensesRemark: "", goodsExpenses: 0,
  billId: "", timestamp: 0, remark: "", extra: "",
  cardIncome: 0, cash: 0, drawIncome: 0, isDraw: 2, onlineIncome: 0, dayIncome: 0
})
const formExtraTempDrawDate = ref<number | undefined>(undefined)
const formExtra = reactive<IFinanceBillExtra>({
  repayUnit: "", repayImages: [], drawDate: 0
})
/* ===== 表单内容 ===== */
const formRef = ref<FormInstance>()
//TODO 很怪validateField调用后会将对应的规则的callback中的new Error作为reject返回 然后被全局捕获
// 当数字变化时，立即重新校验下拉框
async function validateSingleField(propName: string) {
  //用于重新显示select的请选择样式 只有当值为undefined、空字符串时才能被判定为false
  if (!form.drawIncome) {
    formExtraTempDrawDate.value = undefined
  }
  try {
    await formRef.value?.validateField(propName);
  } catch (err) {
  }
}

// 校验规则
const rules = {
  drawIncome: [
    {
      validator: (_: any, value: any, callback: any) => {
        // 只要数字不为 0，就必须选一项
        if (form.drawIncome !== 0 && !formExtraTempDrawDate.value) {
          console.log("validator err")
          callback(new Error('请选择对应提款日期'))
        } else {
          console.log("validator ok")
          callback()
        }
      },
      trigger: ['change', 'blur']
    }
  ]
}

const showRepayContent = computed(() => {
  return form.repayExpenses != 0 || curUserRole.value == 'manager'
})
const isExpensesVisible = ref(false);
const toggleExpenses = () => {
  isExpensesVisible.value = !isExpensesVisible.value;
};
const isIncomeVisible = ref(false);
const toggleIncomes = () => {
  isIncomeVisible.value = !isIncomeVisible.value;
};
const isRepayVisible = ref(false);
const toggleRepay = () => {
  isRepayVisible.value = !isRepayVisible.value;
};
const scrollbarHeight = computed(() => {
  if (!isExpensesVisible.value && !isIncomeVisible.value) {
    if (showRepayContent.value) {
      return rem(350);
    } else {
      return rem(200);
    }
  } else {
    return rem(300);
  }
})
/* ===== 文件上传 ===== */
const selectDeleteImageIndex = ref(-1)
const imageDeleteConfirmDialogVisible = ref(false)
const handleDeleteImageConfirm = (confirm: boolean) => {
  if (confirm) {
    formExtra.repayImages.splice(selectDeleteImageIndex.value, 1);
  }
  selectDeleteImageIndex.value = -1
}
// 删除图片的方法
const deleteImage = (index: number) => {
  selectDeleteImageIndex.value = index
  imageDeleteConfirmDialogVisible.value = true
};
// 上传前的回调
const beforeUpload = (file: File) => {
  // 可以在这里添加一些校验逻辑
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ShowCommonMessage('只能上传图片文件', "warning");
    return false;
  }
  return true;
};

const handleUpload: (options: UploadRequestOptions) => void = async (options) => {
  const {file} = options;
  if (!file) {
    ShowCommonMessage('照片上传失败', "error");
    return;
  }
  const formData = new FormData()
  formData.append('file', file)
  const params = {
    [UploadFileTypeText]: UploadFileType.UploadFileTypeImage
  }
  // 调用上传接口
  const resp = await fileUploadInterface(formData, params);
  
  // 假设接口返回的数据格式为 { url: string }
  formExtra.repayImages.push(resp.url)
}
const handleUploadErr = (err: string, file: UploadFile, fileList: UploadFiles) => {
  ShowCommonMessage(err as string, "error");
}
const handleUploadErrSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  ShowCommonMessage("照片上传成功", "success");
}

/* ===== 数据更新 ===== */
const eventMap = ref<Record<number, IFinanceBill>>({})
const activeDateRepayPointMap = ref<Record<number, boolean>>({})
const statDailyIncomeMap = ref<Record<number, number>>({})
const statDailyExpenseMap = ref<Record<number, number>>({})
const recentDrawTimestamps = ref<number[]>([])

function resetStatMap() {
  activeDateRepayPointMap.value = {}
  statDailyIncomeMap.value = {}
  statDailyExpenseMap.value = {}
  recentDrawTimestamps.value = []
  eventMap.value = {}
}

function updateItemMap(item: IFinanceBill) {
  //计算每日收入支出
  statDailyIncomeMap.value[item.timestamp] = item.dayIncome
  statDailyExpenseMap.value[item.timestamp] = item.drinksExpenses + item.goodsExpenses + item.otherExpenses + item.repayExpenses
  //有还款信息需要提示
  if (item.repayExpenses) {
    activeDateRepayPointMap.value[item.timestamp] = true
  }
}

async function updateMonthBillData() {
  //重置数据
  resetStatMap()
  //获取当前月份的头尾时间戳 (另外由于需要获取到最近的提款日期用于提款收入时的选择 前后各多10天)
  const startMonthTimestamp = new Date(year.value, month.value, -9)
  startMonthTimestamp.setHours(0, 0, 0, 0)
  const endMonthTimestamp = new Date(year.value, month.value + 1, 11, 0, 0, -1)
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
    eventMap.value[item.timestamp] = item
    if (item.isDraw) {
      recentDrawTimestamps.value.push(item.timestamp)
    }
    updateItemMap(item)
  })
}

function openModal(item: CalendarItem) {
  if (!item.inMonth) return
  //重置表单
  ObjClear(form)
  ObjClear(formExtra)
  isExpensesVisible.value = false
  isRepayVisible.value = false
  isIncomeVisible.value = false
  //设置选中的日期
  selectedDateTimestamp.value = item.dateKey
  //从eventMap中获取数据到form中回显
  if (eventMap.value[item.dateKey]) {
    Object.assign(form, eventMap.value[item.dateKey])
    if (eventMap.value[item.dateKey].extra) {
      const extraJson = JSON.parse(eventMap.value[item.dateKey].extra)
      formExtra.repayUnit = extraJson.repayUnit || ''
      formExtra.repayImages = extraJson.repayImages || []
      formExtra.drawDate = extraJson.drawDate || 0
      formExtraTempDrawDate.value = extraJson.drawDate || 0
    }
  }
  
  modalVisible.value = true
}

function closeModal() {
  ObjClear(form)
  //TODO 有点忘记加这个判断的意义了
  if (curUserRole.value == 'manager') {
    ObjClear(formExtra)
  }
  modalVisible.value = false
}

async function clear() {
  if (!eventMap.value[selectedDateTimestamp.value]) {
    closeModal()
    return
  }
  const billId = eventMap.value[selectedDateTimestamp.value].billId
  await deleteFinanceBillInterface({billId: billId})
  eventMap.value[selectedDateTimestamp.value] = {} as IFinanceBill
  ShowCommonMessage("清空成功", "success")
  closeModal()
}

async function save(formEl: FormInstance | undefined) {
  if (!formEl) {
    return
  }
  let formCheckValid = false
  await formEl.validate((valid, fields) => {
    formCheckValid = valid
    if (!valid) {
      ShowCommonMessage("记录填写有误，请检查", "error")
    }
  })
  if (!formCheckValid) {
    return
  }
  //设置当前日期时间戳
  form.timestamp = selectedDateTimestamp.value
  formExtra.drawDate = formExtraTempDrawDate.value ?? 0
  const formExtraJson = JSON.stringify(formExtra)
  if (form.billId != "") {
    const updateReq = {} as IUpdateFinanceBillReq
    Object.assign(updateReq, form)
    updateReq.extra = formExtraJson
    await updateFinanceBillInterface(updateReq)
  } else {
    const addReq = {} as IAddFinanceBillReq
    Object.assign(addReq, form)
    if (selectOwner.value != '') {
      addReq.owner = selectOwner.value
    }
    addReq.extra = formExtraJson
    const resp = await addFinanceBillInterface(addReq)
    form.billId = resp.billId
  }
  // 确保 eventMap.value[selectedDate.value] 是一个对象
  if (!eventMap.value[selectedDateTimestamp.value]) {
    eventMap.value[selectedDateTimestamp.value] = {} as IFinanceBill
  }
  //更新本地数据 form数据会被清空
  Object.assign(eventMap.value[selectedDateTimestamp.value], form)
  eventMap.value[selectedDateTimestamp.value].extra = formExtraJson
  updateItemMap(form)
  closeModal()
  ShowCommonMessage("保存成功", "success")
}
</script>

<style lang="scss" scoped>
@import "index";
</style>