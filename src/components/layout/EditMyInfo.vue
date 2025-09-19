<script setup lang="ts">
import { handleUpdateUserInfo } from '@/service/UserService';
import type { PersonalInfo } from '@/types';
import { ref } from 'vue';
import NoticeModal from '@/components/dialog/NoticeModal.vue'
import { openSuccessNotice, openWarningNotice } from '@/utils/noticeUtils';

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
        openSuccessNotice('信息更改成功')
        emits('update:turn')
        return
    }
    const result = await handleUpdateUserInfo(info.value)
    console.log('更改code', result);

    if (result === 0) {
        if (props.personalInfo) {
            props.personalInfo.name = info.value.name
            props.personalInfo.briefIntroduction = info.value.briefIntroduction
        }
        openSuccessNotice('信息更改成功')
        emits('update:turn')
    } else if (result === 1) {
        openWarningNotice('用户名不能有空格')
    } else if (result === 2) {
        openWarningNotice('修改失败')
    } else {
        openWarningNotice('网络异常')
    }
}

</script>

<template>
    <main>
        <header>
            <h1>修改信息</h1>
        </header>
        <el-form label-position='right' label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="info.name"></el-input>
            </el-form-item>
            <el-form-item label="简介">
                <el-input type="textarea" v-model="info.briefIntroduction"></el-input>
            </el-form-item>

            <el-form-item class="form-buttons">
                <el-button type="primary" @click="save()">提交更改</el-button>
                <el-button @click="turn()">取消修改</el-button>
            </el-form-item>
        </el-form>
    </main>
</template>

<style scoped>
main {
  max-width: 800px;
  /* margin: 0 auto; */
  padding: 2rem;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.form-buttons :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 2rem;
    margin-left: 0 !important;
}
</style>
