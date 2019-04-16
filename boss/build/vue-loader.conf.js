require("../core/base/Constants");
const utils = require("./utils");
const config = require("../core/config");
const isProduction = (process.env.NODE_ENV !== ENV_DEVELOPMENT);

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: isProduction ? config.PRODUCTION.SOURCE_MAP : config.DEVELOPMENT.SOURCE_MAP,
        extract: isProduction
    }),
    transformToRequire: {
        video: "src",
        source: "src",
        img: "src",
        image: "xlink:href"
    }
};
