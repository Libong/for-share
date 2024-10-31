<script lang="ts" setup>
import SearchIcon from "@/assets/search.svg"
import SearchRefresh from "@/assets/refresh.svg"
import AddIcon from "@/assets/add-icon.svg"
import {onMounted, reactive, ref} from "vue";
import {ISearchShoppingRecordsPageReq, IShoppingRecord, RecordType} from "@/views/record/index";
import Box from "@/views/record/components/box/box.vue";
import Form from "@/views/record/components/form/form.vue";
import {testData} from "@/views/record/components/form/form";

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
  shoppingRecords.value = testData;
}

const addShoppingRecordReq = reactive(<IShoppingRecord>{
  establishAt: null, //创建时间
  produceAt: null, //生产日期
  overdueAt: null, //过期时间
  buyAt: null, //购买日期
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


const showAddModel = ref(true);

function openAddModelDisplay() {
  showAddModel.value = !showAddModel.value;
}

function addRecordCallback() {
  shoppingRecords.value.push(addShoppingRecordReq);
}
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
      <div class="project-boxes jsGridView">
        <!--v-infinite-scroll="search" :infinite-scroll-disabled="pageCondition.busy"-->
        <!--        <div class="project-box-wrapper">-->
        <div v-for="item in shoppingRecords" :key="item.recordId" style="width: 33.3%">
          <box :data="item"></box>
        </div>
        <!--        </div>-->
      </div>
    </div>
  </div>
  <Form
      :data=addShoppingRecordReq
      :is-show="showAddModel"
      :select-goods-types="selectGoodsType"
      @addRecord="addRecordCallback"
      @update:isShow="showAddModel = $event"><!--子组件触发update:isShow事件后同步更新--></Form>
</template>

<style lang="scss" scoped>
@import "./index";
</style>