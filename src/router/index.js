import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from '@/stores/UserStore'

const routes = [{
    path: '/',
    redirect: '/login'
},
{
    name: 'login',
    path: '/login',
    component: () => import('@/views/Login/index.vue')
},
{
    name: 'home',
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: { requiresAuth: true }
},
{
    name: 'User',
    path: '/user',
    component: () => import('@/views/User/index.vue'),
    meta: { requiresAuth: true }
},
{
    name: 'TravelPlan',
    path: '/travel_plan',
    component: () => import('@/views/TravelPlan/index.vue'),
    meta: { requiresAuth: true }
},
{
    name: 'PlanPage',
    path: '/plan_page',
    component: () => import('@/views/PlanPage/index.vue'),
    meta: { requiresAuth: true }
},
{
    name: 'OverCountry',
    path: '/Over_Country',
    component: () => import('@/views/OverCountry/index.vue'),
    meta: { requiresAuth: true }
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    // 初始化登录状态
    userStore.initLoginState()
    
    // 检查是否需要登录
    if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
        next('/login')
    } else {
        next()
    }
})

export default router