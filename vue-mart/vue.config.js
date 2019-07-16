module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  // mock数据
  configureWebpack: {
    devServer: {
      before(app) {

        // 中间件
        app.use(function (req, res, next) {
          // 检查token  只检验/api 开头的请求
          if (/^\/api/.test(req.path)) { // 之校验/api开头的请求
            if (req.path == '/api/login' || req.headers.token) {
              next();
            } else {
              res.sendStatus(401); // 错误状态提示用户需要登录
              // 拦截器进入error逻辑
            }
          } else {
            next();
          }
        })

        app.get('/api/login', function (req, res) {
          const { username, password } = req.query;
          if (username === 'jerry' && password === '123') {
            res.json({
              code: 0,
              token: 'jilei'
            })
          } else {
            res.json({
              code: -1,
              message: '用户名或密码错误'
            })
          }
        });

        app.get('/api/goods', function (req, res) {
          res.json({
            code: 0,
            list: [{ id: 1 }, { id: 2 }]
          })
        });

        app.get('/api/logout', function (req, res) {
          res.json({
            code: -1
          })
        });

      }
    }
  }
}
