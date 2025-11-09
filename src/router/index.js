import { createRouter, createWebHashHistory } from "vue-router";

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
    component: () => import('@/views/home/index.vue')
},
{
    name: 'User',
    path: '/user',
    component: () => import('@/views/User/index.vue')
},
{
    name: 'TravelPlan',
    path: '/travel_plan',
    component: () => import('@/views/TravelPlan/index.vue')
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router