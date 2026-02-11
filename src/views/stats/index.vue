<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElDialog, ElTable, ElTableColumn } from 'element-plus';

// --- 类型定义 ---
type StatType = 'daily' | 'weekly' | 'monthly';

interface LogDetail {
  name: string; // 商品名或接口名
  user: string;
  time: string;
  ip?: string;
}

// --- 状态管理 ---
const currentType = ref<StatType>('daily');
const interfaceChartRef = ref<HTMLElement | null>(null);
const productAddChartRef = ref<HTMLElement | null>(null);
const favorChartRef = ref<HTMLElement | null>(null);

let interfaceChart: echarts.ECharts | null = null;
let productAddChart: echarts.ECharts | null = null;
let favorChart: echarts.ECharts | null = null;

// 实时数字位置信息
const flipPositions = ref<{ x: number, y: number, value: number }[]>([]);

const updateFlipPositions = () => {
  if (!interfaceChart) return;
  const data = interfaceStats.value[currentType.value];
  // 使用 nextTick 确保图表已渲染
  nextTick(() => {
    const positions = data.names.map((_, index) => {
      // 获取柱子末端的像素坐标 [value, index] -> [x, y]
      const pos = interfaceChart!.convertToPixel({ seriesIndex: 0 }, [data.values[index], index]);
      return { x: pos[0], y: pos[1], value: data.values[index] };
    });
    flipPositions.value = positions;
  });
};

// 详情弹窗
const detailVisible = ref(false);
const detailTitle = ref('');
const currentDetails = ref<LogDetail[]>([]);

// --- 模拟数据 ---

// 接口访问数据
const interfaceStats = ref({
  daily: {
    names: ['/api/user/login', '/api/product/list', '/api/order/create', '/api/user/profile', '/api/product/add'],
    values: [210, 560, 120, 330, 45],
    logs: [
      [{name: '/api/user/login', user: 'Admin', time: '10:05', ip: '192.168.1.1'}, {name: '/api/user/login', user: 'Guest', time: '10:10', ip: '192.168.1.10'}],
      [{name: '/api/product/list', user: 'UserA', time: '10:15', ip: '192.168.1.5'}],
      [{name: '/api/order/create', user: 'UserB', time: '10:20', ip: '192.168.2.1'}],
      [{name: '/api/user/profile', user: 'UserC', time: '10:25', ip: '192.168.1.3'}],
      [{name: '/api/product/add', user: 'Admin', time: '10:30', ip: '192.168.1.1'}]
    ]
  },
  weekly: {
    names: ['/api/login', '/api/list', '/api/order', '/api/user', '/api/add'],
    values: [1200, 3500, 800, 2100, 300],
    logs: Array(5).fill([{name: 'API Access', user: 'Batch', time: 'Mon-Sun', ip: 'Dynamic'}])
  },
  monthly: {
    names: ['LOGIN', 'LIST', 'ORDER', 'USER', 'ADD'],
    values: [5000, 15000, 3200, 8500, 1200],
    logs: Array(5).fill([{name: 'Monthly Aggregate', user: 'System', time: 'Monthly', ip: 'Multi-IP'}])
  }
});

