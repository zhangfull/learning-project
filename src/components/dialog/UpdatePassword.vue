<script setup lang="ts">
import { handleUpdateUserPassword } from '@/service/UserService';
import { checkPasswordStrength } from '@/utils/inspectionTool';
import { ref, watch } from 'vue';
import NoticeModal from '@/components/dialog/NoticeModal.vue'

const emits = defineEmits<{
    (e: 'update:close'): void
}>()

const pw = ref<{
    oldPassword: string
    newPassword: string
    confirmPassword: string
}>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const notice = ref<string | boolean>(false)
const hint = ref('')
watch(() => pw.value.newPassword, () => {
    const strength = checkPasswordStrength(pw.value.newPassword)
    hint.value = '密码强度：' + strength + '/6'
}), { deep: true }

const submit = async (): Promise<void> => {
    if (pw.value.newPassword.includes(" ")) {
        hint.value = '密码不能含空格'
        return
    }
    if (pw.value.newPassword !== pw.value.confirmPassword) {
        hint.value = '两次输入的更改密码不同'
        return
    }
    if (pw.value.newPassword.length < 6) {
        hint.value = '密码长度至少为6位'
        return
    }
    const result = await handleUpdateUserPassword(pw.value.oldPassword, pw.value.newPassword)
    if (result === 1) {
        hint.value = '原密码错误'
        return
    }
    if (result === 0) {
        if (result === 0) {
            notice.value = '修改成功'
        }
    }
}

function closeNotice() {
    notice.value = false;
    emits('update:close')
}
</script>

<template>
    <Teleport to="body">

        <div class="overlay">
            <div class="update-box">
                <h1>密码更改</h1>
                <label>原密码</label>
                <input v-model="pw.oldPassword" type="password" placeholder="原密码" />
                <label>新密码</label>
                <input v-model="pw.newPassword" type="password" placeholder="新密码" />
                <label>确认新密码</label>
                <input v-model="pw.confirmPassword" type="password" placeholder="确认新密码" />
                <button @click="submit">确认修改</button>

                <a href="#" @click="">忘记密码</a>
                <button @click="emits('update:close')">取消</button>
                <p style="color: red;">{{ hint }}</p>
            </div>
        </div>
    </Teleport>
    <NoticeModal v-if="notice" @update:show="closeNotice">{{ notice }}</NoticeModal>
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
    z-index: 9900;
}

.update-box {
    width: 480px;
    height: 80%;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    z-index: 9995;
    /* 高于 overlay */
}
</style>