<script lang="ts" setup>
import SearchIcon from "@/assets/search.svg"
import SearchRefresh from "@/assets/refresh.svg"
import AddIcon from "@/assets/add-icon.svg"
import {onMounted, reactive, ref} from "vue";
import {ISearchRecord, ISearchShoppingRecordsPageReq, RecordType} from "@/views/record/index";
import Box from "@/views/record/components/box/box.vue";

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
const shoppingRecords = ref<ISearchRecord[]>([])

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
  shoppingRecords.value = [{
    establishAt: 1726578156,
    produceAt: 1727971200, //生产日期
    overdueAt: 1728316800, //过期时间
    buyAt: 1728028800, //购买日期
    goodsName: "碧翠园厚切牛乳吐司", //物品名称
    goodsTypes: [{
      id: "1",
      name: "面包",
    }], //物品标签
    recordId: "1", //记录编号
  }, {
    establishAt: 1726578156,
    produceAt: 1726578156, //生产日期
    overdueAt: 1726578156, //过期时间
    buyAt: 1726578156, //购买日期
    goodsName: "碧翠园厚切牛乳吐司", //物品名称
    goodsTypes: [{
      id: "1",
      name: "面包",
    }], //物品标签
    recordId: "2", //记录编号
  }, {
    establishAt: 1726578156,
    produceAt: 1726578156, //生产日期
    overdueAt: 1726578156, //过期时间
    buyAt: 1726578156, //购买日期
    goodsName: "碧翠园厚切牛乳吐司", //物品名称
    goodsTypes: [{
      id: "1",
      name: "面包",
    }], //物品标签
    recordId: "3", //记录编号
  }, {
    establishAt: 1728138765,
    produceAt: 1728138765, //生产日期
    overdueAt: 1728138765, //过期时间
    buyAt: 1728138765, //购买日期
    goodsName: "碧翠园厚切牛乳吐司", //物品名称
    goodsTypes: [{
      id: "1",
      name: "面包",
    }], //物品标签
    recordId: "4", //记录编号
  }, {
    establishAt: 1728138765,
    produceAt: 1728138765, //生产日期
    overdueAt: 1728138765, //过期时间
    buyAt: 1728138765, //购买日期
    goodsName: "碧翠园厚切牛乳吐司", //物品名称
    goodsTypes: [{
      id: "1",
      name: "面包",
    }], //物品标签
    recordId: "5", //记录编号
  }, {
    establishAt: 1728138765,
    produceAt: 1728138765, //生产日期
    overdueAt: 1728138765, //过期时间
    buyAt: 1728138765, //购买日期
    goodsName: "碧翠园厚切牛乳吐司", //物品名称
    goodsTypes: [{
      id: "1",
      name: "面包",
    }], //物品标签
    recordId: "6", //记录编号
  }]
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
        <img :src="AddIcon" alt="" class="projects-tool-refresh" title="新增" @click="">
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
</template>

<style lang="scss" scoped>
@import "./index";
</style>