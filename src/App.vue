<script setup lang="ts">
import { ref } from 'vue';
import LoginModal from '@/components/dialog/LoginModal.vue';
import { useUserStore } from '@/stores/user';
import ErrorModal from '@/components/dialog/ErrorModal.vue';
import { useErrorStore } from './stores/error';

const errorStore = useErrorStore()

const loginShow = ref(false);
function openLogin() {
  console.log("点击了登录");
  loginShow.value = true;
}


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
  throw new Error('这是一个测试错误')
}
</script>

<template>
  <!-- 主容器 -->
  <div class="box">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="logo">MyApp</div>
      <nav class="nav-links">
        <a href="#">首页</a>
        <a href="#">产品</a>
        <a href="#">服务</a>
        <a href="#">关于我们</a>
        <a href="#" @click.prevent="openLogin">登录</a>
      </nav>
    </header>
    <!-- 错误提示窗口 -->
    <ErrorModal v-if="errorStore.message">{{ errorStore.message }}</ErrorModal>
    <!-- 登陆弹窗 -->
    <div v-if="loginShow">
      <LoginModal :showLogin="loginShow" @update:showLogin="val => loginShow = val" />
    </div>
    
    <!-- 测试部分 -->
    <div>
      <h1>{{ test_value }}</h1>
      <button @click="test">测试</button>
      <button @click="throwError">抛出错误</button>
    </div>


    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
    <h1>sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h1>
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
