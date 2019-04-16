global.ENV_DEVELOPMENT = "DEVELOPMENT";
global.ENV_DEBUG = "DEBUG";
global.ENV_TEST = "TEST";
global.ENV_RELEASE = "RELEASE";
global.ENV_PRODUCTION = "PRODUCTION";
global.ENV_SHOW = "SHOW";
global.ENV_BUILD = "BUILD";

const Constants = {
    CONFIG_ITEMS: ["NODE_PORT", "REDIS_HOST", "REDIS_PORT", "REDIS_TTL", "GATEWAY_HOST", "WINSHOWS_API_COUPON","OSS_HOST"]
};

module.exports = Constants;