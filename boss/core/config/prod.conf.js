require("../base/Constants");
const path = require("path");
const baseConf = require("./dev.conf.js");
const merge = require("webpack-merge");

module.exports = merge(baseConf, {
    NODE_ENV: global.ENV_PRODUCTION,

    DISCONF_HOST: "172.16.3.23",
    DISCONF_PORT: "80",

    SOURCE_MAP: true,
});