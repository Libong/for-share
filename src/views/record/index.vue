<script lang="ts" setup>
import SearchIcon from "@/assets/search.svg"
import SearchRefresh from "@/assets/refresh.svg"
import AddIcon from "@/assets/add-icon.svg"
import UpArrowIcon from "@/assets/up-arrow.svg"
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {
  addRecordInterface,
  deleteRecordInterface,
  IRecord,
  ISearchRecordsPageReq,
  IUpdateRecordReq,
  RecordType,
  searchRecordsPageInterface,
  updateRecordInterface
} from "@/api/proto/recordinterface";
import Form from "@/views/record/components/form/form.vue";
import {ObjClear, toSecondOrMilli} from "@/tool/tool";
import {ElMessage} from "element-plus";
import WaitPoint from "@/components/common/waitPoint/waitPoint.vue";
import CustomConfirmDialog from "@/components/common/confirm/CustomConfirmDialog.vue";
import Card from "@/components/common/card/card.vue";
import Box from "@/views/record/components/box/box.vue";
import TestBG from "@/assets/record-bg/milaotou.jpeg"

onMounted(() => {
  refreshSearch();
})
//数据
let defaultRecordObj = reactive(<IRecord>{
  establishAt: 0, //创建时间
  produceAt: 0, //生产日期
  overdueAt: 0, //过期时间
  buyAt: 0, //购买日期
  goodsName: "", //物品名称
  goodsTypes: [], //物品标签
  recordId: "", //记录编号
})

const pageCondition = reactive({
  total: 0,
})
const recordType = ref(RecordType.Current)
const searchRecordsPageReq = reactive(<ISearchRecordsPageReq>{
  pageSize: 6,
  pageNum: 0,
  recordType: recordType.value,
})
const shoppingRecords = ref<IRecord[]>([])

function showMessage(msg: string) {
  ElMessage({
    message: msg,
    type: "success",
    plain: true,
    customClass: "global-message",
    duration: 1000
  });
}

async function searchMore() {
  // if ((searchRecordsPageReq.pageNum * searchRecordsPageReq.pageSize >= pageCondition.total)) {
  //   return;
  // }
  searchRecordsPageReq.pageNum++;
  const recordsResp = await searchRecordsPageInterface(searchRecordsPageReq);
  shoppingRecords.value.push(...recordsResp.list);
}

async function refreshSearch() {
  searchRecordsPageReq.pageNum = 1;
  const recordsResp = await searchRecordsPageInterface(searchRecordsPageReq);
  //TODO 很抽象不能进行recordsResp.list的undefined判断
  // if (recordsResp.list === undefined) {
  //
  // }
  shoppingRecords.value = recordsResp.list || [];
  pageCondition.total = recordsResp.total;
  if (shoppingRecords.value.length < 6) {
    while (shoppingRecords.value.length != 6) {
      shoppingRecords.value.push(defaultRecordObj);
    }
  }
}

let shoppingRecordObj = reactive(<IRecord>{
  establishAt: 0, //创建时间
  produceAt: 0, //生产日期
  overdueAt: 0, //过期时间
  buyAt: 0, //购买日期
  goodsName: "", //物品名称
  goodsTypes: [], //物品标签
  recordId: "", //记录编号
})
const selectGoodsType = reactive([
  {"id": "1", "name": "面包"},
  {"id": "2", "name": "饮料"},
  {"id": "3", "name": "巧克力"},
  {"id": "4", "name": "豆制品"},
])


const showModel = ref(false);
const isAddFormType = ref(true);

function showAddModel() {
  isAddFormType.value = true;
  showModel.value = !showModel.value;
}

function showUpdateRecordModel(data: IRecord) {
  Object.assign(shoppingRecordObj, data);
  shoppingRecordObj.overdueAt = toSecondOrMilli(shoppingRecordObj.overdueAt, false);
  shoppingRecordObj.buyAt = toSecondOrMilli(shoppingRecordObj.buyAt, false);
  shoppingRecordObj.produceAt = toSecondOrMilli(shoppingRecordObj.produceAt, false);
  shoppingRecordObj.establishAt = toSecondOrMilli(shoppingRecordObj.establishAt, false);
  isAddFormType.value = false;
  showModel.value = !showModel.value;
}

async function addRecordCallback(callback: () => void) {
  let categoryIds: string[] = [];
  shoppingRecordObj.goodsTypes.forEach((item) => {
    categoryIds.push(item.id);
  });

  await addRecordInterface({
    buyAt: toSecondOrMilli(shoppingRecordObj.buyAt, true),
    categoryIds: categoryIds,
    goodsName: shoppingRecordObj.goodsName,
    overdueAt: toSecondOrMilli(shoppingRecordObj.overdueAt, true),
    produceAt: toSecondOrMilli(shoppingRecordObj.produceAt, true),
  });
  showMessage("记录成功");
  callback();
  ObjClear(shoppingRecordObj);
  await refreshSearch();
}

