const path = require("path");

module.exports = {
    index: path.resolve(__dirname, "../dist/index.html"),
    assetRoot: path.resolve(__dirname, "../dist"),
    assetPublicPath: "/",
    assetsSubDirectory: "static",
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    bundleAnalyzerReport: false
};