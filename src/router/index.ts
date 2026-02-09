import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("@/views/login.vue"),
    },
    {
      path: "/register",
      component: () => import("@/views/register.vue"),
    },
    {
      path: "/home",
      component: () => import("@/views/home.vue"),
      redirect: "/home/index", 
       meta: { requiresAuth: true },  
      children: [
        {
          path: "index",
          component: () => import("@/views/home/index.vue"),
        },
        {
          path: "classes",
          component: () => import("@/views/home/classes.vue"),
        },
        {
          path: "student",
          component: () => import("@/views/home/student.vue"),
        },
      ],
    },
  ],
});

// 设置路由守卫 防止用户通过path直接进入home页面
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router;
