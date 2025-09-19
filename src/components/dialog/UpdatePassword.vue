<script setup lang="ts">
import { handleUpdateUserPassword } from '@/service/UserService';
import { checkPasswordStrength } from '@/utils/inspectionTool';
import { reactive, ref, watch } from 'vue';
import { openSuccessNotice, openWarningNotice } from '@/utils/noticeUtils';
import 'element-plus/dist/index.css'

const emits = defineEmits<{
    (e: 'update:close'): void
}>()

const pw = reactive<{
    oldPassword: string
    newPassword: string
    confirmPassword: string
}>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const strength = ref(0)
watch(() => pw.newPassword, () => {
    strength.value = checkPasswordStrength(pw.newPassword)
    
}), { deep: true }

const validateOldPassword = (_rule: any, value: string) => {
    if (!value) throw new Error('请输入密码');
    if (value.length < 6) throw new Error('密码长度不能小于6位');
    if (value.length > 20) throw new Error('密码长度不能大于20位');
}

const validateNewPassword = async (_rule: any, value: string) => {
    if (!value) throw new Error('请输入新密码')
    if (value.length < 6) throw new Error('密码长度不能小于6位')
}

// 确认密码验证
const validateConfirmPassword = async (_rule: any, value: string) => {
    if (value !== pw.newPassword) throw new Error('两次输入的密码不一致')
}

const rules = {
    oldPassword: [
        { validator: validateOldPassword, trigger: 'blur' }
    ],
    newPassword: [
        { validator: validateNewPassword, trigger: 'blur' }
    ],
    confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
};

async function submitForm() {
    const result = await handleUpdateUserPassword(pw.oldPassword, pw.newPassword)
    if (result === 0) {
        openSuccessNotice('修改成功')
        emits('update:close')

    } else if (result === 1) {
        openWarningNotice('原密码错误')
    }
}

function resetForm() {
    pw.confirmPassword = ''
    pw.newPassword = ''
    pw.oldPassword = ''
}

function back() {
    emits('update:close')
}
</script>

<template>
    <Teleport to="body">
        <div class="overlay">
            <div class="update-box">
                <el-page-header @back="back" content="修改密码">
                </el-page-header>
                <el-form :model="pw" status-icon label-position="left" :rules="rules" label-width="100px" class="update-form">
                    <el-form-item label="原密码" prop="oldPassword">
                        <el-input type="password" v-model="pw.oldPassword" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="password" v-model="pw.newPassword" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input type="password" v-model="pw.confirmPassword" autocomplete="off"
                            show-password></el-input>
                    </el-form-item>

                    <el-form-item class="form-buttons">
                        <el-button type="primary" @click="submitForm()">提交</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                    
                </el-form>
                <el-progress 
                  :percentage="strength * 20" 
                  :format="() => '当前密码强度: ' + strength + '/5'"
                  :stroke-width="20"
                  :text-inside="true"
                  style="width: 80%; margin-top: 20px;">
                </el-progress>
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
    z-index: 9900;
}

.update-box {
    width: 480px;
    height: 50%;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    z-index: 9995;
    position: relative;
    /* 添加相对定位 */

    display: flex;
    /* 开启 flex 布局 */
    justify-content: center;
    /* 水平居中 */
    flex-direction: column;
    /* 垂直方向上正常排列子元素 */
    align-items: center;
    /* 可选：垂直方向居中 */
    padding: 20px;
    /* 内边距美观 */
    box-sizing: border-box;
}

.update-box .el-page-header {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
}


.update-form {
    width: 80%;
    /* 最大宽度 400px，避免太宽 */
    margin: 20px auto;
    /* 水平居中 */
}

.form-buttons :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
    margin-left: 0 !important;
}

.form-buttons .el-button {
    margin: 0 16px;
}
</style>
