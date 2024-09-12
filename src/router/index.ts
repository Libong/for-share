import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {ElNotification} from "element-plus";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login/Login.vue"),
    },
    {
        path: "/improveInfo",
        name: "ImproveInfo",
        component: () => import("@/views/improveInfo/index.vue"),
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
    },
    {
        path: "/navbar",
        name: "Navbar",
        component: () => import("@/views/navbar/index.vue"),
        children: [
            {
                path: "",
                name: "Record",
                component: () => import("@/views/record/index.vue"),
            },
        ]
    },
    // 可以添加更多的路由配置
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
router.beforeEach((to, from, next) => {
    // 假设我们通过localStorage判断用户是否登录
    // if (to.name !== 'Login' && !localStorage.getItem('token')) {
    //   // 重定向到登录页面
    //   next({ name: 'Login' });
    // } else {
    //   next();
    // }
    next();
});

export default router;
