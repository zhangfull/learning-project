<script setup lang="ts">
import { handleFileDetail } from '@/service/FileService';
import type { DetailFile } from '@/types';
import { onMounted, ref } from 'vue';


const props = defineProps<{
    id: number
}>();
const emit = defineEmits(['update:is']);
// 返回列表
function goBack() {
    const pageInfo = ref({
        y: 0,
        pageIndex: 0,
        isD: false
    })
    const jsonStr1 = localStorage.getItem('pageInfo') || 'null';
    if (jsonStr1 !== 'null') {
        const parsed = JSON.parse(jsonStr1);
        pageInfo.value = parsed;
        pageInfo.value.isD = false;
        const jsonStr2 = JSON.stringify(pageInfo.value);
        localStorage.setItem('pageInfo', jsonStr2);
    }
    emit('update:is', false);
}
    
const fileDetail = ref<DetailFile | null>(null);
onMounted(() => {
    handleFileDetail(props.id).then(detail => {
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
