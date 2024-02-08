const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const config = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    clean: true, // this is used for cleaning dist folder before create bundle.
    // clean: {
    //   // dry: true, // it help in let us now which file will remove
    //   keep: /\.css/,
    // },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/template.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "images/motivational-pictures/*.*",
        },
      ],
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        path.join(process.cwd(), "build/**/*"), // this for cleaning build folder
      ],
    }),
  ],
};

module.exports = config;
