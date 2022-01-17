<template>
  <!-- <h1>用戶中心</h1> -->
  <i class="el-icon-loading"></i>
  <div ref="dragDom" id="drag">
    <input type="file" name="file" @change="handleFileChange" />
  </div>
  <div>
    <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
  </div>
  <div>
    <el-progress :stroke-width="20" :text-inside="true" :percentage="hashProgress"></el-progress>
  </div>
  <div>
    <el-button @click="uploadFile">上传</el-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import http from '@/util/http'
  import { bindEvents, upload } from './upload'
  export default defineComponent({
    setup(props) {
      http.post('/api/user/info', {})

      const dragDom = ref(null)
      onMounted(() => {
        bindEvents(dragDom, upload().file)
      })

      return {
        dragDom,
        ...upload()
      }
    }
  })
</script>
<style scoped>
  #drag {
    height: 100px;
    line-height: 100px;
    border: 2px dashed #eee;
    text-align: center;
  }
</style>
