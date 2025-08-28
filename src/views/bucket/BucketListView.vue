<template>
  <div class="bucket-list">
    <div class="bucket-header">
      <div class="header-left">
        <span>Storage Space</span>
        <button class="btn-refresh" title="刷新" @click="refreshBuckets(true)">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div class="header-logo">
        <img :src="IMAGES.logo" alt="Anime Cloud"/>
        <span>Reborn Cloud</span>
      </div>
      <button class="btn-create" @click="openCreateDialog">
        <i class="fas fa-plus"></i> 新建存储空间
      </button>
    </div>
    <DataNotFound v-if="buckets.length == 0"/>
    <div v-if="buckets.length != 0" class="buckets-grid">
      <div v-for="bucket in buckets"
           :key="bucket.bucketId"
           :class="{ 'public': bucket.accessPolicy === BucketAccessPolicy.Publish }"
           class="bucket-card">
        <div class="bucket-icon">
          <i class="fas fa-folder-open"></i>
          <span :title="bucket.accessPolicy === BucketAccessPolicy.Publish ? '公开访问' : '私有空间'"
                class="bucket-type">
                    <i v-if="bucket.accessPolicy === BucketAccessPolicy.Publish" class="fas fa-users"></i>
                    <i v-else class="fas fa-shield-alt"></i>
                  </span>
        </div>
        <div class="bucket-info">
          <span class="bucket-name">{{ bucket.name }}</span>
          <span class="bucket-desc">{{ bucket.desc }}</span>
          <div class="bucket-stats">
            <span><i class="fas fa-database"></i> {{ bucket.usage ? formatSizeTransfer(bucket.usage) : 0 }}</span>
            <span><i class="fas fa-folder"></i> {{ 0 }}</span>
            <span><i class="fas fa-file"></i> {{ bucket.objectCnt ? bucket.objectCnt : 0 }}</span>
          </div>
          <div class="bucket-dates">
            <span>创建于: {{ timestamp2DateStr(bucket.establishAt) }}</span>
            <span>最后修改: {{ bucket.lastModifiedAt ? timestamp2DateStr(bucket.lastModifiedAt) : "" }}</span>
          </div>
        </div>
        <div class="bucket-actions">
          <div class="secondary-actions">
            <button class="btn-settings" title="设置" @click="openSettings(bucket.bucketId)">
              <i class="fas fa-cog"></i>
            </button>
            <button class="btn-delete" title="删除" @click="deleteBucket(bucket.bucketId,bucket.name)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <button class="btn-enter" title="进入存储空间" @click="enterBucket(bucket.bucketId)">
            <i class="fas fa-sign-in-alt"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加创建对话框 -->
    <CreateBucketDialog
        v-model:visible="createDialogVisible"
        @add="handleBucketAdd"
    />
    
    <!-- 添加确认对话框 -->
    <ConfirmDialog
        v-model:visible="confirmDialogParam.visible"
        :message="confirmDialogParam.message"
        :title="confirmDialogParam.title"
        :type="confirmDialogParam.type"
        @cancel="cancelCallback"
        @confirm="confirmCallback"
    />
    
    <BucketSettingsDialog
        v-if="updateBucketData"
        v-model:visible="settingsDialogVisible"
        :bucket="updateBucketData"
        @updated="handleBucketUpdated"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import CreateBucketDialog from './component/CreateBucketDialog.vue'
import BucketSettingsDialog from './component/BucketSettingsDialog.vue'
import ConfirmDialog, {IConfirmDialogParam} from '@/views/bucket/component/ConfirmDialog.vue'
import {useRouter} from 'vue-router'
import {
  addBucketInterface,
  BucketAccessPolicy,
  bucketByIdInterface,
  deleteBucketInterface,
  IAddBucketReq,
  IBucket,
  IBucketByIdResp,
  searchBucketsPageInterface,
  updateBucketInterface
} from "@/api/proto/bucketInterface";
import {ShowCommonMessage} from "@/tool/message";
import {IMAGES} from "@/assets/avatarDefaultImages";
import {formatSizeTransfer, timestamp2DateStr} from "./component/bucketTool";
import DataNotFound from "@/views/bucket/component/DataNotFound.vue";

