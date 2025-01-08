const CompressionPlugin = require("compression-webpack-plugin");// gzip压缩
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require("html-webpack-plugin");



// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 生产环境下：开启Gzip预压缩
const gzipExtList = ['html', 'css', 'js']; // 需要Gzip压缩的文件白名单（可自定义）

function resolve(dir) {
    return path.join(__dirname, dir);
}
const timeStamp = new Date().getTime()

//cdn加速
let _this = this
let cdn = {
    js:[],
    css:[],
}
const isDev = process.env.NODE_ENV === 'development' || true
let externals = {

}
if(!isDev){
    externals = {
        vue:'Vue',
        echarts:'echarts',
        'vue-router':'VueRouter',
        'axios':'axios',
        // "core-js":
        // 'video.js':'videojs',
    }
    cdn = {
        js:[
            // 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/video.js/6.13.0/video.min.js'
            'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.runtime.esm.min.js',
            'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/5.3.0-rc.1/echarts.min.js',
            'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue-router/3.5.3/vue-router.esm.min.js',
            'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/axios/0.26.0/axios.min.js',


        ],
        css:[

        ],
    }
}

module.exports = {
    //部署应用包时的基本 URL
    publicPath:'/',
    //当运行 vue-cli-service build 时生成的生产环境构建文件的目录
    outputDir: 'dist',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    // 打包的时候不使用hash值.因为我们有时间戳来确定项目的唯一性了.
    filenameHashing: true,
    transpileDependencies: true,
    //是否使用包含运行时编译器的 Vue 构建版本。设置true后你就可以在使用template
    runtimeCompiler:false,
    productionSourceMap: false, // 生产环境下关闭源码地图，即不生产对应的map文件，减小打包结果的体积
    configureWebpack: { // 重点
        mode:process.env.NODE_ENV === 'production'?'production':'development',
        // externals:externals,
        // devtool:process.env.NODE_ENV === 'production'?'source-map':'',
        // 输出重构 打包编译后的js文件名称,添加时间戳.
        output: {
            filename: `js/[name].${timeStamp}.js`,
            chunkFilename: `js/chunk.[id].${timeStamp}.js`,
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
                views:resolve('src/views'),
            },
        },
        plugins:[
            new CompressionPlugin({ // 配置Gzip压缩的插件
                filename: "[path][base].gz", // 默认值
                algorithm: "gzip", // 默认值
                test: new RegExp(`.(${gzipExtList.join('|')})$`),
                threshold: 10240, // 只有体积大于 10KB 的资源会被处理（默认值为 0）
                minRatio: 0.8, // 默认值，只有压缩率优于 0.8 的资源才会被处理（Compressed Size / Original Size）
                deleteOriginalAssets: false // 是否删除原文件（默认值为 false）
            }),
            new UglifyJsPlugin(),
            new BundleAnalyzerPlugin()
        ],
    },

    chainWebpack(config){
        // if (!isDev) {
        //     config
        //         .plugin("html-app")
        //         .use(HtmlWebpackPlugin)
        //         .tap((args) => {
        //             console.log('args:',args)
        //             console.log('cdn:',cdn)
        //             args[0].cdn = cdn
        //             return args;
        //         });
        // }

        config.plugins.delete("prefetch").delete("preload")
    },
    // webpack-dev-server 相关配置
    devServer: {
        // host: 'localhost', //ip地址
        hot: true, //热加载
        open: false,   // 设置浏览器自动打开项目
        port: 8080,   // 设置端口
        https: false, //false关闭https，true为开启
        proxy: {      // 设置代理
            '/api': {
                // target: 'http://47.108.179.237:8080/',
                target: 'http://39.106.146.155/api/',
                changeOrigin: true, // 开启跨域
                pathRewrite: {
                    '/api': ''
                },
            }
        }
    },
    css: { //重点.
        extract: { // 打包后css文件名称添加时间戳
            filename: `css/[name].${timeStamp}.css`,
            chunkFilename: `css/chunk.[id].${timeStamp}.css`,
        },
    },
}

