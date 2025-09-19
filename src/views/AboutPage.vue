<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs';
import Bg from '/1.jpg'

import { onMounted, ref } from 'vue';

const imgRef = ref()

function handleAvatarSuccess(res: any, file: any) {
  imgRef.value = URL.createObjectURL(file.raw);
}

let cropper: Cropper;
function initCopper() {
  const option: Cropper.Options<HTMLImageElement> = {
    aspectRatio: 1,
    preview: "#preview",
    viewMode: 1,
    crop(envent: any) {
      // console.log(envent.detail.x)
      // console.log(envent.detail.y)
      // console.log(envent.detail.width)
      // console.log(envent.detail.height)
      // console.log(envent.detail.rotate)
      // console.log(envent.detail.scaleX)
      // console.log(envent.detail.scaleY);
    }
  }
  cropper = new Cropper(imgRef.value, option);
}

function getCutFile() {
  cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' }).toBlob((blob: any) => {
    const file = new File([blob], 'cut.jpg')
    console.log(file);
  })
}

function beforeAvatarUpload(file: any) {
  console.log("检测");
  
}

onMounted(() => {
  initCopper()
})
</script>

<template>


  <div class="container">
    <div class="cut-wrapper">
      <img ref="imgRef" :src="Bg">
    </div>
  </div>
  <!-- 预览 -->
  <div class="preview" id="preview"></div>
  <el-button @click="getCutFile">获取裁剪文件</el-button>
</template>

<style scoped>
.cut-wrapper {
  width: 500px;
  height: 500px;
  /* overflow: hidden; */
}

.cut-wrapper img {
  display: block;
  max-width: 100%;
}

.preview {
  width: 150px;
  height: 150px;
  border: 1px dashed black;
  overflow: hidden;
  margin-top: 10px;
  border-radius: 50%;
}
</style>