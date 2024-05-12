<script setup>
import { ref } from 'vue'
import Message from "@/components/Message";

const props = defineProps(['onChange'])

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileList = ref([])

function fileChange(e) {
  let file = e.target.files[0]
  if (!file) return false
  // 清空之后，方便继续添加图片。
  e.target.value = null
  // 判断文件大小和类型
  if (!allowedTypes.includes(file.type)) {
    Message.error({
      content: '只能上传格式为jpg、png、jpeg的图片文件',
      duration: 3000,
    })
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    Message.error({
      content: '单张图片大小控制在5M以内',
      duration: 3000,
    })
    return false
  }
  let fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = () => {
    fileList.value.push({
      id: Date.now(),
      base64: fr.result,
      file: file
    })
    if (props.onChange) {
      props.onChange(fileList.value)
    }
  }
}

function deleteHandler(file) {
  fileList.value = fileList.value.filter((item) => item.id != file.id)
  if (props.onChange) {
    props.onChange(fileList.value)
  }
}

const previewFile = ref()
const previewOpen = ref(false)
function previewHandler(file) {
  previewFile.value = file
  previewOpen.value = true
}
function closePreview() {
  previewFile.value = null
  previewOpen.value = false
}

// 清空文件，暴露给父组件
function clearFiles() {
  fileList.value = []
}
defineExpose({
  clearFiles
})

</script>

<template>
  <div class="upload-container">
    <div class="item-box-wrap">
      <div class="upload-item-box" v-for="file in fileList">
        <img class="preview" :src="file.base64" />
        <div class="cover">
          <a href="#" @click.prevent="previewHandler(file)"
            ><img src="@/assets/images/icons/eye.svg" width="17" height="16"
          /></a>
          <a href="#" @click.prevent="deleteHandler(file)"
            ><img src="@/assets/images/icons/delete.svg" width="21" height="20"
          /></a>
        </div>
      </div>
      <div class="upload-item-add" v-show="fileList.length < 3">
        <label class="custom-file-upload">
          <input type="file" name="file" @change="fileChange" />
          <img src="@/assets/images/icons/plus.svg" width="25" height="24" alt="Plus Icon" />
          <span>Upload</span>
        </label>
      </div>
      <div class="upload-notice">
        请上传有效期内的护照、身份证、驾照。格式为jpg、png、jpeg. 单张图片大小控制在5M以内.
      </div>
    </div>
  </div>
  <div class="preview-modal-container" v-if="previewOpen">
    <div class="modal-content">
      <div class="head">
        <span class="name">{{ previewFile.file.name }}</span>
        <span class="close" @click="closePreview">X</span>
      </div>
      <div class="content">
        <img :src="previewFile.base64" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-container {
}
.item-box-wrap {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.custom-file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  input {
    display: none;
  }
  img {
  }
  span {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.5);
  }
}
.upload-item-box {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px;
  .preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .cover {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
  &:hover {
    .cover {
      display: flex;
    }
  }
}
.upload-item-add {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  label {
    cursor: pointer;
  }
}
.upload-notice {
  width: 200px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
}

.preview-modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.modal-content {
  position: relative;
  z-index: 1000;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  .head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .name {
      color: #000;
    }
    .close {
      color: #555;
      font-size: 1.8rem;
      cursor: pointer;
    }
  }
  .content {
    img {
      width: 100%;
    }
  }
}
</style>
