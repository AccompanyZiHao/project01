'use strict';
const svgCaptcha = require('svg-captcha');
const Controller = require('egg').Controller;

class ustilController extends Controller {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 30,
      noise: 3,
    })
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }
}

module.exports = ustilController;
