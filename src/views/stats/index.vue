<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import * as echarts from 'echarts';
import {ElDialog, ElTable, ElTableColumn} from 'element-plus';
import {WebSocketClient} from '@/tool/websocket';
import {GetCurToken} from "@/config/localStorage";

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
const interfaceFixedChartRef = ref<HTMLElement | null>(null);
const productAddChartRef = ref<HTMLElement | null>(null);
const favorChartRef = ref<HTMLElement | null>(null);
const favorFixedChartRef = ref<HTMLElement | null>(null);

let interfaceChart: echarts.ECharts | null = null;
let interfaceFixedChart: echarts.ECharts | null = null;
let productAddChart: echarts.ECharts | null = null;
let favorChart: echarts.ECharts | null = null;
let favorFixedChart: echarts.ECharts | null = null;

// 实时数字位置信息
const flipPositions = ref<{ x: number, y: number, value: number, visible: boolean }[]>([]);

const chartHeight = ref('420px');
const favorChartWidth = ref('100%');
const favorFlipPositions = ref<{ x: number, y: number, value: number, visible: boolean }[]>([]);

const updateFlipPositions = () => {
  if (!interfaceChart) return;
  const data = (interfaceStats.value as any)[currentType.value];
  
  // 使用 requestAnimationFrame 替代 nextTick 获取更丝滑的同步效果
  requestAnimationFrame(() => {
    const list: { x: number, y: number, value: number, visible: boolean }[] = [];
    (data.names as string[]).forEach((_, index: number) => {
      const pos = interfaceChart!.convertToPixel({seriesIndex: 0}, [data.values[index], index]);
      const isVisible = interfaceChart!.containPixel('grid', pos);
      
      list.push({
        x: pos[0],
        y: pos[1],
        value: data.values[index],
        visible: isVisible
      });
    });
    flipPositions.value = list;
  });
};

const updateFavorFlipPositions = () => {
  if (!favorChart) return;
  const data = favorStats.value;
  
  requestAnimationFrame(() => {
    const list: { x: number, y: number, value: number, visible: boolean }[] = [];
    (data.products as string[]).forEach((_, index: number) => {
      // 这里的坐标转换需要根据系列类型和维度索引调整
      const pos = favorChart!.convertToPixel({seriesIndex: 0}, [index, data.levels[index]]);
      const isVisible = favorChart!.containPixel('grid', pos);
      
      list.push({
        x: pos[0],
        y: pos[1],
        value: data.levels[index],
        visible: isVisible
      });
    });
    favorFlipPositions.value = list;
  });
};

// 详情弹窗
const detailVisible = ref(false);
const detailTitle = ref('');
const currentDetails = ref<LogDetail[]>([]);

