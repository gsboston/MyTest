require("../base/Constants");
const path = require("path");

module.exports = {
    APP: "boss_web",
    NODE_ENV: ENV_DEVELOPMENT,
    NODE_PORT: 8080,

    DISCONF_HOST: "123.56.220.249",
    DISCONF_PORT: "4040",

    REDIS_HOST: "192.168.200.107",
    REDIS_PORT: 6379,
    REDIS_TTL: 7200,

    GATEWAY_HOST: "boss.dev.12366.com",
    GATEWAY_METHOD: "POST",
    GATEWAY_HEADERS: {
        "Content-Type": "application/json; charset=UTF-8"
    },

    SOURCE_MAP: false,
    STATIC_PATH: "/static",
    CONTROLLER_PATH: path.resolve(__dirname, "../../controller"),

    //微营秀API地址,签约云使用优惠券
    WINSHOWS_API_COUPON: "http://winshows.cs.12366.com/api/rest/",
};