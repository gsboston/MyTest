var zookeeper = require("node-zookeeper-client");
var zookeeperConfig = process.config.zookeeperConfig;

var zookeeperClient = {};

zookeeperClient.init = function() {
    var _client = this._client = zookeeper.createClient(zookeeperConfig.address);

    _client.once("connected", function() {
        _client.getChildren("/", function (error, children, stats) {
            if(error) {
                console.log(error.stack);
                return;
            }
            _client.children = children;
            console.log("children are: %j.", children);
        });
    });

    _client.connect();
    return this;
};

module.exports = zookeeperClient;