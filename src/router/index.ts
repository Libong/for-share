import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {ElNotification} from "element-plus";
import {localStorage_tokenObj_label} from "@/config/localStorage";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login/login.vue"),
    },
    {
        path: "/navbar",
        name: "Navbar",
        component: () => import("@/views/navbar/index.vue"),
        children: [
            {
                path: "/record",
                name: "Record",
                component: () => import("@/views/record/index.vue"),
            },
            {
                path: "/calendar",
                name: "Calendar",
                component: () => import("@/views/calendar/index.vue"),
            },
            {
                path: "/home",
                name: "Home",
                component: () => import("@/views/home/index.vue"),
            },
            {
                path: '/bucketHome',
                name: 'BucketHome',
                component: () => import("@/views/bucket/BucketHome.vue"),
                redirect: '/bucketHome/buckets',
                children: [{
                    path: 'buckets',
                    name: 'Buckets',
                    component: () => import("@/views/bucket/BucketListView.vue"),
                },
                    {
                        path: 'buckets/:id',
                        name: 'BucketDetail',
                        component: () => import("@/views/bucket/BucketDetailView.vue"),
                        props: true
                    }]
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

// 路由守卫
router.beforeEach((to, from, next) => {
    //通过token判断用户是否登录
    if (!localStorage.getItem(localStorage_tokenObj_label) && to.name !== 'Login') {
        // 没有且当前页面不是登录 重定向到登录页面
        next({name: 'Login'});
        return;
    }
    if (localStorage.getItem(localStorage_tokenObj_label) && (to.name == 'Login' || !to.name)) {
        // 有且当前页面是登录页 或者不存在的页面 默认去菜单页
        next({name: 'Navbar'});
        return;
    }
    next();
});

export default router;