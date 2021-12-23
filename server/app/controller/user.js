'use strict';

const Controller = require('egg').Controller;

class userController extends Controller {
  async login() {
    const { ctx } = this;
    ctx.body = 'is login ';
  }
}

module.exports = userController;
