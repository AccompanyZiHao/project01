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
    const { email, captcha, password, emailCode } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }

    if (emailCode !== ctx.session.emailCode) {
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
      expiresIn: '10h',
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
    const { ctx } = this
    const { email } = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
    // 这里需要获取用户信息 但是我们暂时不知道是哪个用户
    // 需要根据用户的 token 来判断
  }
}

module.exports = userController;
