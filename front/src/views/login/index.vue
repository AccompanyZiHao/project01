<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="loginDom"
    class="loginForm"
    label-width="80px"
    :inline="false"
  >
    <el-form-item label="邮箱" prop="email">
      <el-col :span="11">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="用户名">
      <el-col :span="11">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="验证码" prop="captcha">
      <el-col :span="11">
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-col>
      <img :src="captchaUrl" alt="" @click="resetCaptcha" />
    </el-form-item>
    <el-form-item prop="emailCode" label="验证码">
    <el-col :span="11">
      <el-input v-model="form.emailCode" placeholder="请输入邮件验证码"></el-input>
      </el-col>
      <el-button @click="sendEmailCode(form.email)" :disabled="timer > 0 " type='primary'>{{sendEmailBtnText}}</el-button>
    </el-form-item>
    <el-form-item label="密码" prop="password">
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
  import { defineComponent, ref, reactive, computed } from 'vue'
  import http from '@/util/http'
  import md5 from 'md5'
  import { rules } from '@/views/register/rules'
  import { ElMessage } from 'element-plus'
  import emailCode from './emailCode';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    setup(props) {
      const state = reactive({
        form: {
          userName: '',
          email: '',
          password: '',
          captcha: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ],
          captcha: [{ required: true, message: '请输入验证码' }],
          emailCode:[
            { required:false, message:"请输入邮箱验证码" },
          ],
          password: [{ required: true, pattern: /^[\w_-]{6,12}$/g, message: '请输入6~12位密码' }]
        }
      })

      const loginDom: any = ref('')
      state.rules = rules(state.form, true)

      let captchaUrl = ref('')
      const resetCaptcha = () => {
        captchaUrl.value = `/api/captcha?_t=${+new Date()}`
      }
      resetCaptcha()

      const router = useRouter();
      const loginHandler = () => {
        loginDom.value.validate(async (valid: any) => {
          if (valid) {
            const {
              code,
              data
            } = await http.post('/api/user/login', {
              ...state.form,
              password: md5(state.form.password)
            })
            if (code === 0) {
              localStorage.setItem('token', data.token)
              router.push({ path: '/userCenter' });
              ElMessage.success('登录成功')
            }
          } else {
            console.log('校验失败')
          }
        })
      }


      return {
        ...state,
        resetCaptcha,
        captchaUrl,
        loginDom,
        loginHandler,
        ...emailCode
      }
    }
  })
</script>

<style></style>
