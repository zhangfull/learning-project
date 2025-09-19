<script setup lang="ts">
import type { PersonalInfo } from '@/types';
import { useUserStore } from '@/stores/user';
import UpdatePassword from '../dialog/UpdatePassword.vue';
import { ref } from 'vue';

const userStore = useUserStore();
const props = defineProps<{
    personalInfo: PersonalInfo | null
}>()
const emits = defineEmits<{
    (e: 'update:turn'): void
}>()

function edit() {
    emits('update:turn')
}
const isUpdatePassWord = ref(false)
function logout() {
    userStore.logout();
    window.location.replace('/')
}
</script>

<template>
    <main>
        <header>
            <h1>用户信息</h1>
        </header>
        <section>
            <h2>基本信息</h2>
            <dl>
                <dt>用户名</dt>
                <dd>{{ props.personalInfo?.name }}</dd>
                <dt>UID</dt>
                <dd>{{ props.personalInfo?.uid }}</dd>
                <dt>邮箱</dt>
                <dd>{{ props.personalInfo?.email }}</dd>
                <dt>权限</dt>
                <dd>{{ props.personalInfo?.authority }}</dd>
                <dt>注册日期</dt>
                <dd>{{ props.personalInfo?.registrationDate }}</dd>
                <dt>关注数量</dt>
                <dd>{{ props.personalInfo?.myFollowersCount }}</dd>
                <dt>粉丝数量</dt>
                <dd>{{ props.personalInfo?.followersCount }}</dd>
                <dt>简介</dt>
                <dd>{{ props.personalInfo?.briefIntroduction }}</dd>
            </dl>
        </section>
        <section>
            <button @click="edit">编辑信息</button>
            <button @click="isUpdatePassWord = true">修改密码</button>
            <button @click="logout">退出登录</button>
        </section>
        <UpdatePassword v-if="isUpdatePassWord" @update:close="() => isUpdatePassWord = false"/>
    </main>
</template>

<style scoped>
</style>