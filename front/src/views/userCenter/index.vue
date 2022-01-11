<template>
  <div>
    用戶中心
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/util/http'
export default defineComponent({
  setup(props) {
    http.post('/api/user/info', {  })
  }
})
</script>