require("../base/Constants");
const path = require("path");
const baseConf = require("./dev.conf.js");
const merge = require("webpack-merge");

module.exports = merge(baseConf, {
    NODE_ENV: global.ENV_DEBUG,

    DISCONF_HOST: "10.2.0.1",
    DISCONF_PORT: "4040",

    SOURCE_MAP: true,
});