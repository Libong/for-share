<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElDialog, ElTable, ElTableColumn } from 'element-plus';

// --- 类型定义 ---
type StatType = 'daily' | 'weekly' | 'monthly';

interface ProductDetail {
  name: string;
  user: string;
  time: string;
}

// --- 状态管理 ---
const currentType = ref<StatType>('daily');
const accessChartRef = ref<HTMLElement | null>(null);
const productAddChartRef = ref<HTMLElement | null>(null);
const favorChartRef = ref<HTMLElement | null>(null);

let accessChart: echarts.ECharts | null = null;
let productAddChart: echarts.ECharts | null = null;
let favorChart: echarts.ECharts | null = null;

// 详情弹窗
const detailVisible = ref(false);
const detailTitle = ref('');
const currentDetails = ref<ProductDetail[]>([]);

// --- 模拟数据 ---
const accessData = {
  daily: {
    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    ips: [120, 132, 101, 134, 90, 230],
    counts: [220, 182, 191, 234, 290, 330],
    users: ['张三', '李四', '王五', '赵六', '孙七', '周八']
  },
  weekly: {
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    ips: [420, 532, 601, 434, 790, 830, 910],
    counts: [820, 932, 901, 934, 1290, 1330, 1320],
    users: ['UserA', 'UserB', 'UserC', 'UserD', 'UserE', 'UserF', 'UserG']
  },
  monthly: {
    categories: ['第一周', '第二周', '第三周', '第四周'],
    ips: [2200, 2832, 2101, 2534],
    counts: [4820, 5932, 4901, 5934],
    users: ['Admin', 'Sora', 'Miku', 'Kaito']
  }
};

const productAddData = {
  daily: {
    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    values: [5, 2, 12, 25, 18, 10],
    details: [
      [{name: '可乐', user: 'Admin', time: '00:15'}],
      [{name: '面包', user: 'Staff1', time: '04:20'}],
      [{name: '笔记本', user: 'UserB', time: '08:45'}, {name: '鼠标', user: 'UserC', time: '09:10'}],
      [{name: '手机', user: 'Admin', time: '12:30'}, {name: '耳机', user: 'UserA', time: '13:00'}],
      [{name: '键盘', user: 'UserD', time: '16:15'}],
      [{name: '显示器', user: 'Staff2', time: '20:05'}]
    ]
  },
  weekly: {
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [45, 52, 68, 43, 79, 110, 95],
    details: Array(7).fill([{name: '批量导入商品', user: 'System', time: '10:00'}])
  },
  monthly: {
    categories: ['1月', '2月', '3月', '4月'],
    values: [420, 532, 601, 484],
    details: Array(4).fill([{name: '月度新增合集', user: 'Manager', time: 'End of Week'}])
  }
};

const favorData = {
  products: ['机械键盘', '曲面屏', '游戏主机', '无线耳机', '人体工学椅', '数位板'],
  levels: [95, 88, 82, 75, 68, 55]
};

// --- 图表初始化函数 ---

const initAccessChart = () => {
  if (!accessChartRef.value) return;
  if (accessChart) accessChart.dispose();
  accessChart = echarts.init(accessChartRef.value);
  const data = accessData[currentType.value];
  const option = {
    title: { text: '流量态势分析', textStyle: { color: '#6c5ce7', fontSize: 16 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['访问IP', '访问次数'], bottom: 0 },
    xAxis: { type: 'category', data: data.categories },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      { name: '访问IP', type: 'bar', data: data.ips, itemStyle: { color: '#74b9ff' } },
      { name: '访问次数', type: 'line', smooth: true, data: data.counts, itemStyle: { color: '#6c5ce7' } }
    ]
  };
  accessChart.setOption(option);
};

