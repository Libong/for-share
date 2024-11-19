<script lang="ts" setup>
import SearchIcon from "@/assets/search.svg"
import SearchRefresh from "@/assets/refresh.svg"
import AddIcon from "@/assets/add-icon.svg"
import UpArrowIcon from "@/assets/up-arrow.svg"
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {ISearchShoppingRecordsPageReq, IShoppingRecord, RecordType} from "@/views/record/index";
import Box from "@/views/record/components/box/box.vue";
import Form from "@/views/record/components/form/form.vue";
import {testData} from "@/views/record/components/form/form";
import {toSecondOrMilli} from "@/tool/tool";

onMounted(() => {
  search();
})
//数据
const pageCondition = reactive({
  total: 20,
  busy: false,
})
const recordType = ref(RecordType.Current)
const searchShoppingRecordsPageReq = reactive(<ISearchShoppingRecordsPageReq>{
  pageSize: 6,
  pageNum: 1,
  recordType: recordType.value,
})
const shoppingRecords = ref<IShoppingRecord[]>([])

async function search() {
  if (pageCondition.busy || (searchShoppingRecordsPageReq.pageNum * searchShoppingRecordsPageReq.pageSize >= pageCondition.total)) {
    return;
  }
  pageCondition.busy = true;
  // 模拟加载数据
  await refreshSearch();
  searchShoppingRecordsPageReq.pageNum += 1;
  pageCondition.busy = false;
}

async function refreshSearch() {
  // const recordsResp = await searchShoppingRecordsPageInterface(searchShoppingRecordsPageReq);
  // shoppingRecords.value = recordsResp.list;
  shoppingRecords.value = testData.slice();
}

let shoppingRecordObj = reactive(<IShoppingRecord>{
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

function openAddModelDisplay() {
  isAddFormType.value = true;
  showModel.value = !showModel.value;
}

function addRecordCallback() {
  //TODO 调接口
  console.log(shoppingRecordObj);
  shoppingRecordObj.overdueAt = Math.floor(shoppingRecordObj.overdueAt / 1000);
  shoppingRecordObj.buyAt = Math.floor(shoppingRecordObj.buyAt / 1000);
  shoppingRecordObj.produceAt = Math.floor(shoppingRecordObj.produceAt / 1000);
  shoppingRecords.value.push(shoppingRecordObj);
}

function deleteRecordById(recordId: string) {
  console.log("recordId", recordId);
  shoppingRecords.value = shoppingRecords.value.filter(record => record.recordId !== recordId);
}

function showUpdateRecordModel(data: IShoppingRecord) {
  data.overdueAt = toSecondOrMilli(data.overdueAt, false);
  data.buyAt = toSecondOrMilli(data.buyAt, false);
  data.produceAt = toSecondOrMilli(data.produceAt, false);
  data.establishAt = toSecondOrMilli(data.establishAt, false);
  shoppingRecordObj = data;
  console.log(data);
  shoppingRecordObj.goodsTypes = [{
    id: "1",
    name: "面包",
  }];
  isAddFormType.value = false;
  showModel.value = !showModel.value;
}

/*滑动条*/
const scrollableDivRef = ref<HTMLElement | null>(null);
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
  if (target.scrollHeight - target.scrollTop === target.clientHeight) {
    // 到达底部，调用接口更新数据
    // testRefreshRecords();
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
        <img :src="AddIcon" alt="" class="projects-tool-refresh" title="新增" @click="openAddModelDisplay">
        <img :src="SearchRefresh" alt="" class="projects-tool-refresh" title="刷新" @click="refreshSearch">
      </div>
      <div ref="scrollableDivRef" class="project-boxes jsGridView">
        <!--v-infinite-scroll="search" :infinite-scroll-disabled="pageCondition.busy"-->
        <!--        <div class="project-box-wrapper">-->
        <div v-for="item in shoppingRecords" :key="item.recordId" style="width: 33.3%;height: 267px">
          <box :data="item"
               @delete="deleteRecordById(item.recordId)"
               @update="showUpdateRecordModel"></box>
        </div>
        <!--        </div>-->
      </div>
      <div class="projects-back2Top" @click="scrollToTop">
        <img :src="UpArrowIcon" alt="" class="projects-back2Top-arrow">
        <span class="projects-back2Top-text">回到顶部</span>
      </div>
      <span class="projects-showMoreText">下拉加载更多</span>
    </div>
  </div>
  <Form
      :data=shoppingRecordObj
      :is-add-form="isAddFormType"
      :is-show="showModel"
      :select-goods-types="selectGoodsType"
      @addRecord="addRecordCallback"
      @update:isShow="showModel = $event"><!--子组件触发update:isShow事件后同步更新--></Form>
</template>

<style lang="scss" scoped>
@import "./index";
</style>