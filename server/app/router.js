'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app })
  console.log('app.middleware => ', app.middleware);
  router.get('/', controller.home.index);
  router.get('/test', controller.home.index);
  // 验证码
  router.get('/captcha', controller.util.captcha);
  router.get('/sendCode', controller.util.sendcode);

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { register, login, info } = controller.user
    router.post('/register', register)
    router.post('/login', login)

    router.post('/info', jwt, info)

  })

};