onMounted(() => {
  refreshBuckets();
})
//列表数据
const buckets = ref<IBucket[]>([])
//新增和修改的模态框
const createDialogVisible = ref(false)
const settingsDialogVisible = ref(false)
//是否打开确认框
const defaultConfirmDialogParam: IConfirmDialogParam = {
  title: "",
  message: "",
  visible: false,
  type: "info"
}
const confirmDialogParam = ref<IConfirmDialogParam>(defaultConfirmDialogParam)

const updateBucketData = ref<IBucketByIdResp>({
  accessPolicy: 0, accessRule: "", bucketId: "", desc: "", establishAt: 0, list: [], name: "", objectCnt: 0, usage: 0
})
const deleteBucketId = ref<string>('')

const router = useRouter()

const openCreateDialog = () => {
  createDialogVisible.value = true
}

// TODO: 进入 bucket 时需要获取该 bucket 的详细信息和权限
const enterBucket = async (id: string) => {
  try {
    router.push({path: `/main/buckets/${id}`})
  } catch (error) {
    ShowCommonMessage('进入存储空间失败', "error")
  }
}

const openSettings = async (id: string) => {
  updateBucketData.value = await bucketByIdInterface({bucketId: id})
  settingsDialogVisible.value = true
}

const handleBucketUpdated = (callback: () => void) => {
  if (confirmDialogParam.value.visible) return // 如果正在确认中，不处理新的更新
  confirmDialogParam.value.message = "确定要保存更改吗？"
  confirmDialogParam.value.title = "更新设置"
  confirmDialogParam.value.visible = true
  const stopWatch = watch(confirmDialogParam, () => {
        if (!confirmDialogParam.value.visible) {
          // 执行回调函数
          callback()
          // 取消监听
          stopWatch()
        }
      }, {deep: true} // 深度监听
  )
}
const handleBucketAdd = async (data: IAddBucketReq, callback: () => void) => {
  await addBucketInterface(data);
  callback();
  refreshBuckets();
}


const resetConfirmDialogParam = () => {
  confirmDialogParam.value = {...defaultConfirmDialogParam}
}
const cancelCallback = async () => {
  resetConfirmDialogParam()
  ShowCommonMessage('更新已取消', "info")
}
const confirmCallback = async () => {
  if (deleteBucketId.value != "") {
    try {
      await deleteBucketInterface({
        bucketId: deleteBucketId.value,
      })
      ShowCommonMessage('删除成功', "success")
    } catch (error) {
      ShowCommonMessage('删除失败', "warning")
    } finally {
      resetConfirmDialogParam()
      await refreshBuckets();
    }
  } else {
    try {
      await updateBucketInterface({
        accessPolicy: updateBucketData.value.accessPolicy,
        accessRule: updateBucketData.value.accessRule,
        bucketAccounts: updateBucketData.value.list,
        bucketId: updateBucketData.value.bucketId,
        desc: updateBucketData.value.desc
      });
      settingsDialogVisible.value = false
      ShowCommonMessage('更新成功', "success")
      // } catch (error) {
      //   ShowCommonMessage(error,"error")
    } finally {
      resetConfirmDialogParam()
      await refreshBuckets();
    }
  }
}

// 删除相关方法
const deleteBucket = (id: string, name: string) => {
  deleteBucketId.value = id
  confirmDialogParam.value.message = `确定要删除存储空间 "${name}" 吗？此操作不可恢复,并且会删除所有子文件和文件夹内容`
  confirmDialogParam.value.title = "删除存储空间"
  confirmDialogParam.value.visible = true
}
const refreshBuckets = async (needNotice?: boolean) => {
  let resp = await searchBucketsPageInterface({});
  buckets.value = [];
  if (!resp.list) {
    return
  }
  resp.list.forEach((bucket) => {
    buckets.value.push({
      establishAt: bucket.establishAt,
      objectCnt: bucket.objectCnt,
      bucketId: bucket.bucketId,
      lastModifiedAt: bucket.lastModifiedAt,
      name: bucket.name,
      usage: bucket.usage,
      desc: bucket.desc,
      accessPolicy: bucket.accessPolicy
    })
  })
  if (needNotice) {
    ShowCommonMessage('刷新成功', "success")
  }
}
</script>

