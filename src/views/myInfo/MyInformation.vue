<script setup lang="ts">
import { handleGetUserInfo } from '@/service/UserService';
import type { PersonalInfo } from '@/types';
import { onMounted, ref } from 'vue';
import ShowMyInfo from '@/components/ShowMyInfo.vue';
import EditMyInfo from '@/components/EditMyInfo.vue';
import { openErrorNotice } from '@/utils/noticeUtils';

const personalInfo = ref<PersonalInfo | null>(null);
const showMyInfo = ref(true);
function turnShowAndEdit() {
    showMyInfo.value = !showMyInfo.value;
}

onMounted(async () => {
    personalInfo.value = await handleGetUserInfo()
    if (personalInfo.value === null) {
        openErrorNotice('获取个人信息失败，请重试')
    }
    console.log('个人信息界面加载完成')
});
</script>

<template>
    <ShowMyInfo v-if="showMyInfo" :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
    <EditMyInfo v-else :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
</template>

<style scoped>
</style>