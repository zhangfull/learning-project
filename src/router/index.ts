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
        component: () => import('@/views/myInfo/IndividualPage.vue'),
        children: [
            { path: '', name: 'IndividualHome', redirect: '/individual/information' },
            { path: 'information', name: 'IndividualInformation', component: () => import('@/views/myInfo/MyInformation.vue') },
            { path: 'followers', name: 'IndividualFollowers', component: () => import('@/views/myInfo/Followers.vue') },
            { path: 'favorite', name: 'IndividualFavorite', component: () => import('@/views/myInfo/MyFavorite.vue') },
            { path: 'browsing-history', name: 'IndividualBrowsingHistory', component: () => import('@/views/myInfo/BrowsingHistory.vue') },
            { path: 'upload', name: 'IndividualUpload', component: () => import('@/views/myInfo/MyUpload.vue') },
            { path: 'update-avatar', name: 'UpdateAvatar', component: () => import('@/views/myInfo/UpdateAvatar.vue') },
        ]
    }
    // 可以继续添加更多路由
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
