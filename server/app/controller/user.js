const md5 = require('md5')
const BaseController = require('./base')

const HashSalt = ':zh@good!@123'

const createRule = {
  email: { type: 'email' },
  userName: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
}
class userController extends BaseController {
  async login() {
    const { ctx } = this;
    ctx.body = 'is login ';
  }
  async register() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch ({ error }) {
      this.error('参数校验失败', -1, error)
    }

    const { email, userName, password, captcha } = ctx.request.body
    console.log('get params === ', email, userName, password, captcha);
    // 校验验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    if (await this.checkEmail(email)) {
      this.error('邮箱重复啦')
    } else {
      const ret = await ctx.model.User.create({
        email,
        userName,
        passwd: md5(password + HashSalt),
      })
      if (ret._id) {
        this.message('注册成功')
      }
    }
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }
  async verify() {
    // 2
  }
  async info() {
    // 2
  }
}

module.exports = userController;
