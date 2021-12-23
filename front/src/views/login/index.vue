<template>
  <el-form :model="form" :rules="rules" class="loginForm" label-width="80px" :inline="false">
    <el-form-item label="用户名">
      <el-col :span="11">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="验证码">
      <el-col :span="11">
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-col>
      <img :src="captchaUrl" alt="" />
    </el-form-item>
    <el-form-item label="密码">
      <el-col :span="11">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="22">
        <el-button type="primary" @click="loginHandler">登录</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue'
  import http from '@/util/http';
  export default defineComponent({
    setup(props) {
      const state = reactive({
        form: {
          userName: '',
          password: '',
          captcha: ''
        },
        rules: {},
        captchaUrl: ''
      })

      const loginHandler = () => {
        console.log(112)
        http.get('/api/login').then(res => {
          console.log(111, res)
        })
      }
      state.captchaUrl = `/api/captcha?_t=${+new Date()}`

      return {
        ...state,
        loginHandler
      }
    }
  })
</script>

<style></style>
