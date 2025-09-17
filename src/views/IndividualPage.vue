<script setup lang="ts">
</script>

<template>
    <div class="layout">
        <aside class="sidebar">
            <nav>
                <router-link to="/individual/information">个人信息</router-link>
                <router-link to="/individual/upload">我的上传</router-link>
                <router-link to="/individual/followers">关注</router-link>
                <router-link to="/individual/favorite">收藏</router-link>
                <router-link to="/individual/browsing-history">浏览历史</router-link>
            </nav>
        </aside>
        <main class="main-content">
            <RouterView />
        </main>
    </div>
</template>

<style scoped></style>
