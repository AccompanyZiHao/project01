/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  }
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1640080140425_3348';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        // 改为 false 安全性降低 注册接口可以不加 token
        enable: false, // https://eggjs.org/zh-cn/core/security.html#安全威胁csrf的防范
      },
    },
    mongoose: {
      client: {
        url: 'mongodb+srv://123456:zihao123456@cluster0.7sbsy.mongodb.net/ZHHUB?retryWrites=true&w=majority',
        options: {},
      },
    },
    jwt: {
      secret: '@git!123zh:',
    },
  };
};
