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
//相当于把页面挂载到index.html上 div的id为app
app.use(router).mount("#app")
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
// 在全局范围内捕获未处理的Promise错误reject
window.onunhandledrejection = (event) => {
    console.error('Unhandled Rejection:', event.promise, 'reason:', event.reason);
    event.preventDefault();
    //TODO 说是window比app挂载快会导致app.config.errorHandler为null 但是没找到解决方法
    if (app.config.errorHandler != null) {
        app.config.errorHandler(event.reason, null, "Unhandled Rejection");
    }
};
if (!Array.prototype.at) {
    Array.prototype.at = function (index) {
        if (index < 0) {
            index = this.length + index;
        }
        return this[index];
    };
}