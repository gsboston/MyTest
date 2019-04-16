const fs = require("fs");

$RequestMapping("/portal/menu/collection/save.do", function(menuId) {
    this.post({
        url: "/portal-api/users/saveUserMenu/" + menuId
    }).then(() => {
        this._collectMenu(menuId, true);
        this.send();
    });
});

$RequestMapping("/portal/menu/collection/remove.do", function(menuId) {
    this.delete({
        url: "/portal-api/users/deleteUserMenu/" + menuId
    }).then(() => {
        this._collectMenu(menuId, false);
        this.send();
    });
});

$RequestMapping("/portal/getEnv.do", function() {
    let env = process.config.NODE_ENV;
    let envName = null;
    switch (env) {
        case ENV_DEVELOPMENT:
            envName = "开发环境";
            break;
        case ENV_DEBUG:
            envName = "联调环境";
            break;
        case ENV_TEST:
            envName = "测试环境";
            break;
        case ENV_RELEASE:
            var version = fs.readFileSync(__dirname + "/../../../app.version", "utf-8");
            envName = "预发布 " + version;
            break;
        case ENV_SHOW:
            var version = fs.readFileSync(__dirname + "/../../../app.version", "utf-8");
            envName = "演示 " + version;
            break;
        case ENV_PRODUCTION:
            var version = fs.readFileSync(__dirname + "/../../../app.version", "utf-8");
            envName = "V" + version;
            break;
    }
    this.send({
        env: env,
        envName: envName
    });
}, {
    isAuth: false
});