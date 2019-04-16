const Constants = require("../base/Constants");
require("../base/ObjectExtend");
const Logger = require("../base/Logger");
const disconf = require("node-disconf-client");

const Config = {
    DEVELOPMENT: require("./dev.conf"),
    DEBUG: require("./debug.conf"),
    TEST: require("./test.conf"),
    RELEASE: require("./release.conf"),
    PRODUCTION: require("./prod.conf"),
    SHOW: require("./show.conf"),

    DIST_FILE: __dirname + "/disconf.properties",
    USER_DEFINE_DOWNLOAD_DIR: __dirname + "/download",
    APP: "boss_web",
    VERSION: "1.0"
};


Config.getDisconfEnv = function(env) {
    if(env == ENV_DEVELOPMENT) {
        return "local";
    }else if(env == ENV_DEBUG) {
        return "rd";
    }else if(env == ENV_TEST) {
        return "qa";
    }else if(env == ENV_RELEASE) {
        return "online";
    }else if(env == ENV_PRODUCTION) {
        return "product";
    }else if(env == ENV_SHOW) {
        return "show";
    }
};

Config.init = function(callback) {
    let node_env = process.env.NODE_ENV;
    let config = Config[node_env];
    if(Object.isNull(config)) {
        Logger.log(Logger.TYPE_LOG, "启动失败：没有找到配置文件");
        return;
    }

    Logger.log(Logger.TYPE_LOG, "开始读取DISCONF配置");
    disconf.init(null, {
        dist_file: Config.DIST_FILE,
        user_define_download_dir: Config.USER_DEFINE_DOWNLOAD_DIR,
        conf_item_name: Constants.CONFIG_ITEMS.join(","),
        conf_server_host: config.DISCONF_HOST + ":" + config.DISCONF_PORT,
        app: Config.APP,
        version: Config.VERSION,
        env: Config.getDisconfEnv(node_env),
    });

    disconf.on("ready", function(data) {
        Logger.log(Logger.TYPE_LOG, "读取DISCONF配置成功");
        config = Object.assign({}, config, data);
        console.log(config);
        callback(config);
    });

    disconf.on("error", function(error) {
        Logger.log(Logger.TYPE_LOG, "启动失败：读取DISCONF配置失败" + error);
    });

    disconf.on("change", function(event, data) {
        console.log("change", "event", event);
        console.log("change", "data", data);
    });
};

module.exports = Config;