// --- 模拟数据 ---
// TODO: 这里的模拟数据后期需要通过 API 接口获取
// 接口访问数据
const interfaceStats = ref({
  daily: {
    names: [
      '/api/user/login', '/api/product/list', '/api/order/create', '/api/user/profile', '/api/product/add',
      '/api/cart/add', '/api/search/keyword', '/api/notice/list', '/api/upload/image', '/api/config/get'
    ],
    values: [210, 560, 120, 330, 45, 89, 412, 110, 56, 230],
    logs: [
      [{name: '/api/user/login', user: 'Admin', time: '10:05', ip: '192.168.1.1'}, {
        name: '/api/user/login',
        user: 'Guest',
        time: '10:10',
        ip: '192.168.1.10'
      }],
      [{name: '/api/product/list', user: 'UserA', time: '10:15', ip: '192.168.1.5'}],
      [{name: '/api/order/create', user: 'UserB', time: '10:20', ip: '192.168.2.1'}],
      [{name: '/api/user/profile', user: 'UserC', time: '10:25', ip: '192.168.1.3'}],
      [{name: '/api/product/add', user: 'Admin', time: '10:30', ip: '192.168.1.1'}],
      [{name: '/api/cart/add', user: 'UserX', time: '10:35', ip: '192.168.3.1'}],
      [{name: '/api/search/keyword', user: 'UserY', time: '10:40', ip: '192.168.3.5'}],
      [{name: '/api/notice/list', user: 'UserB', time: '10:45', ip: '192.168.2.1'}],
      [{name: '/api/upload/image', user: 'Staff1', time: '10:50', ip: '192.168.1.50'}],
      [{name: '/api/config/get', user: 'System', time: '10:55', ip: '127.0.0.1'}]
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

const getNiceMax = (maxValue: number) => {
  if (maxValue <= 0) return 100;
  // 计算数量级
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const normalized = maxValue / magnitude;
  
  let niceMax;
  if (normalized < 1.5) niceMax = 1.5;
  else if (normalized < 2) niceMax = 2;
  else if (normalized < 3) niceMax = 3;
  else if (normalized < 4) niceMax = 4;
  else if (normalized < 5) niceMax = 5;
  else if (normalized < 8) niceMax = 8;
  else niceMax = 10;
  
  return niceMax * magnitude;
};

// WebSocket 实例
let wsClient: WebSocketClient | null = null;

interface WsMessage {
  type: string;
  
}

const handleWsMessage = (message: WsMessage) => {
  if (!message || typeof message !== 'object') return;
  
  // 根据消息类型更新数据
  // 假设格式为: { type: 'interface_stats_update', data: { index: number, value: number } }
  // 或者: { type: 'favor_stats_update', data: { index: number, value: number } }
  
  const {type, data} = message;
  
  if (type === 'interface_stats_update' && data) {
    const {index, value} = data;
    if (interfaceStats.value.daily.values[index] !== undefined) {
      interfaceStats.value.daily.values[index] = value;
      
      if (currentType.value === 'daily') {
        if (interfaceChart) interfaceChart.setOption({series: [{data: interfaceStats.value.daily.values}]});
        if (interfaceFixedChart) {
          const maxValue = Math.max(...interfaceStats.value.daily.values);
          interfaceFixedChart.setOption({xAxis: {max: getNiceMax(maxValue)}});
        }
        updateFlipPositions();
      }
    }
  } else if (type === 'favor_stats_update' && data) {
    const {index, value} = data;
    if (favorStats.value.levels[index] !== undefined) {
      favorStats.value.levels[index] = value;
      
      if (favorChart) {
        favorChart.setOption({series: [{data: favorStats.value.levels}]});
        updateFavorFlipPositions();
      }
    }
  }
};

const initWebSocket = () => {
  wsClient = new WebSocketClient({
    onMessage: handleWsMessage,
    onError: (err) => console.error('Stats WebSocket Error:', err),
    onOpen(ev) {
      console.log('连接成功，准备发送验证信息...');
      wsClient?.send({
        type: 'auth',
        token: GetCurToken()
      });
    },
  });
  wsClient.connect();
};

// TODO: 商品新增数据后期需要通过 API 接口动态拉取
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

// TODO: 商品收藏热度数据后期需要通过 API 接口获取
const favorStats = ref({
  products: ['机械键盘', '曲面屏', '游戏主机', '无线耳机', '人体工学椅', '数位板', '游戏手柄', '电竞麦克风', '护眼台灯', '智能插座'],
  levels: [95, 88, 82, 75, 68, 55, 42, 38, 30, 25]
});

// --- 图表初始化函数 ---

const initInterfaceChart = () => {
  if (!interfaceChartRef.value || !interfaceFixedChartRef.value) return;
  
  // 1. 初始化固定的底层 (负责 X 轴和网格线)
  if (interfaceFixedChart) interfaceFixedChart.dispose();
  interfaceFixedChart = echarts.init(interfaceFixedChartRef.value);
  
  // 2. 初始化滚动的上层 (负责 Y 轴和柱状图)
  if (interfaceChart) interfaceChart.dispose();
  interfaceChart = echarts.init(interfaceChartRef.value);
  
  const data = (interfaceStats.value as any)[currentType.value];
  const maxValue = Math.max(...(data.values as number[]), 100);
  const syncMax = getNiceMax(maxValue);
  
  // 统一边距：左侧留够标签空间，其余四周留白
  const commonGrid = {left: 120, right: 30, bottom: 40, top: 50, containLabel: false};
  
  // 底层配置：只显示 X 轴和背景网格
  const fixedOption = {
    grid: commonGrid,
    xAxis: {
      type: 'value',
      min: 0,
      max: syncMax,
      axisLine: {show: true, lineStyle: {color: '#dcdde1'}},
      splitLine: {show: true, lineStyle: {type: 'dashed'}},
      axisLabel: {color: '#636e72', fontSize: 11, margin: 12}
    },
    yAxis: {type: 'category', data: [], axisLine: {show: false}, axisTick: {show: false}},
    series: []
  };
  
  // 上层配置：显示 Y 轴和条形图，背景透明
  const scrollOption = {
    backgroundColor: 'transparent',
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
    grid: {...commonGrid, top: 0, bottom: 0}, // 绘图区高度由容器比例决定
    xAxis: {
      type: 'value',
      min: 0,
      max: syncMax,
      axisLine: {show: false},
      splitLine: {show: false},
      axisLabel: {show: false}
    },
    yAxis: {
      type: 'category',
      data: data.names,
      inverse: true,
      axisLine: {show: true, lineStyle: {color: '#dcdde1'}},
      axisLabel: {color: '#636e72', fontSize: 11, width: 80, overflow: 'truncate'}
    },
    series: [
      {
        name: '访问次数',
        type: 'bar',
        data: data.values,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            {offset: 0, color: '#a29bfe'},
            {offset: 1, color: '#6c5ce7'}
          ]),
          borderRadius: [0, 4, 4, 0]
        },
        label: {show: false},
        animationDuration: 1000,
        animationDurationUpdate: 300
      }
    ]
  };
  
  interfaceFixedChart.setOption(fixedOption);
  interfaceChart.setOption(scrollOption);
  
  interfaceChart.on('finished', () => {
    updateFlipPositions();
  });
  
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
  // TODO: 商品新增趋势数据后期应通过 API 获取
  const data = productAddData[currentType.value];
  const option = {
    tooltip: {trigger: 'item', formatter: '{b}: {c} 个'},
    grid: {left: 50, right: 30, bottom: 60, top: 40, containLabel: false},
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLine: {lineStyle: {color: '#dcdde1'}},
      axisLabel: {color: '#636e72', fontSize: 11, rotate: 30, interval: 0, margin: 12}
    },
    yAxis: {type: 'value'},
    series: [{
      data: data.values,
      type: 'line',
      symbol: 'diamond',
      symbolSize: 12,
      itemStyle: {color: '#74b9ff'},
      areaStyle: {color: 'rgba(116, 185, 255, 0.1)'}
    }]
  };
  productAddChart.setOption(option);
  
  productAddChart.on('click', (params: any) => {
    const index = params.dataIndex;
    detailTitle.value = `${data.categories[index]} 新增商品详情`;
    // TODO: 这里的详情点击后期需要通过 API 获取
    currentDetails.value = data.details[index] || [];
    detailVisible.value = true;
  });
};

