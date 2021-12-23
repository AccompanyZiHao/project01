export const rules = (form, isRegister: boolean = false) => {
  return {
    email: [{ required: isRegister, message: '请输入邮箱' }],
    userName: [{ required: true, message: '请输入用户昵称' }],
    captcha: [{ required: true, message: '请输入验证码' }],
    password: [{ required: true, pattern: /^[\w_-]{6,12}$/g, message: '请输入6~12位密码' }],
    rePassword: [
      { required: isRegister, message: '请再次输入密码' },
      {
        validator: (rule, value, callback) => {
          if (value !== form.password) {
            callback(new Error('两次密码不一致'))
          }
          callback()
        }
      }
    ]
  }
}
