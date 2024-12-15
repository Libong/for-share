import "./base.css";
//从vue库中引入函数
import {createApp} from "vue";
import "element-plus/dist/index.css";
import "@/style/custom.scss" //必须全局引用才能被element-plus的customClass发现
//引入页面
import App from "./App.vue";
//加入路由
import router from "./router";
//全局引入组件
import ElementPlus, {ElNotification} from 'element-plus'


const app = createApp(App);
app.use(ElementPlus);
//TODO没用移到app.vue里设置了
// app.use(ElementPlus, {locale: zhCn})
//相当于把页面挂载到index.html上 div的id为app
app.use(router).mount("#app");
// 设置全局错误处理器
app.config.errorHandler = (err, vm, info) => {
    console.error("Global error handler:", err, vm, info);
    let message;
    if (err instanceof Error) {
        message = err.message
    } else if (typeof err == "string") {
        message = err
    }
    ElNotification({
        title: "",
        message: message,
        duration: 2000,
    });
    return true;
};
// 在全局范围内捕获未处理的Promise错误
// Promise.reject('An unhandled promise rejection.').catch(error => {
//     app.config.errorHandler(error, null, 'unhandled promise rejection');
// });
// window.onunhandledrejection = (event) => {
//     console.error('Unhandled Rejection:', event.promise, 'reason:', event.reason);
//     手动抛出错误，使其进入Vue的全局错误处理器
//     throw event.reason;
// };