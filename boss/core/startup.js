//系统配置
require("./base/Constants");
const Logger = require("./base/Logger");
const Config = require("./config");

//webpack配置
const webpack = require("webpack");
const chalk = require("chalk");
const webpackConfig = require("../build/webpack.dev.conf.js");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const historyFallback = require("connect-history-api-fallback");
const dispatcherMiddleware = require("./dispatcher-middleware");
const requestMiddleware = require("./request-middleware");
const cookie = require("cookie-parser");
require("./base");
//中间件
const opn = require("opn");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

let _resolve;
const readyPromise = new Promise(resolve => {
    _resolve = resolve
});
let app = null;
let server = null;


const startup = function(config) {
    const node_env = process.env.NODE_ENV;
    process.config = config;
    app = express();
    if(node_env == ENV_DEVELOPMENT) {
        buildHotMiddleWare(app, config);
    }

    //加载中间件
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.xml());
    app.use(cookie());
    app.use(historyFallback());

    app.use(session({
        secret: "boss_web",
        store: new RedisStore({
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            ttl: config.REDIS_TTL,
            logErrors: true
        }),
        cookie: 0,
        resave: true,
        saveUninitialized: false
    }));

    if(node_env == ENV_DEVELOPMENT) {
        app.use(express.static("static"));
        // app.use(config.STATIC_PATH, express.static("static"));
    }else {
        app.use(express.static("dist"));
    }

    app.use(dispatcherMiddleware.AuthzRealm);
    app.get(/.do$/, dispatcherMiddleware.controllerDispatcher);
    app.post(/.do$/, dispatcherMiddleware.controllerDispatcher);

    //加载全局工具类
    global.$RequestMapping = dispatcherMiddleware.addRouter;
    global.$Http = requestMiddleware;
    ActionContext.prototype.request = requestMiddleware.request;
    ActionContext.prototype.get = requestMiddleware.get;
    ActionContext.prototype.post = requestMiddleware.post;
    ActionContext.prototype.put = requestMiddleware.put;
    ActionContext.prototype.delete = requestMiddleware.delete;

    app.use(function(error, request, response, next) {
        console.log(error);
        if(error.status == null) {
            response.send(new Demand(error.status ? error.status : 100, error.message, error.stack));
        }else {
            next();
        }
    });

    //开始启动服务
    Logger.log(Logger.TYPE_LOG, "开始启动服务");
    //注册Controller
    dispatcherMiddleware.registerController(config.CONTROLLER_PATH);
    server = app.listen(config.NODE_PORT);
    if(node_env !== ENV_DEVELOPMENT) {
        Logger.log(Logger.TYPE_LOG, "服务启动成功");
    }
};

const buildHotMiddleWare = function(app, config) {
    //定义Server App
    const compiler = webpack(webpackConfig);

    //配置开发中间件
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true
    });

    //配置热部署中间件
    const hotMiddleware = webpackHotMiddleware(compiler, {
        log: false,
        heartbeat: 2000
    });

    //配置Webpack预编译插件
    compiler.plugin("compilation", function (compilation) {
        compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
            hotMiddleware.publish({action: "reload"});
            cb();
        })
    });

    app.use(devMiddleware);
    app.use(hotMiddleware);

    const uri = "http://localhost:" + config.NODE_PORT;
    devMiddleware.waitUntilValid(() => {
        //服务启动成功
        Logger.log(Logger.TYPE_LOG, "启动服务成功：" + uri);
        _resolve();
    });
};

Config.init(startup);

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
};