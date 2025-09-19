<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import LoginModal from '@/components/dialog/LoginModal.vue';
import { useUserStore } from '@/stores/user';
import ErrorModal from '@/components/dialog/ErrorModal.vue';
import { useErrorStore } from './stores/error';
import NoticeModal from '@/components/dialog/NoticeModal.vue';

const errorStore = useErrorStore()
const notice = ref<string | boolean>(false)
const userName = ref('')
const avatarBase64 = ref('')
const isLogin = ref(false)
const userStore = useUserStore()

const loginShow = ref(false)
function openLogin() {
  console.log("点击了登录")
  loginShow.value = true
}

function handleLoginSuccess() {
  console.log("主动登录成功")
  isLogin.value = true
  userName.value = userStore.userName
  avatarBase64.value = userStore.avatarBase64
}
// 监听用户头像信息实时更改导航信息
watch(
  () => userStore.avatarBase64,
  () => {
    avatarBase64.value = userStore.avatarBase64
  }
);

onMounted(async () => {
  const success = await userStore.autoLogin()
  if (success) {
    userName.value = userStore.userName
    isLogin.value = true
    avatarBase64.value = userStore.avatarBase64
    console.log("用户已登录，用户名：" + userStore.userName)
    return
  }
  console.log("用户未登录")
  isLogin.value = false
});

</script>

<template>
  <!-- 主容器 -->
  <div class="box">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="logo">MyApp</div>
      <nav class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/files">列表</router-link>
        <router-link to="/upload" v-if="isLogin">上传</router-link>
        <router-link to="/about">关于</router-link>
        <a href="#" v-if="!isLogin" @click.prevent="openLogin">登录</a>
      </nav>
      <div class="user-section" v-if="isLogin">
        <router-link to="/individual" class="special-link"><img class="avatar" :src=avatarBase64 alt="用户头像"
            exact-active-class="active" /></router-link>
      </div>
    </header>
    <RouterView />

    <!-- 测试部分
    <div>
      <h1>{{ test_value }}</h1>
      <button @click="test">测试</button>
      <button @click="throwError">抛出错误</button>
      <button @click="notice = '这是一个新的公告！'">显示公告</button>
    </div> -->
  </div>
  <!-- 错误提示窗口 -->
  <ErrorModal v-if="errorStore.message">{{ errorStore.message }}</ErrorModal>
  <!-- 公告窗口 -->
  <NoticeModal v-if="notice" @update:show="() => notice = false">{{ notice }}</NoticeModal>
  <!-- 登陆弹窗 -->
  <LoginModal v-if="loginShow" @update:showLogin="() => loginShow = false" @loginSuccess="handleLoginSuccess" />
</template>

<style scoped>
.box {
  width: 100%;
  min-height: calc(100vh - 120px);
  margin-top: 60px;
  background-color: white;
  box-sizing: border-box;
  /* 确保padding包含在宽度内 */
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
  margin-left: auto;
  /* 自动推到右侧 */
  padding-right: 40px;
}


.nav-links a,
.nav-links .router-link-active {
  color: #000000;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-links a.special-link,
.nav-links .router-link-active.special-link,
.nav-links .router-link-exact-active.special-link {
  color: #829c24;
  padding: 0 8px;
}

.nav-links a:hover,
.nav-links .router-link-active:hover,
.nav-links .router-link-exact-active:hover {
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

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.user-section {
  display: flex;
  margin-right: 50px;
  align-items: center;
  height: 100%;
}

.nav-links .router-link-exact-active {
  color: #9f584d;
  font-weight: bold;
}
</style>
