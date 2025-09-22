<script setup lang="ts">
import type { PersonalInfo } from '@/types';
import { useUserStore } from '@/stores/user';
import UpdatePassword from '../dialog/UpdatePassword.vue';
import { ref, watch } from 'vue';

const userStore = useUserStore();
const props = defineProps<{
  personalInfo: PersonalInfo | null
}>()
const emits = defineEmits<{
  (e: 'update:turn'): void
}>()

function edit() {
  emits('update:turn')
}
const isUpdatePassWord = ref(false)
function logout() {
  userStore.logout();
  window.location.replace('/')
}
const avatarBase64 = ref(userStore.avatarBase64)
watch(() => userStore.avatarBase64, () => {
  avatarBase64.value = userStore.avatarBase64
})
</script>

<template>
  <main>
    <header>
      <h1>用户信息</h1>
    </header>
    <section>
      <h2>基本信息</h2>
      <dl>
        <dt>头像</dt>
        <dd>
          <el-avatar shape="square" :size="100" fit="cover" :src="avatarBase64"></el-avatar>
          <router-link to="/individual/update-avatar" style="color: cadetblue;">点击更换</router-link>
          
        </dd>
        <dt>用户名</dt>
        <dd>{{ props.personalInfo?.name }}</dd>
        <dt>UID</dt>
        <dd>{{ props.personalInfo?.uid }}</dd>
        <dt>邮箱</dt>
        <dd>{{ props.personalInfo?.email }}</dd>
        <dt>注册日期</dt>
        <dd>{{ props.personalInfo?.registrationDate }}</dd>
        <dt>关注数量</dt>
        <dd>{{ props.personalInfo?.myFollowersCount }}</dd>
        <dt>粉丝数量</dt>
        <dd>{{ props.personalInfo?.followersCount }}</dd>
        <dt>简介</dt>
        <dd>{{ props.personalInfo?.briefIntroduction }}</dd>
      </dl>
    </section>
    <section class="buttons-section">
      <el-button @click="edit" type="info" plain>编辑信息</el-button>
      <el-button type="warning" plain @click="isUpdatePassWord = true">修改密码</el-button>
      <el-button type="danger" plain @click="logout">退出登录</el-button>
    </section>
    <UpdatePassword v-if="isUpdatePassWord" @update:close="() => isUpdatePassWord = false" />
  </main>
</template>

<style scoped>
main {
  max-width: 80%;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

section {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

section h2 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

dl {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.75rem;
  margin: 0;
}

dt {
  font-weight: 600;
  color: #7f8c8d;
  text-align: right;
  padding: 0.5rem 0;
}

dd {
  margin: 0;
  padding: 0.5rem 0;
  color: #2c3e50;
  word-break: break-word;
}

.buttons-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  main {
    padding: 1rem;
  }

  dl {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  dt {
    text-align: left;
    padding-bottom: 0.25rem;
  }

  dd {
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;
  }

  .buttons-section {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    width: 100%;
  }
}

/* 空数据样式 */
dd:empty::before {
  content: "暂无信息";
  color: #bdc3c7;
  font-style: italic;
}
</style>
