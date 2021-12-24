<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="registerDom"
    class="loginForm"
    label-width="80px"
    :inline="false"
  >
    <el-form-item label="用户名" prop="email">
      <el-col :span="11">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="用户名" prop="userName">
      <el-col :span="11">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="验证码" prop="captcha">
      <el-col :span="11">
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-col>
      <img :src="captchaUrl" alt="" @click="resetCaptcha"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-col :span="11">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="确认密码" prop="rePassword">
      <el-col :span="11">
        <el-input type="password" v-model="form.rePassword" placeholder="请再次输入密码"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="22">
        <el-button type="primary" @click="registerHandler">注册</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import http from '@/util/http'
  import { rules } from './rules'
  import md5 from 'md5'
  import { useRouter } from 'vue-router'
  export default defineComponent({
    name: 'register',
    setup(props) {
      const state = reactive({
        form: {
          userName: '',
          email: '',
          password: '',
          rePassword: '',
          captcha: ''
        },
        rules: {},
      })

      const registerDom: any = ref('')
      state.rules = rules(state.form, true)

      const router = useRouter()
      const registerHandler = () => {
        registerDom.value.validate(async (valid: any) => {
          if (valid) {
            console.log(111, 'success')
            const { data } = await http.post('/api/user/register', {
              ...state.form,
              password: md5(state.form.password)
            })
            console.log('data,', data)
            // router
          } else {
            console.log('校验失败')
          }
        })
      }

      let captchaUrl = ref('')
      const resetCaptcha = () =>{
        captchaUrl.value = `/api/captcha?_t=${+new Date()}`
      }
      resetCaptcha()

      return {
        ...state,
        registerDom,
        captchaUrl,
        registerHandler,
        resetCaptcha
      }
    }
  })
</script>
