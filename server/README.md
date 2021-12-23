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
