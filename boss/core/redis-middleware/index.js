let redis = require("redis");
let redisConfig = process.config.redisConfig;
let client = redis.createClient(redisConfig);

client.on("ready", function(error) {
    if(!error) {
        console.log("连接Redis成功：" + redisConfig.host + ":" + redisConfig.port);
    }
});

client.on("error", function(error) {
    console.log("连接Redis失败：" + error);
});

const RedisMiddleware = new Object();

RedisMiddleware.set = client.set;

RedisMiddleware.hset = client.hset;

RedisMiddleware.hkeys = client.hkeys;

module.exports = RedisMiddleware;