<script setup lang="ts">
import FileDetail from '@/components/layout/FileDetail.vue';
import FilesList from '@/components/layout/FilesList.vue';
import { onMounted, ref } from 'vue';

const isDetail = ref(false);
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

      isDetail.value = true;
      id.value = pageInfo.value.id;
    } else {
      isDetail.value = false;
      localStorage.removeItem('pageInfo');
      console.log("这不是是详情");
    }
  } else {
    console.log("无列表信息缓存");
    isDetail.value = false;
  }
});
</script>

<template>
  <FilesList v-if="!isDetail" v-model:s="isDetail" v-model:id="id" />
  <FileDetail v-if="isDetail" :id="id" v-model:is="isDetail"/>
</template>

<style scoped></style>
