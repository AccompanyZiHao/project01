'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/test', controller.home.index);
  // 验证码
  router.get('/captcha', controller.util.captcha);
  router.get('/login', controller.user.login);
};
