const common = require("./webpack.common.config.js");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:12].js",
  },
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    runtimeChunk: "single",
    splitChunks: {
      // this is first technique to split code
      //   cacheGroups: {
      //     jquery: {
      //       test: /[\\/]node_modules[\\/]jquery[\\/]/,
      //       chunks: "initial",
      //       name: "jquery",
      //     },
      //     bootstrap: {
      //       test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
      //       chunks: "initial",
      //       name: "bootstrap",
      //     },
      //   },

      // this is second technique to split the code
      //   chunks: "all",
      //   maxSize: 140000,
      //   minSize: 50000,
      //   name(module, chunks, cacheGroupKey) {
      //     const pathSeparator = module.identifier().includes("\\") ? "\\" : "/";
      //     const filePathAsArray = module.identifier().split(pathSeparator);
      //     return filePathAsArray[filePathAsArray.length - 1];
      //   },

      // This is third approch to split the code
      //   chunks: "all",
      //   maxSize: Infinity,
      //   minSize: 0,
      //   cacheGroups: {
      //     node_modules: {
      //       test: /[\\/]node_modules[\\/]/,
      //       //name: "node_modules",
      //       name(module) {
      //         const packageName = module.context.match(
      //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
      //         )[1];
      //         return packageName;
      //       },
      //     },
      //   },

      // Create own strategy for code splitting
      chunks: "all",
      maxSize: Infinity,
      minSize: 2000,
      cacheGroups: {
        // jquery: {
        //   test: /[\\/]node_modules[\\/]jquery[\\/]/,
        //   name: "jquery",
        //   priority: 2,
        // },
        // bootstrap: {
        //   test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
        //   name: "bootstrap",
        // },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
          name: "lodash-es",
          priority: 2,
        },
        node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: "node_modules",
          chunks: "initial",
        },
        async: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "async",
          name(module, chunks) {
            return chunks.map((chunk) => chunk.name).join("-");
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10 kb
          },
        },
        generator: {
          filename: "./images/[name].[contenthash:12][ext]",
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                quality: 40,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:12].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, {
        nodir: true,
      }),
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css)$/,
    }),
  ],
});
