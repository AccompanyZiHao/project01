# server



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

****
### 项目记录
插件
```
egg-router-group 路由分组
egg-mongoose 数据库
egg-validate 校验
md5 加密
jsonwebtoken jwt
```

简单的接口规范
```
{
  code:0,
  data:{

  },
  message:
  <!-- errors: 具体的报错信息 -->
}
code 0 是成功 其他都是失败
-1 是错误
-666 登录状态过期
```

规范 controller/base
配置插件 config/plugins

配置启动服务过程报错
`spawn tail ENOENT`
应该是我中途切换了 node 版本，在换回 14.0.0 版本后正常

配置邮箱的过程中踩坑

126邮箱不支持直接使用账户密码登录，如果我们要使用SMTP需要网页登录到126邮箱后台 设置 中设置开启 SMTP功能并配置相应授权码。
然后在代码中 使用授权码替换邮箱密码 使用nodemailer进行邮件操作。

auth: {
  type: 'login',
  user: 'xxxxx@126.com',
  pass: 'xxxxx'    // 如果开启了客户端授权码，则这里需要填写客户端授权码
},