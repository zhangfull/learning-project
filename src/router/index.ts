import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'MainLayout',
        component: () => import('@/components/layout/MainLayout.vue'),
        children: [
            { path: '', name: 'Home', redirect: '/views/HomePage.vue' },
            { path: '/', name: 'Home', component: () => import('@/views/HomePage.vue') },
            { path: 'files', name: 'FileList', component: () => import('@/views/file/FileListPage.vue') },
            { path: 'upload', name: 'Upload', component: () => import('@/views/file/UploadPage.vue') },
            { path: 'about', name: 'About', component: () => import('@/views/AboutPage.vue') },
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
        ]
    },
    {
        path: '/display',
        name: 'display',
        component: () => import('@/components/layout/DisplayLayout.vue'),
        children: [
            { path: 'detail/:id', name: 'FileDetail', component: () => import('@/views/file/FileDetailPage.vue') },
            
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
