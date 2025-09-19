<script setup lang="ts">
import { handleGetUserInfo } from '@/service/UserService';
import type { PersonalInfo } from '@/types';
import { onMounted, ref } from 'vue';
import ShowMyInfo from '@/components/layout/ShowMyInfo.vue';
import EditMyInfo from '@/components/layout/EditMyInfo.vue';

const personalInfo = ref<PersonalInfo | null>(null);
const showMyInfo = ref(true);
function turnShowAndEdit() {
    showMyInfo.value = !showMyInfo.value;
}

onMounted(async () => {
    personalInfo.value = await handleGetUserInfo()
    if (personalInfo.value === null) {
        throw new Error("个人信息加载失败")
    }
    console.log('个人信息界面加载完成')
});
</script>

<template>
    <ShowMyInfo v-if="showMyInfo" :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
    <EditMyInfo v-else :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
</template>

<style scoped></style>