async function updateRecordCallback(callback: () => void) {
  const req = {} as IUpdateRecordReq;
  Object.assign(req, shoppingRecordObj);
  let categoryIds: string[] = [];
  shoppingRecordObj.goodsTypes.forEach((item) => {
    categoryIds.push(item.id);
  });
  req.overdueAt = toSecondOrMilli(req.overdueAt, true);
  req.buyAt = toSecondOrMilli(req.buyAt, true);
  req.produceAt = toSecondOrMilli(req.produceAt, true);
  req.categoryIds = categoryIds;
  await updateRecordInterface(req);
  showMessage("修改成功");
  callback();
  ObjClear(shoppingRecordObj);
  await refreshSearch();
}

const confirmDialogParam = reactive({
  message: "",
  enable: false,
  title: "",
  id: ""
});

async function showDeleteConfirmDialog(recordId: string) {
  //打开删除确认框
  confirmDialogParam.enable = true;
  confirmDialogParam.message = "";
  confirmDialogParam.title = "确认要删除该记录吗？";
  confirmDialogParam.id = recordId;
}

async function confirmDialogCanceled() {
  ObjClear(confirmDialogParam);
}

async function confirmDialogConfirmed() {
  await deleteRecordInterface({
    recordId: confirmDialogParam.id,
  });
  showMessage("删除成功");
  await refreshSearch();
}

/*滑动条*/
const scrollableDivRef = ref<HTMLElement | null>(null);
const hasMoreText = ref("下拉加载更多")
const hasMoreIcon = ref(true);
const hasScrollToTopText = ref(false);
//回到顶部
const scrollToTop = () => {
  if (scrollableDivRef.value) {
    scrollableDivRef.value.scrollTop = 0;
  }
};
onMounted(() => {
  if (scrollableDivRef.value) {
    scrollableDivRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (scrollableDivRef.value) {
    scrollableDivRef.value.removeEventListener('scroll', handleScroll);
  }
});
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  hasMoreText.value = "下拉加载更多";
  hasMoreIcon.value = true;
  hasScrollToTopText.value = target.scrollTop > target.clientHeight;
  if (target.scrollHeight - target.scrollTop - target.clientHeight < 1) {
    // 到达底部，调用接口更新数据
    if (shoppingRecords.value.length == pageCondition.total) {
      hasMoreText.value = "没有更多数据了～";
      hasMoreIcon.value = false;
      return;
    } else {
      searchMore();
    }
  }
};
</script>

<template>
  <div class="record-content">
    <div class="search-wrapper">
      <input class="search-input" placeholder="Search" type="text">
      <img :src="SearchIcon" alt="">
    </div>
    <div class="projects-section">
      <div class="projects-tool">
        <img :src="AddIcon" alt="" class="projects-tool-refresh" title="新增" @click="showAddModel">
        <img :src="SearchRefresh" alt="" class="projects-tool-refresh" title="刷新" @click="refreshSearch">
      </div>
      <div ref="scrollableDivRef" class="project-boxes jsGridView">
        <div v-for="item in shoppingRecords" :key="item.recordId" style="width: 33.3%;height: 267px">
          <card
              :data-image="TestBG">
            <template #content>
              <box :data="item"
                   @delete="showDeleteConfirmDialog(item.recordId)"
                   @update="showUpdateRecordModel"></box>
            </template>
          </card>

        </div>
      </div>
      <div v-show="hasScrollToTopText" class="projects-back2Top" @click="scrollToTop">
        <img :src="UpArrowIcon" alt="" class="projects-back2Top-arrow">
        <span class="projects-back2Top-text">回到顶部</span>
      </div>
      <div class="projects-searchMore">
        <span>{{ hasMoreText }}</span>
        <wait-point v-if="hasMoreIcon">
        </wait-point>
      </div>
    </div>
  </div>
  <Form
      :data=shoppingRecordObj
      :is-add-form="isAddFormType"
      :is-show="showModel"
      :select-goods-types="selectGoodsType"
      @addRecord="addRecordCallback"
      @updateRecord="updateRecordCallback"
      @update:isShow="showModel = $event"><!--子组件触发update:isShow事件后同步更新--></Form>
  <CustomConfirmDialog
      :enable="confirmDialogParam.enable"
      :message="confirmDialogParam.message"
      :title="confirmDialogParam.title"
      @cancel="confirmDialogCanceled"
      @confirm="confirmDialogConfirmed"></CustomConfirmDialog>
</template>

<style lang="scss" scoped>
@import "./index";
</style>