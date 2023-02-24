"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = defaultSettings.title || "客户管理中心"; // page title

const isOnline = process.env.ENV === "production"; // 判断线上环境

const isBuild = process.env.ENV !== "serve"; // 判断 打包环境

console.log("build", isBuild);
console.log("线上", isOnline);

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9000; // dev port
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: true,
  productionSourceMap: !isOnline,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // https: true,
    disableHostCheck: true,
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        /**
         * @description: 测试环境
         * @param {*}
         * @return {*}
         */
        target: `http://dev.business.yeahmobi.com/`, // dev环境

        /**
         * @description: 线上
         */
        // target: `https://manage.yeahtargeter.com/`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: process.env.VUE_APP_BASE_API
        }
      }
    }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: config => {
    config.name = name;
    config.resolve.alias = {
      "@": resolve("src")
    };
    const plugins = [];
    if (isBuild) {
      plugins.push(
        new CompressionWebpackPlugin({
          // 需要压缩的文件正则
          test: /\.(js|css)(\?.*)?$/i,
          // 文件大小大于这个值时启用压缩
          threshold: 1024,
          // 压缩后保留原文件
          deleteOriginalAssets: false
        })
      );
    }
    return {
      plugins
    };
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import"@/styles/variables.scss";
          @import"@/styles/mixin.scss";
        `
      }
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.when(isBuild, config => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
