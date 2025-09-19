<template>
  <div class="modal">
    <div class="modal-content">
      <h2>提示</h2>
      <p><slot/></p>
      <button @click="close">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:show']);
function close() {
  emit('update:show');
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
  z-index: 9996;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  z-index: 9997;
}
</style>
