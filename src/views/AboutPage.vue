<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
function test1() {
  userStore.autoLogin()
}
</script>

<template>
  <button @click="test1">sss</button>
</template>

<style scoped>
</style>