<script setup lang="ts">
import { handleGetUserInfo } from '@/service/UserService';
import { onMounted } from 'vue';

onMounted(() => {
    handleGetUserInfo();
    console.log('个人信息界面加载完成');
});
</script>

<template>
    <main>
        <strong>个人信息界面</strong>
    </main>
</template>

<style scoped>
</style>