const initProductAddChart = () => {
  if (!productAddChartRef.value) return;
  if (productAddChart) productAddChart.dispose();
  productAddChart = echarts.init(productAddChartRef.value);
  const data = productAddData[currentType.value];
  const option = {
    title: { text: '商品新增趋势 (点击查看详情)', textStyle: { color: '#6c5ce7', fontSize: 16 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} 个' },
    xAxis: { type: 'category', data: data.categories },
    yAxis: { type: 'value' },
    series: [{
      data: data.values,
      type: 'line',
      step: false,
      symbol: 'diamond',
      symbolSize: 12,
      itemStyle: { color: '#ff7675' },
      areaStyle: { color: 'rgba(255, 118, 117, 0.1)' }
    }]
  };
  productAddChart.setOption(option);

  productAddChart.on('click', (params: any) => {
    const index = params.dataIndex;
    const timeName = data.categories[index];
    detailTitle.value = `${timeName} 新增商品详情`;
    currentDetails.value = data.details[index] || [];
    detailVisible.value = true;
  });
};

const initFavorChart = () => {
  if (!favorChartRef.value) return;
  if (favorChart) favorChart.dispose();
  favorChart = echarts.init(favorChartRef.value);
  const option = {
    title: { text: '商品收藏热度排名', textStyle: { color: '#6c5ce7', fontSize: 16 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: favorData.products },
    yAxis: { type: 'value', max: 100 },
    series: [{
      name: '收藏度',
      type: 'line',
      step: 'middle',
      data: favorData.levels,
      itemStyle: { color: '#fab1a0' },
      lineStyle: { width: 4 },
      areaStyle: { color: 'rgba(250, 177, 160, 0.2)' }
    }]
  };
  favorChart.setOption(option);
};

const handleResize = () => {
  accessChart?.resize();
  productAddChart?.resize();
  favorChart?.resize();
};

onMounted(() => {
  initAccessChart();
  initProductAddChart();
  initFavorChart();
  window.addEventListener('resize', handleResize);
});

watch(currentType, () => {
  initAccessChart();
  initProductAddChart();
});

</script>

<template>
  <div class="stats-container">
    <div class="stats-grid">
      <!-- 流量统计卡片 -->
      <div class="anime-card chart-main-card">
        <div class="header">
          <h2 class="title">数据看板 <span>General Overview</span></h2>
          <div class="filter-group">
            <button 
              v-for="type in (['daily', 'weekly', 'monthly'] as StatType[])" 
              :key="type"
              :class="['filter-btn', { active: currentType === type }]"
              @click="currentType = type"
            >
              {{ type === 'daily' ? '当日' : type === 'weekly' ? '当周' : '当月' }}
            </button>
          </div>
        </div>
        <div class="chart-wrapper">
          <div ref="accessChartRef" class="chart-div"></div>
        </div>
      </div>

      <!-- 商品新增趋势卡片 -->
      <div class="anime-card">
        <div class="chart-wrapper">
          <div ref="productAddChartRef" class="chart-div"></div>
        </div>
      </div>

      <!-- 商品收藏度卡片 -->
      <div class="anime-card">
        <div class="chart-wrapper">
          <div ref="favorChartRef" class="chart-div"></div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="detailTitle" width="500px" custom-class="anime-dialog">
      <el-table :data="currentDetails" style="width: 100%">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="user" label="操作用户" width="120" />
        <el-table-column prop="time" label="操作时间" width="100" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <button class="filter-btn active" @click="detailVisible = false">确认</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap');

.stats-container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6e6fa 100%);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-main-card {
  grid-column: span 2;
}

.anime-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(162, 155, 254, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #6c5ce7;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title {
    font-family: 'ZCOOL KuaiLe', cursive;
    color: #2d3436;
    font-size: 24px;
    margin: 0;
    display: flex;
    flex-direction: column;

    span {
      font-size: 12px;
      color: #b2bec3;
      letter-spacing: 1px;
      margin-top: 2px;
      font-family: sans-serif;
    }
  }
}

.filter-group {
  display: flex;
  gap: 8px;

  .filter-btn {
    padding: 6px 14px;
    border-radius: 10px;
    border: 1px solid #dfe6e9;
    background: #fff;
    color: #636e72;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;

    &:hover {
      background: #f8f9fa;
      color: #6c5ce7;
    }

    &.active {
      background: #6c5ce7;
      border-color: #6c5ce7;
      color: #fff;
    }
  }
}

.chart-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #f1f2f6;
}

.chart-div {
  width: 100%;
  height: 300px;
}

.chart-main-card .chart-div {
  height: 400px;
}

:deep(.anime-dialog) {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #a29bfe;
  .el-dialog__header {
    background: #f8f9ff;
    margin-right: 0;
    padding-bottom: 15px;
  }
  .el-dialog__title {
    font-family: 'ZCOOL KuaiLe', cursive;
    color: #6c5ce7;
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 10px;
}
</style>
