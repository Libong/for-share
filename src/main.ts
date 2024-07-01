import './assets/main.css'
//从vue库中引入函数
import { createApp } from 'vue'
//引入页面
import App from './App.vue'
//相当于把页面挂载到index.html上 div的id为app
createApp(App).mount('#app')
