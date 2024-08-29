import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/login/Login.vue"),
    // children: [
    //   {
    //     path: "/login",
    //     name: "Login",
    //     component: import("../components/login/Login.vue"),
    //   },
    // ],
  },
  {
    path: "/eat",
    name: "Eat",
    component: () => import("@/views/eat/index.vue"),
  },
  {
    path: "/drink",
    name: "Drink",
    component: () => import("@/views/drink/index.vue"),
  },
  // 可以添加更多的路由配置
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
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