const common = require("./webpack.common.config.js");
// this is for merging 2 or mor config files
const { merge } = require("webpack-merge");
const path = require("path");
module.exports = merge(common, {
  output: {
    filename: "bundle.js",
  },
  mode: "development",
  devServer: {
    port: 9000,
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    devMiddleware: {
      index: "index.html",
      writeToDisk: true,
    },
    client: {
      overlay: true,
    },
    liveReload: false,
  },
  // this is CSS loader to bundle CSS or style related files
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
});
