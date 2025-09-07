import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomePage.vue'),
    },
    {
        path: '/files',
        name: 'FileList',
        component: () => import('@/views/FileListPage.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/AboutPage.vue'),
    },
    // 可以继续添加更多路由
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;