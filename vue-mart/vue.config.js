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
        })
      }
    }
  }
}
