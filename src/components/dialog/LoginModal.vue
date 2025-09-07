<script setup lang="ts">
import { ref } from 'vue'
import { handleLogin } from '@/service/LoginService';

const props = defineProps<{
  showLogin: boolean
}>();

const emit = defineEmits<{
  (e: 'update:showLogin', value: boolean): void
}>();

function closeLoginDialog() {
  emit('update:showLogin', false)
};

const email = ref('')
const password = ref('')
const hint = ref('')
async function login() {
  const [success, message] = await handleLogin(email.value, password.value);
  if (success) {
    hint.value = ''
    emit('update:showLogin', false)
  } else {
    hint.value = message
  }
}

</script>
<template>
  <Teleport to="body">
    <div v-if="props.showLogin" class="overlay">
      <div class="login-box">
        <button @click="closeLoginDialog">关闭</button>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="邮箱" required />
          <input v-model="password" type="password" placeholder="密码" required />
          <button type="submit">登录</button>
        </form>
        <p style="color: red;">{{ hint }}</p>
      </div>
    </div>
  </Teleport>
</template>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  /* 半透明黑背景 */
  backdrop-filter: blur(2px);
  /* 背景虚化 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9994;
}

.login-box {
  width: 480px;
  height: 80%;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  z-index: 9995;
  /* 高于 overlay */
}
</style>
