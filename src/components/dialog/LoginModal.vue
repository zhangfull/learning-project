<script setup lang="ts">
import { ref, watch } from 'vue'
import { handleLogin, handleRegister } from '@/service/LoginService';
import type { RegisterInfo } from '@/types';
import { checkPasswordStrength } from '@/utils/inspectionTool';

const emit = defineEmits<{
  (e: 'update:showLogin', value: boolean): void
  (e: 'loginSuccess'): void
}>();

function closeLoginDialog() {
  emit('update:showLogin', false)
};
const loginOrRegister = ref('login') // 'login' 或 'register'
const emailOrUid = ref('')
const password = ref('')
const hint = ref('')
async function login() {
  const [success, message] = await handleLogin(emailOrUid.value, password.value);
  if (success) {
    hint.value = ''
    emit('update:showLogin', false)
    emit('loginSuccess')
  } else {
    hint.value = message
  }
}

const registerInfo = ref<RegisterInfo>({
  userName: '',
  email: '',
  password: '',
  confirmPassword: ''
})
watch(() => registerInfo.value.password, () => {
  const strength = checkPasswordStrength(registerInfo.value.password)
    hint.value = '密码强度：'+strength+'/6'
}), {deep: true}
async function register() {
  if (registerInfo.value.password !== registerInfo.value.confirmPassword) {
    hint.value = '两次输入的密码不一致'
    return
  }
  if (registerInfo.value.password.length < 6) {
    hint.value = '密码长度至少为6位'
    return
  }
  const result = await handleRegister(registerInfo.value);
  if (result === 1) {
    hint.value = '注册失败，邮箱已被使用'
    return
  } else if (result === 2) {
    hint.value = '注册失败，网络错误'
    return
  }
  hint.value = '注册成功，请登录'
  loginOrRegister.value = 'login'
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay">
      <div class="login-box">
        <button @click="closeLoginDialog">关闭</button>
        <div v-if="loginOrRegister === 'login'">
          <form @submit.prevent="login">
            <input v-model="emailOrUid" type="text" placeholder="邮箱或UID" required />
            <input v-model="password" type="password" placeholder="密码" required />
            <button type="submit">登录</button>
          </form>
          <button @click="loginOrRegister = 'register'">注册</button>
        </div>
        <div v-else>
          <form @submit.prevent="register">
            <input v-model="registerInfo.userName" type="text" placeholder="用户名" required />
            <input v-model="registerInfo.email" type="email" placeholder="邮箱" required />
            <input v-model="registerInfo.password" type="password" placeholder="密码" required />
            <input v-model="registerInfo.confirmPassword" type="password" placeholder="确认密码" required />
            <button type="submit">注册</button>
          </form>
          <button @click="loginOrRegister = 'login'">已有账号？登录</button>
        </div>
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
