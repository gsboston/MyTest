var path = require("path");
var utils = require("./utils");
var config = require("./build.conf");
var vueLoaderConfig = require("./vue-loader.conf");

function resolve(dir) {
    return path.join(__dirname, "..", dir)
}

module.exports = {
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: config.assetRoot,
        filename: "[name].js",
        publicPath: config.assetPublicPath
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            "vue$": "vue/dist/vue.esm.js",
            "@": resolve("src")
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader",
            options: vueLoaderConfig
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            include: [resolve("src"), resolve("node_modules/iview/src"), resolve("core/base")]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: "url-loader",
            options: {
                limit: 10000,
                name: utils.assetsPath("img/[name].[hash:7].[ext]")
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: "url-loader",
            options: {
                limit: 10000,
                name: utils.assetsPath("media/[name].[hash:7].[ext]")
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: "url-loader",
            options: {
                limit: 10000,
                name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
            }
        }]
    }
};
