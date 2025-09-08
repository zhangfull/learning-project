<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LoginModal from '@/components/dialog/LoginModal.vue';
import { useUserStore } from '@/stores/user';
import ErrorModal from '@/components/dialog/ErrorModal.vue';
import { useErrorStore } from './stores/error';
import NoticeModal from '@/components/dialog/NoticeModal.vue';
import { handleAutoLogin } from './service/LoginService';
import { ListFormat } from 'typescript';
import type { UserInfo } from './types';

const errorStore = useErrorStore();
const notice = ref<string | boolean>(false);
const userName = ref('');
const isLogin = ref(false);
const userStore = useUserStore();

const loginShow = ref(false);
function openLogin() {
  console.log("点击了登录");
  loginShow.value = true;
}

function handleLoginSuccess() {
  console.log("主动登录成功");
  isLogin.value = true;
  userName.value = userStore.username;
}

onMounted(async () => {
  //notice.value = "欢迎使用我们的应用！";
  userStore.loadTokenFromStorage();
  if (userStore.token) {
    // 自动登录
    userStore.loadUserFromStorage();
    if (userStore.isLogin === false) {
      const [result, message] = await handleAutoLogin(userStore.token);
      if (result) {
        console.log(`自动登录成功，用户名：${userName.value}`);
      } else {
        userStore.logout();
        throw new Error(message);
      }
      console.log(`用户已登录，用户名：${userName.value}`);
    } else {
      console.log("用户已登录，无需自动登录");
    }
    userName.value = userStore.username;
    isLogin.value = true;
  } else {
    console.log("用户未登录");
  }
});

// 测试部分
const test_value = ref<string | null>('');
function test() {
  const userStore = useUserStore();
  if (userStore.token) {
    test_value.value = userStore.token;
  } else {
    userStore.loadTokenFromStorage();
    test_value.value = userStore.token;
  }
  console.log(test_value.value);
}
const throwError = () => {
  throw new Error('这是一个测试错误');
}

</script>

<template>
  <!-- 主容器 -->
  <div class="box">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="logo">MyApp</div>
      <nav class="nav-links">
        <a href="/">首页</a>
        <a href="/files">列表</a>
        <a href="/upload">上传</a>
        <a href="#" v-if="isLogin">{{ userName }}</a>
        <a href="#" v-else @click.prevent="openLogin">登录</a>
        <a href="#">关于</a>
      </nav>
    </header>
    <!-- 错误提示窗口 -->
    <ErrorModal v-if="errorStore.message">{{ errorStore.message }}</ErrorModal>
    <!-- 公告窗口 -->
    <NoticeModal v-if="notice" @update:show="val => notice = val">{{ notice }}</NoticeModal>
    <!-- 登陆弹窗 -->
    <LoginModal v-if="loginShow" :showLogin="loginShow" @update:showLogin="val => loginShow = val"
      @loginSuccess="handleLoginSuccess" />

    <RouterView />

    <!-- 测试部分 -->
    <div>
      <h1>{{ test_value }}</h1>
      <button @click="test">测试</button>
      <button @click="throwError">抛出错误</button>
      <button @click="notice = '这是一个新的公告！'">显示公告</button>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 100%;
  height: 100vh;
  margin-top: 60px;
  background-color: white;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #c1ddfa;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  box-sizing: border-box;
  /* 确保padding包含在宽度内 */
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 24px;
  /* 减小间距 */
  padding-right: 0;
  /* 移除右侧padding，使用flex布局控制 */
  justify-content: flex-end;
  margin-right: 96px;
  /* 控制整体离右边 24px */
}

.nav-links a {
  color: #000000;
  text-decoration: none;
  font-size: 16px;
}

.nav-links a:hover {
  color: #1abc9c;
}

.actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #1abc9c;
  color: #fff;
  transition: 0.3s;
}

.actions button:hover {
  background: #16a085;
}
</style>