<style lang="scss" scoped>
@import "@/views/bucket/component/commonColor";

.bucket-list {
  background: #fff;
  //background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 0.3rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 98%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1200px;
}

.bucket-header {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 15%;
  overflow-y: hidden;
}

.bucket-header h2 {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
}

.btn-create {
  background: $primary-color;
  color: white;
  border: none;
  padding: 0.4rem 0.7rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-create:hover {
  background: $secondary-color;
}

.buckets-grid {
  display: grid;
  grid-template-rows: repeat(2, 46%);
  grid-template-columns: repeat(3, 31%); /* 略微减小列宽，留出边距 */
  gap: 4% 3.5%; /* 垂直间距2%，水平间距3.5% */
  height: 85%; /* 减去header的高度 */
  align-content: start;
  margin: 0 auto; /* 居中对齐 */
  width: 100%;
}

.bucket-card {
  background: white;
  border-radius: 0.6rem;
  padding: 0.4rem 0.8rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  //aspect-ratio: 3/2; /* 更合适的宽高比 */
  height: 100%;
}

.bucket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.bucket-icon {
  height: 20%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.5rem;
  
  .bucket-type {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.3rem;
    box-shadow: 0 2px 6px rgba(92, 107, 192, 0.2);
    transition: transform 0.3s;
  }
  
  .bucket-type:hover {
    transform: scale(1.1);
  }
}

.bucket-info {
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .bucket-name {
    font-weight: bold;
    font-family: "阿里妈妈方圆体 VF Regular", serif;
  }
  
  span {
    font-size: 0.4rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .bucket-desc {
    font-size: 0.3rem;
    min-height: 0.7rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: $text-light;
    
    display: flex;
    align-items: center;
    text-align: center; /* 如果需要水平居中 */
  }
  
  .bucket-stats {
    height: 30%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem 0.5rem;
    align-items: center;
    color: $text-light;
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }
  
  .bucket-dates {
    span {
      font-size: 0.3rem;
    }
    
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    color: $text-color;
  }
}

.bucket-actions {
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}

.secondary-actions {
  display: flex;
  gap: 0.3rem;
}

.bucket-actions button {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.4rem;
}

.btn-enter {
  color: $primary-color;
}

.btn-enter:hover {
  color: $secondary-color;
  transform: translateX(2px);
}

.btn-settings {
  color: $text-light;
}

.btn-settings:hover {
  color: $primary-color;
  transform: rotate(30deg);
}

.btn-delete {
  color: $text-light;
}

.btn-delete:hover {
  color: #ff5252;
  transform: scale(1.1);
}

.public {
  background: linear-gradient(135deg, rgba(92, 107, 192, 0.1), rgba(92, 107, 192, 0.05));
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .buckets-grid {
    grid-template-columns: repeat(2, 47%); /* 两列时调整宽度和间距 */
    //gap: 2% 6%;
  }
}

@media (max-height: 450px) {
  .buckets-grid {
    grid-template-rows: repeat(1, 90%);
  }
}

@media (max-width: 768px) {
  .buckets-grid {
    grid-template-columns: 90%; /* 单列时占90% */
    justify-content: center;
    gap: 1rem;
  }
  
  //.bucket-card {
  //  aspect-ratio: 2/1; /* 在移动端调整宽高比 */
  //}
}

.header-left {
  display: flex;
  align-items: center;
  
  span {
    font-size: 0.8rem;
    font-family: "阿里妈妈方圆体 VF Regular";
    font-weight: bold;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 1rem;
  backdrop-filter: blur(10px);
  
  img {
    height: 40px;
  }
  
  span {
    font-size: 0.5rem;
    color: #5c6bc0;
    font-weight: bold;
    font-family: "阿里妈妈方圆体 VF Regular";
  }
}

.btn-refresh {
  background: none;
  border: none;
  color: $text-light;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.5rem;
  transition: all 0.3s;
}

.btn-refresh:hover {
  color: $primary-color;
  transform: rotate(180deg);
}
</style>