'use strict';
const svgCaptcha = require('svg-captcha');
const BaseController = require('./base')

class ustilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 30,
      noise: 3,
    })
    console.log('captcha.data :>> ', captcha.text);
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }
  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱' + email + '验证码:' + code)
    ctx.session.emailCode = code

    const subject = '白菘'
    const text = ''
    const html = `<h2>个人掘金地址</h2><a href="https://juejin.cn/user/2559318799689463/posts"><span>${code}</span></a>`
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }
}

module.exports = ustilController;
