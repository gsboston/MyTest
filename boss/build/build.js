//系统配置
require("../core/base/Constants");
const config = require("./build.conf");
process.env.NODE_ENV = ENV_BUILD;

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("./webpack.prod.conf");

const spinner = ora("building for production...");
spinner.start();
let startTime = new Date().getTime();

rm(path.join(config.assetRoot, config.assetsSubDirectory), error => {
    if (error) {
        throw error;
    }
    webpack(webpackConfig, function (err, stats) {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + "\n\n");

        console.log(chalk.cyan("  Build complete.\n"));
        console.log(chalk.yellow(
            "  Tip: built files are meant to be served over an HTTP server.\n" +
            "  Opening index.html over file:// won\"t work.\n"
        ));

        let endTime = new Date().getTime();
        let costTime = Math.floor((endTime - startTime) / 1000);
        console.log("build project cost", costTime, "s");
    })
});
