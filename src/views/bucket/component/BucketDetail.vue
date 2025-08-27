<template>
  <div class="bucket-detail">
    <div class="bucket-detail-header">
      <div class="bucket-detail-header-left">
        <button class="btn-back" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>{{ bucket.name }}</h2>
        <span :class="bucket.accessPolicy" class="bucket-type">
          {{ bucket.accessPolicy === BucketAccessPolicy.Publish ? '公开' : '私有' }}
        </span>
      </div>
      <div class="header-actions">
        <input ref="fileInput" style="display: none;" type="file" @change="handleFileUpload"/>
        <button class="btn-upload" @click="triggerFileUpload">
          <i class="fas fa-upload"></i> 上传
        </button>
        <button class="btn-new-folder">
          <i class="fas fa-folder-plus"></i> 新建文件夹
        </button>
      </div>
    </div>
    
    <div class="bucket-content">
      <div class="path-nav">
        <button class="path-item" @click="navigateTo([])">
          <i class="fas fa-home"></i>
        </button>
        <template v-for="(segment, index) in currentPath" :key="index">
          <i class="fas fa-chevron-right separator"></i>
          <button
              class="path-item"
              @click="navigateTo(currentPath.slice(0, index + 1))"
          >{{ segment }}
          </button>
        </template>
      </div>
      
      <div class="content-table">
        <table>
          <thead>
          <tr>
            <th>名称</th>
            <th>大小</th>
            <th>修改时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in objects" :key="index" :class="{ 'is-folder': item.isDir }"
              @click="handleItemClick(item)">
            <td class="name-cell">
              <i :class="getItemIcon(item)"></i>
              <span>{{ item.name }}</span>
            </td>
            <td>{{ formatSizeTransfer(item.size) }}</td>
            <td>{{ timestamp2DateStr(item.lastModifyAt) }}</td>
            <td class="actions-cell" @click.stop>
              <button v-if="!item.isDir" class="btn-action" title="下载">
                <i class="fas fa-download"></i>
              </button>
              <button class="btn-action" title="分享">
                <i class="fas fa-share-alt"></i>
              </button>
              <button class="btn-action" title="删除">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {
  browseBucketObjectsInterface,
  BucketAccessPolicy,
  bucketByIdInterface,
  IBucketByIdResp,
  IObject
} from "@/api/proto/bucketInterface";
import {formatSizeTransfer, timestamp2DateStr} from "@/views/bucket/component/bucketTool";
import {ShowCommonMessage} from "@/tool/message";

const props = defineProps<{
  bucketId: string
}>()

const router = useRouter()
const currentPath = ref<string[]>([])
const bucket = ref<IBucketByIdResp>({
  accessPolicy: 0, accessRule: "", bucketId: "", desc: "", establishAt: 0, list: [], name: "", objectCnt: 0, usage: 0
})
const fileInput = ref<HTMLInputElement | null>(null)

const objects = ref<IObject[]>([])

const rootPath = ref<string>('')

onMounted(async () => {
  const resp = await bucketByIdInterface({
    bucketId: props.bucketId
  })
  if (resp.name == "") {
    ShowCommonMessage('获取空间文件数据失败', "error")
    return
  }
  rootPath.value = resp.name
  //初始化根目录内容
  navigateTo([rootPath.value])
})

const pathSlice2Str = (path: string[]): string => {
  let pathStr = ""
  path.forEach(value => {
    pathStr = pathStr.concat(value)
    pathStr = pathStr.concat("/")
  })
  return pathStr
}
const loadObjects = async (path: string[]) => {
  const objectsResp = await browseBucketObjectsInterface({
    path: pathSlice2Str(path)
  })
  objects.value = objectsResp.list
}

//进入下层级目录
const navigateTo = (path: string[]) => {
  //设置当前目录
  currentPath.value = path
  //加载当前目录文件信息
  loadObjects(path)
}

const handleItemClick = (item: IObject) => {
  if (item.isDir) {
    const newPath = [...currentPath.value, item.name]
    navigateTo(newPath)
  }
}

const goBack = () => {
  if (currentPath.value.length > 1) {
    navigateTo(currentPath.value.slice(0, -1))
  } else {
    router.push('/main/buckets')
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  
  const file = files[0]
  
  try {
    // 实际的API调用
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', currentPath.value.join('/'))
    
    // TODO: 调用实际的上传API
    // const response = await api.uploadFile(props.bucketId, formData)
    // await loadContent(currentPath.value)
    
    ShowCommonMessage(`文件 "${file.name}" 上传成功`, "success")
  } catch (error) {
    ShowCommonMessage('文件上传失败', "error")
  }
}

const getItemIcon = (item: IObject) => {
  if (item.isDir) return 'fas fa-folder'
  
  // 根据文件类型返回不同图标
  const iconMap: Record<string, string> = {
    pdf: 'fas fa-file-pdf',
    doc: 'fas fa-file-word',
    docx: 'fas fa-file-word',
    xls: 'fas fa-file-excel',
    xlsx: 'fas fa-file-excel',
    jpg: 'fas fa-file-image',
    jpeg: 'fas fa-file-image',
    png: 'fas fa-file-image',
    mp4: 'fas fa-file-video',
    mp3: 'fas fa-file-audio'
  }
  
  const ext = item.name.split('.').pop() || ''
  return iconMap[ext] || 'fas fa-file'
}
</script>

<style scoped>
.bucket-detail {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.bucket-detail-header {
  margin-bottom: 0.5rem;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

.bucket-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.path-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.5rem;
}

.content-table {
  flex: 1;
  background: white;
  border-radius: 0.5rem;
  overflow: auto;
}

.btn-back {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.btn-back:hover {
  color: var(--primary-color);
}

.bucket-type {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.bucket-type.public {
  background: #e3f2fd;
  color: #1976d2;
}

.bucket-type.private {
  background: #fafafa;
  color: #616161;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.header-actions button {
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-upload {
  background: var(--primary-color);
  color: white;
}

.btn-upload:hover {
  background: var(--secondary-color);
}

.btn-new-folder {
  background: #f5f5f5;
  color: var(--text-color);
}

.btn-new-folder:hover {
  background: #e0e0e0;
}

.path-item {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-color);
  transition: color 0.3s;
}

.path-item:hover {
  color: var(--primary-color);
}

.separator {
  color: var(--text-light);
  font-size: 0.8rem;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.name-cell i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.actions-cell {
  display: flex;
  gap: 1rem;
}

.btn-action {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  color: var(--primary-color);
  transform: scale(1.1);
}

tr.is-folder {
  cursor: pointer;
}

tr.is-folder:hover {
  background: rgba(92, 107, 192, 0.05);
}

/* 确保表格内容正确对齐 */
th, td {
  padding: 0.8rem 1rem;
  text-align: left;
}

th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 500;
  color: var(--text-color);
}

/* 确保表格列宽合理分配 */
table {
  width: 100%;
  border-collapse: collapse;
}

td:nth-child(1) {
  width: 40%;
}

/* 名称列 */
td:nth-child(2) {
  width: 15%;
}

/* 大小列 */
td:nth-child(3) {
  width: 25%;
}

/* 修改时间列 */
td:nth-child(4) {
  width: 20%;
}

/* 操作列 */
</style>