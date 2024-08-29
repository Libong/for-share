import "./assets/main.css";
//从vue库中引入函数
import { createApp } from "vue";
import "element-plus/dist/index.css";
//引入页面
import App from "./App.vue";
//加入路由
import router from "./router";
import { ElNotification } from "element-plus";

const app = createApp(App);
//相当于把页面挂载到index.html上 div的id为app
app.use(router).mount("#app");
// 设置全局错误处理器
app.config.errorHandler = (err, vm, info) => {
  console.error("Global error handler:", err, vm, info);
  if (err instanceof Error) {
    ElNotification({
      title: "",
      message: err.message,
      duration: 2000,
    });
  }

  // 可以在这里添加更复杂的错误处理逻辑
  return true;
};
