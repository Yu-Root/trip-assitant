import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
    path: '/',
    redirect: '/home'
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
}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router