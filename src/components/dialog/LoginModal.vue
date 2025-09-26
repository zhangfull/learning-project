<script setup lang="ts">
import { ref, watch } from 'vue'
import { handleLogin, handleRegister } from '@/service/LoginService';
import type { LoginInfo, RegisterInfo } from '@/types';
import { checkPasswordStrength } from '@/utils/inspectionTool';
import { login_rules, register_rules } from '@/utils/validateRules';
import { openErrorNotice, openSuccessNotice } from '@/utils/noticeUtils';

const emit = defineEmits<{
  (e: 'update:showLogin'): void
  (e: 'loginSuccess'): void
}>();

function closeLoginDialog() {
  emit('update:showLogin')
};
const loginOrRegister = ref('login') // 'login' 或 'register'
const loginInfo = ref<LoginInfo>({ emailOrUid: '', password: '' });

const loginFormRef = ref()
const registerFormRef = ref()

const formLoading = ref(false)
async function login() {
  loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      openErrorNotice('登陆失败')
      return
    }
    formLoading.value = true
    const [success, message] = await handleLogin(loginInfo.value.emailOrUid, loginInfo.value.password);
    if (success) {
      emit('update:showLogin')
      emit('loginSuccess')
    } else {
      openErrorNotice(message)
    }
    formLoading.value = false
  })
}

const registerInfo = ref<RegisterInfo>({
  userName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

watch(() => registerInfo.value.password, () => {
  const strength = checkPasswordStrength(registerInfo.value.password)
  const hint = '密码强度：' + strength + '/6'
}), { deep: true }

async function register() {
  registerFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      openErrorNotice('注册失败')
      return
    }
    if (registerInfo.value.password !== registerInfo.value.confirmPassword) {
      openErrorNotice('两次输入的密码不一致')
      return
    }

    formLoading.value = true
    const result = await handleRegister(registerInfo.value);
    formLoading.value = false
    if (result === 1) {
      openErrorNotice('注册失败，邮箱已被使用')
      return
    } else if (result === 2) {
      openErrorNotice('网络错误，请重试')
      return
    }
    openSuccessNotice('注册成功')
    loginOrRegister.value = 'login'
  })
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay">
      <div class="login-box">
        <button @click="closeLoginDialog">关闭</button>
        <div v-if="loginOrRegister === 'login'">
          <ElForm :model="loginInfo" :rules="login_rules" ref="loginFormRef" label-width="100px">
            <ElFormItem label="邮箱或UID" prop="emailOrUid">
              <ElInput v-model="loginInfo.emailOrUid" placeholder="请输入邮箱或UID" />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput v-model="loginInfo.password" placeholder="请输入密码" />
            </ElFormItem>
            <ElButton type="primary" :loading="formLoading" @click="login">
              登陆
            </ElButton>
          </ElForm>
          <button @click="loginOrRegister = 'register'">注册</button>
        </div>
        <div v-else>
          <ElForm :model="registerInfo" :rules="register_rules" ref="registerFormRef" label-width="100px">
            <ElFormItem label="用户名" prop="userName">
              <ElInput v-model="registerInfo.userName" placeholder="请输入用户名" />
            </ElFormItem>
            <ElFormItem label="邮箱" prop="email">
              <ElInput v-model="registerInfo.email" placeholder="请输入邮箱" />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput v-model="registerInfo.password" placeholder="请输入密码" />
            </ElFormItem>
            <ElFormItem label="确认密码" prop="confirmPassword">
              <ElInput v-model="registerInfo.confirmPassword" placeholder="请输入确认密码" />
            </ElFormItem>
            <ElButton type="primary" :loading="formLoading" @click="register">
              注册
            </ElButton>
          </ElForm>
          <button @click="loginOrRegister = 'login'">已有账号？登录</button>
        </div>
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