const initFavorChart = () => {
  if (!favorChartRef.value || !favorFixedChartRef.value) return;
  
  if (favorFixedChart) favorFixedChart.dispose();
  favorFixedChart = echarts.init(favorFixedChartRef.value);
  
  if (favorChart) favorChart.dispose();
  favorChart = echarts.init(favorChartRef.value);
  
  const data = favorStats.value;
  
  // 统一边距：左侧留出 Y 轴空间 (50)，右侧留白 (30)
  const commonGrid = {left: 50, right: 30, bottom: 60, top: 50, containLabel: false};
  
  const fixedOption = {
    grid: commonGrid,
    xAxis: {type: 'category', data: [], axisLine: {show: false}, axisTick: {show: false}},
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLine: {show: true, lineStyle: {color: '#dcdde1'}},
      splitLine: {show: true, lineStyle: {type: 'dashed', color: '#f1f2f6'}},
      axisLabel: {color: '#636e72', fontSize: 11}
    },
    series: []
  };
  
  const scrollOption = {
    backgroundColor: 'transparent',
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
    grid: {left: 0, right: 0, top: 50, bottom: 60},
    xAxis: {
      type: 'category',
      data: data.products,
      axisLine: {show: true, lineStyle: {color: '#dcdde1'}},
      axisLabel: {color: '#636e72', fontSize: 11, rotate: 30, interval: 0, margin: 12}
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {show: false},
      splitLine: {show: false},
      axisLabel: {show: false}
    },
    series: [
      {
        name: '收藏度',
        type: 'bar',
        data: data.levels,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {offset: 0, color: '#fab1a0'},
            {offset: 1, color: '#ff7675'}
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        animationDuration: 1000,
        animationDurationUpdate: 300
      }
    ]
  };
  
  favorFixedChart.setOption(fixedOption);
  favorChart.setOption(scrollOption);
  
  favorChart.on('finished', () => {
    updateFavorFlipPositions();
  });
};

