<template>
  <h1>用戶中心</h1>
  <i class="el-icon-loading"></i>
  <div ref="drag" id="drag">
    <input type="file" name="file" @change="handleFileChange" />
  </div>
  <div>
    <el-button @click="uploadFile">上传</el-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import http from '@/util/http'
  export default defineComponent({
    setup(props) {
      http.post('/api/user/info', {})

      let file = ref('')
      const handleFileChange = (e) => {
        // 上传多个文件这里获取有点问题，只能上传单个的
        const files = e.target.files[0]
        console.log('files :>> ', files);
        if (!files) return
        file.value = files
      }

      const uploadFile = () => {
        const form = new FormData()
        form.append('name', 'file')
        form.append('files', file.value)
        http.post('api/uploadFile', form)
      }

      return {
        file,
        handleFileChange,
        uploadFile
      }
    }
  })
</script>
