const md5 = require('md5')
const jwt = require('jsonwebtoken')
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
    const { ctx, app } = this
    const { email, captcha, password, emailcode } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }

    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误')
    }

    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(password + HashSalt),
    })
    if (!user) {
      return this.error('用户名密码错误')
    }

    // 用户的信息加密成token 返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '100h',
    })
    this.success({ token, email, nickname: user.nickname })
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
