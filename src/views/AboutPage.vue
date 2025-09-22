<script setup lang="ts">
import { ref } from 'vue';

interface InputItem {
  id: number;
  value: string;
}

// 动态组件数组
const inputList = ref<InputItem[]>([]);

// 用于生成唯一 id
let counter = 0;

// 点击按钮添加一个新的输入框
function addInput() {
  counter++;
  inputList.value.push({
    id: counter,
    value: ''
  });
}
</script>

<template>
  <div>
    <button @click="addInput">添加输入框</button>

    <div v-for="item in inputList" :key="item.id" style="margin-top: 10px;">
      <input type="text" v-model="item.value" placeholder="请输入内容" />
    </div>
  </div>
</template>

<style scoped>
button {
  margin-bottom: 15px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
