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
    {
        path: '/detail/:id',
        name: 'detail',
        component: () => import('@/views/FileDetailPage.vue')
    },
    {
        path: '/upload',  // 通过动态路径参数传递 id
        name: 'Upload',
        component: () => import('@/views/UploadPage.vue')
    },
    {
        path: '/individual',
        name: 'Individual',
        component: () => import('@/views/IndividualPage.vue'),
        children: [
            { path: '', redirect: '/individual/information' },
            { path: 'information', component: () => import('@/views/MyInformation.vue') },
            { path: 'followers', component: () => import('@/views/Followers.vue') },
            { path: 'favorite', component: () => import('@/views/MyFavorite.vue') },
            { path: 'browsing-history', component: () => import('@/views/BrowsingHistory.vue') },
            { path: 'upload', component: () => import('@/views/MyUpload.vue') }
        ]
    }
    // 可以继续添加更多路由
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
