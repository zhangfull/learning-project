<script setup lang="ts">
import { handleUpdateUserInfo } from '@/service/UserService';
import type { PersonalInfo } from '@/types';
import { ref } from 'vue';
import NoticeModal from '@/components/dialog/NoticeModal.vue'

const props = defineProps<{
    personalInfo: PersonalInfo | null
}>()
const emits = defineEmits<{
    (e: 'update:turn'): void
}>()

const info = ref<PersonalInfo>(JSON.parse(JSON.stringify(props.personalInfo)))

function turn() {
    emits('update:turn')
}
const notice = ref<string | boolean>(false)
async function save() {
    if (info.value.name === props.personalInfo?.name && info.value.briefIntroduction === props.personalInfo.briefIntroduction) {
        notice.value = '修改成功'
        return
    }
    const result = await handleUpdateUserInfo(info.value)
    console.log('更改code', result);

    if (result === 0) {
        if (props.personalInfo) {
            props.personalInfo.name = info.value.name
            props.personalInfo.briefIntroduction = info.value.briefIntroduction
        }
        notice.value = '修改成功'
    } else if (result === 1) {
        notice.value = '用户名不能有空格'
    } else if (result === 2) {
        notice.value = '修改失败'
    } else {
        notice.value = '网络异常'
    }
}

function closeNotice() {
    notice.value = false
     emits('update:turn')
}
</script>

<template>
    <main>

        <head>
            <h1>修改页面</h1>
        </head>
        <form @submit.prevent="save">
            <label>用户名</label>
            <input v-model="info.name" type="text" placeholder="输入用户名" />
            <label>简介</label>
            <textarea v-model="info.briefIntroduction" placeholder="输入个人介绍" rows="3"
                style="resize: both; width: 100%;"></textarea>
            <button type="submit">更改</button>
        </form>
    </main>
    <button @click="turn">取消</button>
    <NoticeModal v-if="notice" @update:show="closeNotice">{{ notice }}</NoticeModal>
</template>

<style scoped></style>