<template>
  <div class="modal">
    <div class="modal-content">
      <p><slot/></p>
      <button @click="close">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/error';


function close() {
    const errorStore = useErrorStore()
    errorStore.clearError()
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
}
</style>
