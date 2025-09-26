<script setup lang="ts">
import FilesList from '@/components/FilesList.vue';
import { onMounted, ref } from 'vue';

const id = ref<number>(0);
const pageInfo = ref({
  y: 0,
  pageIndex: 0,
  isD: false,
  id: 0
})

onMounted(() => {
  const jsonStr = localStorage.getItem('pageInfo') || '{}';
  const parsed = JSON.parse(jsonStr);
  pageInfo.value = parsed;
  if (pageInfo.value.pageIndex !== 0 && pageInfo.value.pageIndex !== null && pageInfo.value.pageIndex !== undefined) {
    console.log("有列表信息缓存");
    if (pageInfo.value.isD) {
      console.log("这是详情");
      id.value = pageInfo.value.id;
    } else {
      localStorage.removeItem('pageInfo');
      console.log("这不是是详情");
    }
  } else {
    console.log("无列表信息缓存");
  }
});
</script>

<template>
  <FilesList />
</template>

<style scoped></style>