const updateChartHeight = () => {
  const data = (interfaceStats.value as any)[currentType.value];
  // 网格可用高度为 330px (420 - 50 - 40)，显示 5 个则每个 66px
  const itemHeight = 66;
  const height = (data.names as string[]).length * itemHeight;
  chartHeight.value = `${height}px`;
  
  // 更新收藏热度图表宽度 (横向滚动)
  const favorData = favorStats.value;
  const itemWidth = 100;
  const width = favorData.products.length * itemWidth;
  favorChartWidth.value = `${Math.max(width, 600)}px`;
  
  nextTick(() => {
    interfaceChart?.resize();
    favorChart?.resize();
    updateFlipPositions();
    updateFavorFlipPositions();
  });
};

const handleResize = () => {
  interfaceChart?.resize();
  interfaceFixedChart?.resize();
  productAddChart?.resize();
  favorChart?.resize();
  favorFixedChart?.resize();
  updateFlipPositions();
  updateFavorFlipPositions();
};

onMounted(() => {
  updateChartHeight();
  initInterfaceChart();
  initProductAddChart();
  initFavorChart();
  initWebSocket();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (wsClient) wsClient.disconnect();
  window.removeEventListener('resize', handleResize);
});

watch(currentType, () => {
  updateChartHeight();
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
          <h2 class="title">实时功能接口访问统计 <span>Interface Control Center</span></h2>
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
        <div class="dual-chart-container">
          <div class="chart-title-html">实时功能接口访问统计 (WebSocket)</div>
          <!-- 底面层：固定的刻度线和标题 -->
          <div ref="interfaceFixedChartRef" class="fixed-chart-layer"></div>
          
          <!-- 滑动层：包裹了加长版图表 -->
          <div class="chart-scroll-wrapper scroll-chart-layer">
            <div :style="{ height: chartHeight, position: 'relative' }" class="chart-wrapper">
              <div ref="interfaceChartRef" class="chart-div" style="height: 100%;"></div>
              
              <!-- 翻牌数字覆盖层 -->
              <div class="flip-labels-overlay">
                <div
                    v-for="(item, idx) in flipPositions"
                    v-show="item.visible"
                    :key="idx"
                    :style="{ left: (item.x + 30) + 'px', top: item.y + 'px', transform: 'translateY(-50%)' }"
                    class="flip-label-item"
                >
                  <div class="flip-value">
                    <div v-for="(digit, dIdx) in String(item.value).split('')" :key="dIdx" class="digit-box">
                      <transition mode="out-in" name="flip-num">
                        <span :key="digit">{{ digit }}</span>
                      </transition>
                    </div>
                    <span class="unit">次</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 商品新增趋势 -->
      <div class="anime-card">
        <div class="header">
          <h2 class="title small">商品新增趋势 <span>Product Trend</span></h2>
        </div>
        <div class="dual-chart-container small">
          <div class="chart-wrapper" style="height: 100%;">
            <div ref="productAddChartRef" class="chart-div" style="height: 100%;"></div>
          </div>
        </div>
      </div>
      
      <!-- 商品收藏度 -->
      <div class="anime-card">
        <div class="header">
          <h2 class="title small">收藏热度排名 <span>Product Popularity</span></h2>
        </div>
        <div class="dual-chart-container small">
          <!-- 底面层：固定的刻度线和标题 -->
          <div ref="favorFixedChartRef" class="fixed-chart-layer"></div>
          
          <!-- 滑动层：包裹了加宽版图表 -->
          <div class="chart-scroll-wrapper scroll-chart-layer horizontal">
            <div :style="{ width: favorChartWidth, height: '100%', position: 'relative' }" class="chart-wrapper">
              <div ref="favorChartRef" class="chart-div" style="width: 100%; height: 100%;"></div>
              
              <!-- 翻牌数字覆盖层 (收藏度) -->
              <div class="flip-labels-overlay">
                <div
                    v-for="(item, idx) in favorFlipPositions"
                    v-show="item.visible"
                    :key="idx"
                    :style="{ left: item.x + 'px', top: (item.y - 25) + 'px', transform: 'translateX(-50%)' }"
                    class="flip-label-item"
                >
                  <div class="flip-value favor">
                    <div v-for="(digit, dIdx) in String(item.value).split('')" :key="dIdx" class="digit-box">
                      <transition mode="out-in" name="flip-num">
                        <span :key="digit">{{ digit }}</span>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 详情弹窗：科技动漫终端版 -->
    <el-dialog
        v-model="detailVisible"
        :show-close="false"
        class="anime-terminal-dialog"
        width="650px"
    >
      <template #header>
        <div class="terminal-header">
          <span class="header-title" v-html="detailTitle.replace('[', '<strong>[').replace(']', ']</strong>')"></span>
        </div>
      </template>
      
      <div class="terminal-body">
        <div class="scanline"></div>
        <el-table
            :data="currentDetails"
            class="tech-table"
            style="width: 100%"
        >
          <el-table-column align="center" header-align="center" label="OPERATOR" min-width="120" prop="user">
            <template #default="scope">
              <span class="tech-user-badge">{{ scope.row.user }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="TIME" min-width="120" prop="time"/>
          <el-table-column v-if="currentDetails[0]?.ip" align="center" header-align="center" label="SOURCE IP"
                           min-width="160"
                           prop="ip"/>
        </el-table>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <div class="footer-msg">Connection Secure: 256-bit AES</div>
          <button class="terminal-close-btn" @click="detailVisible = false">
            <span class="btn-icon">×</span> CLOSE
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
  grid-column: span 2; /* 跨两列 */
  width: 60%; /* 宽度缩小到 60% */
  justify-self: center; /* 居中 */
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
    
    &.small {
      font-size: 20px;
    }
    
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

.dual-chart-container {
  position: relative;
  height: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 10px; /* 统一外围留白 */
  box-sizing: border-box;
  
  &.small {
    height: 320px;
  }
}

.chart-title-html {
  display: none; /* 已迁移到 header，暂时保留 class 以防万一 */
}

.fixed-chart-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.scroll-chart-layer {
  position: absolute;
  top: 50px; /* 避开顶部标题 */
  bottom: 60px; /* 默认留出底部空间 */
  left: 0;
  width: 100%;
  z-index: 2;
  background: transparent !important;
  
  &.horizontal {
    bottom: 0;
    left: 50px; /* 避开固定 Y 轴区域 (与 commonGrid.left 一致) */
    width: calc(100% - 50px);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      display: block;
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(108, 92, 231, 0.2);
      border-radius: 3px;
    }
  }
}

.chart-scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 12px;
  padding: 0;
  overscroll-behavior: contain;
  
  &.horizontal {
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  /* 隐藏垂直滚动条 */
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.chart-wrapper {
  background: transparent;
  border-radius: 12px;
  padding: 0; /* 彻底移除内边距，确保坐标系从 0,0 开始 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chart-div {
  width: 100%;
  height: 100%;
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
  
  &.favor {
    color: #d63031;
    font-size: 14px;
    font-weight: bold;
  }
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

@keyframes blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
</style>

<style lang="scss">
/* 详情弹窗全局样式：科技动漫终端版 (因为 el-dialog 默认 Teleport 到 body) */
.anime-terminal-dialog {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border-radius: 4px;
  border-left: 6px solid #6c5ce7;
  border-right: 1px solid rgba(108, 92, 231, 0.1);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08), inset 0 0 10px rgba(108, 92, 231, 0.02);
  overflow: hidden;
  
  .el-dialog__header {
    // background: rgba(108, 92, 231, 0.03);
    padding: 20px;
    margin: 0;
    // border-bottom: 1px solid rgba(108, 92, 231, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .terminal-header {
    display: flex;
    align-items: center;
    
    .header-title {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #636e72;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
      
      strong {
        color: #4834d4;
        font-family: 'ZCOOL KuaiLe', cursive;
        font-size: 17px;
        text-shadow: 0 2px 4px rgba(72, 52, 212, 0.1);
      }
    }
  }
  
  .terminal-body {
    position: relative;
    padding: 15px;
    background: #fff;
  }
  
  .scanline {
    display: none; /* 浅色模式下扫描线效果一般，暂时关闭 */
  }
  
  /* Table Customization for Light Theme */
  .tech-table {
    background: transparent !important;
    color: #2d3436 !important;
    
    &::before {
      display: none;
    }
    
    th.el-table__cell {
      background: rgba(108, 92, 231, 0.04) !important;
      color: #6c5ce7 !important;
      font-weight: bold;
      font-size: 13px;
      border-bottom: 2px solid rgba(108, 92, 231, 0.1) !important;
    }
    
    td.el-table__cell {
      border-bottom: 1px solid rgba(0, 0, 0, 0.03) !important;
      background: transparent !important;
    }
    
    tr:hover td.el-table__cell {
      background: rgba(108, 92, 231, 0.02) !important;
    }
  }
  
  .tech-item-name {
    color: #4834d4;
    font-weight: 600;
    font-family: monospace;
  }
  
  .tech-user-badge {
    background: #f1f2f6;
    color: #6c5ce7;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    border: 1px solid rgba(108, 92, 231, 0.1);
  }
  
  .el-dialog__footer {
    border-top: 1px solid rgba(0, 0, 0, 0.03);
    padding: 15px 20px;
    background: #f9f9fb;
  }
  
  .el-scrollbar__bar {
    .el-scrollbar__thumb {
      background: rgba(108, 92, 231, 0.3);
      
      &:hover {
        background: #6c5ce7;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .footer-msg {
    font-size: 11px;
    color: rgba(162, 155, 254, 0.4);
    font-family: monospace;
  }
}

.terminal-close-btn {
  background: #6c5ce7;
  color: #fff;
  border: none;
  padding: 8px 24px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  border-radius: 30px; /* 改为椭圆 */
  text-transform: uppercase;
  
  &:hover {
    background: #4834d4;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
  }
  
  .btn-icon {
    font-size: 18px;
    font-weight: normal;
  }
}
</style>
