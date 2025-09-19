<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs';
import { ref } from 'vue';
import { Upload, Picture } from '@element-plus/icons-vue';
import { openErrorNotice, openSuccessNotice, openWarningNotice } from '@/utils/noticeUtils';
import { useUserStore } from '@/stores/user';
import { handleUploadAvatarImg } from '@/service/ImgService';

const imgRef = ref()
const imageSrc = ref('')
const fileInputRef = ref<HTMLInputElement>()
const userStore = useUserStore()
let cropper: Cropper;

function initCropper() {
  if (cropper) {
    cropper.destroy();
  }

  const option: Cropper.Options<HTMLImageElement> = {
    aspectRatio: 1,
    preview: "#preview",
    viewMode: 1,
    crop(_event: any) {
      // console.log(event.detail.x)
      // console.log(event.detail.y)
      // console.log(event.detail.width)
      // console.log(event.detail.height)
      // console.log(event.detail.rotate)
      // console.log(event.detail.scaleX)
      // console.log(event.detail.scaleY);
    }
  }
  cropper = new Cropper(imgRef.value, option);
}

const originalFileName = ref('')
function handleFileSelect(event: Event) {
  isUploading.value = false
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    openErrorNotice('请选择图片文件');
    return;
  }

  // 验证文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    openErrorNotice('图片大小不能超过5MB');
    return;
  }
  //保存原照片名
  originalFileName.value = file.name

  const reader = new FileReader();
  reader.onload = (e) => {                // 读取完成自动调取（回调函数）
    imageSrc.value = e.target?.result as string;
    // 给图片加载时间
    setTimeout(() => {                    //已经读取完成，给图片加载时间0.1s
      initCropper();
    }, 100);
  };
  reader.readAsDataURL(file);             //开始读取转化为Base64
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

const isUploading = ref(false)
function uploadCutFile() {
  if (!cropper) {
    openWarningNotice('请先选择图片')
    return;
  }
  cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' }).toBlob((blob: any) => {
    const file = new File([blob], originalFileName.value, { type: 'image/jpeg' })
    // console.log('裁剪后的文件:', file);
    isUploading.value = true
    setTimeout(async () => {                    //已经读取完成，给图片加载时间0.1s
      const result = await handleUploadAvatarImg(file);
      if (result === 0) {
        openSuccessNotice('上传成功！');
        userStore.avatarBase64 = URL.createObjectURL(file)
      } else {
        openErrorNotice("上传失败！")
      }
      isUploading.value = false
      
    }, 2000);
  }, 'image/jpeg', 0.9)
}

function back() {
  window.history.back()
}

</script>

<template>
  <main>
    <el-page-header @back="back" content="修改头像">
    </el-page-header>
    <!-- 文件上传区域 -->
    <div class="upload-area">
      <input ref="fileInputRef" type="file" accept="image/*" @change="handleFileSelect" style="display: none">
      <el-button type="primary" @click="triggerFileInput">
        <el-icon>
          <Upload />
        </el-icon>
        选择图片
      </el-button>
      <span v-if="!imageSrc" class="upload-tip">请选择一张图片进行裁剪并上传头像(最大5MB)</span>
    </div>

    <!-- 主要内容区域 -->
    <div v-if="imageSrc" class="main-content">
      <!-- 裁剪区域 -->
      <div class="cut-wrapper">
        <img ref="imgRef" :src="imageSrc">
      </div>

      <!-- 右侧区域 -->
      <div class="right-side">
        <!-- 预览 -->
        <div class="preview-container">
          <div class="preview-title">预览</div>
          <div class="preview" id="preview"></div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="uploadCutFile" :disabled="!imageSrc" v-if="!isUploading">
            上传头像
          </el-button>
          <el-icon class="is-loading" v-else>
            <p>上传中</p>
          </el-icon>
        </div>
      </div>
    </div>

    <div v-else class="placeholder">
      <el-icon>
        <Picture />
      </el-icon>
      <p>等待选择图片</p>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

:deep(.el-page-header) {
  align-self: flex-start;
  margin-left: 20px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.upload-tip {
  color: #909399;
  font-size: 14px;
}

.main-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.cut-wrapper {
  width: 500px;
  height: 500px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.cut-wrapper img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.right-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 60px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.preview {
  width: 150px;
  height: 150px;
  border: 2px dashed #409eff;
  overflow: hidden;
  border-radius: 50%;
  background-color: #f5f7fa;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.placeholder {
  width: 500px;
  height: 500px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
  background-color: #f5f7fa;
}

.placeholder .el-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.placeholder p {
  margin: 0;
  font-size: 16px;
}
</style>
