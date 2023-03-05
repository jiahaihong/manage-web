"use strict";
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const url = 'https://www.fastmock.site/mock/552fac5cc88f27249bff9351eeca2683/api'
const name = "客户管理中心"; // page title

// const isBuild = process.env.NODE_ENV === "production"; // 判断 打包环境
const isBuild = true; // 判断 打包环境
module.exports = {
  publicPath: "/",
  // eslint校验
  lintOnSave: false,
  productionSourceMap: false,
  // 配置转发代理
  devServer: {
    proxy: {
      '/auth': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/code': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/code': '/code'
        }
      },
      '/gen': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/gen': '/gen'
        }
      },
      '/member': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/member': '/member'
        }
      },
      '/wechat': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/wechat': '/wechat'
        }
      },
      '/logistics': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/logistics': '/logistics'
        }
      },
      '/iot': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/iot': '/iot'
        }
      }
    }
  },
  configureWebpack: config => {
    config.name = name;
    config.resolve.alias = {
      "@": resolve("src")
    };
    // 拆包
    const optimization = {
      splitChunks: {
        chunks: "all",
        // maxInitialRequests: Infinity,
        // minSize: 300000, // 依赖包超过300000bit将被单独打包
        automaticNameDelimiter: "-",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // 只打包初始时依赖的第三方
          },
          elementUI: {
            name: "chunk-ant-design-vue", // 单独将 elementUI 拆包
            priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
          }
        }
      }
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
      externals: {
        "BMap": "BMap"
      },
      optimization,
      plugins
    };
  }
}