// 模拟 WebSocket 实时更新 (仅针对当日数据)
let wsTimer: any = null;
const startWsSimulation = () => {
  wsTimer = setInterval(() => {
    // 随机增加几个访问量
    const index = Math.floor(Math.random() * interfaceStats.value.daily.values.length);
    interfaceStats.value.daily.values[index] += Math.floor(Math.random() * 5) + 1;
    
    // 如果当前选中的是 daily，更新图表
    if (currentType.value === 'daily' && interfaceChart) {
      interfaceChart.setOption({
        series: [{ data: interfaceStats.value.daily.values }]
      });
      updateFlipPositions();
    }
  }, 3000); // 3秒更新一次
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

const initInterfaceChart = () => {
  if (!interfaceChartRef.value) return;
  if (interfaceChart) interfaceChart.dispose();
  interfaceChart = echarts.init(interfaceChartRef.value);
  
  const data = interfaceStats.value[currentType.value];
  
  const option = {
    title: { 
      text: '实时功能接口访问统计 (WebSocket)', 
      textStyle: { color: '#6c5ce7', fontSize: 16 } 
    },
    tooltip: { 
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { type: 'dashed' } }
    },
    yAxis: { 
      type: 'category', 
      data: data.names,
      axisLabel: { color: '#636e72', fontSize: 11 }
    },
    series: [
      {
        name: '访问次数',
        type: 'bar',
        data: data.values,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#a29bfe' },
            { offset: 1, color: '#6c5ce7' }
          ]),
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: false // 隐藏自带标签，使用 Vue Overlay 实现翻牌效果
        },
        animationDuration: 1000,
        animationDurationUpdate: 500
      }
    ]
  };
  interfaceChart.setOption(option);
  updateFlipPositions();

  // 点击下钻
  interfaceChart.on('click', (params: any) => {
    const index = params.dataIndex;
    detailTitle.value = `接口 [ ${data.names[index]} ] 访问日志`;
    currentDetails.value = data.logs[index] || [];
    detailVisible.value = true;
  });
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
      symbol: 'diamond',
      symbolSize: 12,
      itemStyle: { color: '#74b9ff' },
      areaStyle: { color: 'rgba(116, 185, 255, 0.1)' }
    }]
  };
  productAddChart.setOption(option);

  productAddChart.on('click', (params: any) => {
    const index = params.dataIndex;
    detailTitle.value = `${data.categories[index]} 新增商品详情`;
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
  interfaceChart?.resize();
  productAddChart?.resize();
  favorChart?.resize();
  updateFlipPositions();
};

onMounted(() => {
  initInterfaceChart();
  initProductAddChart();
  initFavorChart();
  startWsSimulation();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (wsTimer) clearInterval(wsTimer);
});

watch(currentType, () => {
  initInterfaceChart();
  initProductAddChart();
});

</script>

<template>
  <div class="stats-container">
    <div class="stats-grid">
      <!-- 接口访问统计 (原流量统计) -->
      <div class="anime-card chart-main-card">
        <div class="header">
          <h2 class="title">数据驾驶舱 <span>Interface Control Center</span></h2>
          <div class="filter-group">
            <button 
              v-for="type in (['daily', 'weekly', 'monthly'] as StatType[])" 
              :key="type"
              :class="['filter-btn', { active: currentType === type }]"
              @click="currentType = type"
            >
              {{ type === 'daily' ? '当日实况' : type === 'weekly' ? '周度统计' : '月度归档' }}
            </button>
          </div>
        </div>
        <div class="chart-wrapper" style="position: relative;">
          <div ref="interfaceChartRef" class="chart-div"></div>
          
          <!-- 翻牌数字覆盖层 -->
          <div class="flip-labels-overlay">
            <div 
              v-for="(item, idx) in flipPositions" 
              :key="idx"
              class="flip-label-item"
              :style="{ left: (item.x + 30) + 'px', top: (item.y + 15) + 'px', transform: 'translateY(-50%)' }"
            >
              <div class="flip-value">
                <div v-for="(digit, dIdx) in String(item.value).split('')" :key="dIdx" class="digit-box">
                  <transition name="flip-num" mode="out-in">
                    <span :key="digit">{{ digit }}</span>
                  </transition>
                </div>
                <span class="unit">次</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品新增趋势 -->
      <div class="anime-card">
        <div class="chart-wrapper">
          <div ref="productAddChartRef" class="chart-div"></div>
        </div>
      </div>

      <!-- 商品收藏度 -->
      <div class="anime-card">
        <div class="chart-wrapper">
          <div ref="favorChartRef" class="chart-div"></div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="detailTitle" width="600px" custom-class="anime-dialog">
      <el-table :data="currentDetails" style="width: 100%" border stripe>
        <el-table-column prop="name" label="名称/接口" min-width="150" show-overflow-tooltip />
        <el-table-column prop="user" label="操作用户" width="100" />
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column v-if="currentDetails[0]?.ip" prop="ip" label="访问IP" width="130" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <button class="filter-btn active" @click="detailVisible = false">关闭终端</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap');

.stats-container {
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #edf1f7 100%);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-main-card {
  grid-column: span 2;
}

.anime-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(162, 155, 254, 0.3);
  box-shadow: 0 8px 32px rgba(108, 92, 231, 0.05);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: #6c5ce7;
    border-radius: 16px 0 0 16px;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  .title {
    font-family: 'ZCOOL KuaiLe', cursive;
    color: #4834d4;
    font-size: 26px;
    margin: 0;
    display: flex;
    flex-direction: column;

    span {
      font-size: 11px;
      color: #95afc0;
      letter-spacing: 1.5px;
      margin-top: 5px;
      text-transform: uppercase;
      font-family: sans-serif;
    }
  }
}

.filter-group {
  display: flex;
  gap: 10px;

  .filter-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #dcdde1;
    background: #fff;
    color: #718093;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background: #f1f2f6;
      color: #6c5ce7;
      border-color: #a29bfe;
    }

    &.active {
      background: #6c5ce7;
      border-color: #6c5ce7;
      color: #fff;
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
    }
  }
}

.chart-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
}

.chart-div {
  width: 100%;
  height: 320px;
}

.chart-main-card .chart-div {
  height: 420px;
}

/* 翻牌覆盖层样式 */
.flip-labels-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 让鼠标事件穿透到图表 */
}

.flip-label-item {
  position: absolute;
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
}

.flip-value {
  display: flex;
  align-items: center;
  gap: 1px;
  color: #6c5ce7;
  font-weight: bold;
  font-size: 16px;
}

.digit-box {
  display: inline-flex;
  height: 24px;
  align-items: center;
  justify-content: center;
}

.unit {
  margin-left: 4px;
  font-size: 13px;
  color: #a29bfe;
}

/* 翻页动画：上下翻转 - 优化为短促快节奏 */
.flip-num-enter-active, .flip-num-leave-active {
  transition: all 0.2s ease-out;
}

.flip-num-enter-from {
  transform: translateY(50%) rotateX(-90deg);
  opacity: 0;
}

.flip-num-leave-to {
  transform: translateY(-50%) rotateX(90deg);
  opacity: 0;
}

:deep(.anime-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  
  .el-dialog__header {
    background: #f8f9ff;
    padding: 20px;
    margin: 0;
    border-bottom: 1px solid #eee;
  }
  .el-dialog__title {
    font-weight: bold;
    color: #4834d4;
  }
  .el-dialog__body {
    padding: 20px;
  }
}

.dialog-footer {
  text-align: right;
  padding: 10px 0;
}
</style>
