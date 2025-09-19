<script setup lang="ts">
import { handleFileDetail } from '@/service/FileService';
import type { DetailFile } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
let id = Number(route.params.id)
// 返回列表
function goBack() {
    router.push({ path: '/files', query: { from: 'detail' } })
}

const fileDetail = ref<DetailFile | null>(null);
onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    })
    handleFileDetail(id).then(detail => {
        fileDetail.value = detail;
    });
})
</script>
<template>
    <button @click="goBack()">返回列表</button>
    <div v-if="fileDetail">
        <h2>{{ fileDetail.name }}</h2>
        <p>{{ fileDetail.description }}</p>
        <p>大小: {{ fileDetail.size }} KB</p>
        <p>类型: {{ fileDetail.type }}</p>
        <p>上传时间: {{ fileDetail.uploadDate }}</p>
        <p>下载链接: <a :href="fileDetail.downloadUrl" target="_blank">{{ fileDetail.downloadUrl }}</a></p>
    </div>
    <div v-else>
        <p>加载中...</p>
    </div>
</template>

<style scoped></style>
