import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { ElNotification } from "element-plus";
import { localStorage_tokenObj_label } from "@/config/localStorage";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/stats",
    },
    {
        path: "/stats",
        name: "Stats",
        component: () => import("@/views/stats/index.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active",
    routes,
});

router.beforeEach((to, from, next) => {
    ElNotification.closeAll(); // 关闭所有通知
    next();
});

// 路由守卫 (为了方便演示暂且注释掉，因为目前没有登录页且没有 token)
// router.beforeEach((to, from, next) => {
//     //通过token判断用户是否登录
//     if (!localStorage.getItem(localStorage_tokenObj_label) && to.name !== 'Login') {
//         // 没有且当前页面不是登录 重定向到登录页面
//         next({ name: 'Login' });
//         return;
//     }
//     if (localStorage.getItem(localStorage_tokenObj_label) && (to.name == 'Login' || !to.name)) {
//         // 有且当前页面是登录页 或者不存在的页面 默认去菜单页
//         next({ name: 'Navbar' });
//         return;
//     }
//     next();
// });

export default router;