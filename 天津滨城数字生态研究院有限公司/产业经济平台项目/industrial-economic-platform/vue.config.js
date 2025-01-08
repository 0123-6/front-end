const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');// gzip压缩
const TerserPlugin = require('terser-webpack-plugin');
const zlib = require('zlib');
const { defineConfig } = require('@vue/cli-service');

const gzipExtList = ['html', 'css', 'js', 'svg']; // 需要Gzip压缩的文件白名单（可自定义）

function resolve(dir) {
  return path.join(__dirname, dir);
}

const timeStamp = new Date().getTime();
const isProd = process.env.NODE_ENV === 'production';

let webpackPlugin = [];
if (isProd) {
  webpackPlugin = [
    // new CompressionPlugin({ // 配置Gzip压缩的插件
    //   filename: '[path][base].gz', // 默认值
    //   algorithm: 'gzip', // 默认值
    //   test: new RegExp(`.(${gzipExtList.join('|')})$`),
    //   threshold: 10240, // 只有体积大于 10KB 的资源会被处理（默认值为 0）
    //   minRatio: 0.8, // 默认值，只有压缩率优于 0.8 的资源才会被处理（Compressed Size / Original Size）
    //   deleteOriginalAssets: false // 是否删除原文件（默认值为 false）
    // }),
    // new CompressionPlugin({
    //   filename: '[path][base].br',
    //   algorithm: 'brotliCompress',
    //   test: /\.(js|css|html|svg)$/,
    //   compressionOptions: {
    //     params: {
    //       [zlib.constants.BROTLI_PARAM_QUALITY]: 11
    //     }
    //   },
    //   threshold: 10240,
    //   minRatio: 0.8
    // }),
    // new TerserPlugin({
    //   terserOptions: {
    //     compress: {
    //       pure_funcs: ['console.log']
    //     }
    //   }
    // }),
    // new BundleAnalyzerPlugin()
  ];
}

module.exports = defineConfig({
  transpileDependencies: true,
  // 解析svg相关
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  },
  // 部署应用包时的基本 URL
  publicPath: '/',
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
  // template 为dev环境打包
  outputDir: 'platform',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 打包的时候不使用hash值.因为我们有时间戳来确定项目的唯一性了.
  filenameHashing: true,
  // 是否使用包含运行时编译器的 Vue 构建版本。设置true后你就可以在使用template
  runtimeCompiler: false,
  productionSourceMap: false, // 生产环境下关闭源码地图，即不生产对应的map文件，减小打包结果的体积
  configureWebpack: {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    // 输出重构 打包编译后的js文件名称,添加时间戳.
    output: {
      filename: `js/[name].${timeStamp}.js`,
      chunkFilename: `js/chunk.[id].${timeStamp}.js`
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        '~': process.cwd(),
        public: resolve('public'),
        components: resolve('src/components'),
        util: resolve('src/utils'),
        store: resolve('src/store'),
        router: resolve('src/router'),
        views: resolve('src/views')
      }
    },
    plugins: webpackPlugin
  },
  css: { // 重点.
    extract: { // 打包后css文件名称添加时间戳
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/chunk.[id].${timeStamp}.css`
    }
  },
  devServer: {
    client: {
      overlay: false
    },
    allowedHosts: [
      'economy-local.zhishu-tech.com',
      'chat.zhishu-tech.com'
    ],
    proxy: { // 设置代理
      '/api': {
        // target: 'http://192.168.2.114:2020',
        target: 'http://121.37.133.215:80', // test
        // target: 'http://dev-economy.zhishu-tech.com', // dev
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/adminApi': {
        // target: 'http://192.168.2.114:2020',
        target: 'http://dev-economy.zhishu-tech.com/admin',
        changeOrigin: true,
        pathRewrite: {
          '^/adminApi': ''
        }
      },
      '/pythonApi': {
        target: 'http://economy-pyapi.zhishu-tech.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/pythonApi': ''
        },
      },
    }
  }
});
