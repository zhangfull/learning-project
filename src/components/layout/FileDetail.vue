<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    id: number
}>();
const emit = defineEmits(['update:is']);

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
        pageInfo.value.isD = false
        const jsonStr2 = JSON.stringify(pageInfo.value);
        localStorage.setItem('pageInfo', jsonStr2);
    }
    emit('update:is', false);

}


</script>

<template>
    <h1>文件详情页!!!!{{ props.id }}</h1>
    <button @click="goBack()">返回</button>
</template>

<style scoped></style>
