import "./assets/main.css";
//从vue库中引入函数
import { createApp } from "vue";
import ElementPlus, { ElNotification } from "element-plus";
//引入页面
import App from "./App.vue";
//加入路由
import router from "./router";

const app = createApp(App);
//相当于把页面挂载到index.html上 div的id为app
app.use(router).mount("#app");
// 设置全局错误处理器
app.config.errorHandler = (err, vm, info) => {
  console.error("Global error handler:", err, vm, info);
  if (err instanceof Error) {
    console.log("1");
    ElNotification({
      title: "123",
      message: "123123",
    });
    console.log("1");
  }

  // 可以在这里添加更复杂的错误处理逻辑
  return true;
};
