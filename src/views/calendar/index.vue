<template>
  <div class="calendar-container">
    <div v-if="allOwners.length != 0" class="calendar-owner-select">
      <button v-for="item in allOwners" :class="{active:item.accountId != selectOwner}"
              class="calendar-owner-select-btn" @click="setSelectOwner(item)">
        <img :src="item.avatar" alt=""/>
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
          today: item.isToday,
        }"
            @click="openModal(item)"
        >
          <span>{{ item.day }}</span>
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
                eventMap[item.dateKey] && eventMap[item.dateKey].dayIncome ? `+${eventMap[item.dateKey].dayIncome}` : '-'
              }}</span>
            <span>{{
                eventMap[item.dateKey]
                    ? `-${(eventMap[item.dateKey].otherExpenses || 0) +
                    (eventMap[item.dateKey].goodsExpenses || 0) +
                    (eventMap[item.dateKey].repayExpenses || 0) +
                    (eventMap[item.dateKey].drinksExpenses || 0)}`
                    : ''
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
                            style="padding: 0 10px;">
                <!--设置统一的label宽度使其右对齐-->
                <el-form class="teleport-form-style" label-width="80px">
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
                      <el-form-item label-width="0px">
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
import {localStorage_roleObj_label} from "@/config/localStorage";
import {rem} from "@/main";
import {fileUploadInterface, UploadFileType} from "@/api/proto/fileinterface";
import {UploadFile, UploadFiles, UploadRequestOptions} from "element-plus";
import {UploadFileTypeText} from "@/config/common";
import CalendarConfirmDialog from "@/views/calendar/calendarConfirmDialog.vue";
import {Record} from "@icon-park/vue-next";

onMounted(() => {
  updateMonthBillData();
  userIsManager();
})

/* 管理员功能 选择人*/
const selectOwner = ref("")
const allOwners = ref<IFinanceBillAccount[]>([])
const curUserRole = ref("")

function userIsManager() {
  const roleObjStr = localStorage.getItem(localStorage_roleObj_label);
  if (roleObjStr) {
    const roleObj = JSON.parse(roleObjStr);
    curUserRole.value = roleObj.id
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
const formExtra = reactive<IFinanceBillExtra>({
  repayUnit: "", repayImages: []
})
/* ===== 表单内容 ===== */
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

// 以 2025-07-30 为 key 的对象
const eventMap = ref<Record<number, IFinanceBill>>({})
const activeDateRepayPointMap = ref<Record<number, boolean>>({})

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
    eventMap.value[item.timestamp] = item
    if (item.repayExpenses != 0) {
      activeDateRepayPointMap.value[item.timestamp] = true
    }
  })
}

function openModal(item: CalendarItem) {
  if (!item.inMonth) return
  //设置选中的日期
  selectedDateTimestamp.value = item.dateKey
  //从eventMap中获取数据到form中回显
  if (eventMap.value[item.dateKey] && eventMap.value[item.dateKey].extra) {
    const extraJson = JSON.parse(eventMap.value[item.dateKey].extra)
    formExtra.repayUnit = extraJson.repayUnit || ''
    formExtra.repayImages = extraJson.repayImages || []
    Object.assign(form, eventMap.value[item.dateKey])
  }
  modalVisible.value = true
}

function closeModal() {
  ObjClear(form)
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

async function save() {
  //设置当前日期时间戳
  // if (form.timestamp == 0) {
  form.timestamp = selectedDateTimestamp.value
  // }
  const formExtraJson = JSON.stringify(formExtra)
  if (form.billId != "") {
    const updateReq = {} as IUpdateFinanceBillReq
    Object.assign(updateReq, form)
    updateReq.extra = formExtraJson
    await updateFinanceBillInterface(updateReq)
  } else {
    const addReq = {} as IAddFinanceBillReq
    Object.assign(addReq, form)
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
  closeModal()
  ShowCommonMessage("保存成功", "success")
}
</script>

<style lang="scss" scoped>
@import "index";
</style>