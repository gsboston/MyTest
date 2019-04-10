+config   项目配置
    config.dev.js   开发环境配置
    config.prod.js  生产环境配置 path.resolve 定义数据库和http相关配置
    index.js        判断环境提供配置 根据process.env.LOGNAME判断环境，读取配置

+libs     项目公用模块
    database.js     创建数据库链接模块，读取数据库链接配置，创建链接池
    http.js         创建http服务，区分请求，获取参数，调用路由
    router.js       定义路由模块，提供添加和查找路由方法

+routers  路由声明
    add.js          exports数据操作函数
    del.js          。。。
    list.js         。。。
    index.js        定义路由，require“数据操作函数”

+static   静态文件
    -css
    -js
    -upload
    index.html      项目页面

server.js           入口文件