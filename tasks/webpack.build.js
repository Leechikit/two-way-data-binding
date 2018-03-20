var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('./config').default;
var publicPath = config.publicPath;
var outputPath = config.outputPath;

var buildConf = {
    //插件项
    plugins: [
        //生成独立样式文件
        new ExtractTextPlugin("css/[name].bundle.css")
    ],
    //页面入口文件配置
    entry: getEntry(),
    //入口文件输出配置
    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].js',
        path: path.join(__dirname, outputPath),
        publicPath: publicPath
    },
    module: {
        //加载器配置
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: 'tasks/postcss.config.js'
                            }
                        }
                    },
                    'sass-loader'
                ]
            })
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    fallback: 'file-loader',                    
                    name: '[name].[ext]?[hash:8]',
                    outputPath: 'image/'
                }
            }]
        }, {
            test: /\.(html)$/,
            use: [{
                loader: 'html-loader',
                options: {
                    attrs: ['img:src']
                }
            }]
        }, {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-2'],
                    plugins: ['transform-runtime']
                }
            }]
        }]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['.js', '.json', '.scss'],
        alias: config.alias
    },
    externals: config.global,
};

function getEntry() {
    var jsPath = path.resolve('src');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve('src', item);
        }
    });
    return files;
}

function getViews() {
    var jsPath = path.resolve('src', 'html');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.html$/);
        if (matchs) {
            files[matchs[1]] = path.resolve('src', 'html', item);
        }
    });
    return files;
}

var pages = Object.keys(getViews());
pages.forEach(function (pathname) {
    var conf = {
        filename: 'html/' + pathname + '.html',
        template: 'src/html/' + pathname + '.html'
    }
    if (pathname in buildConf.entry) {
        conf.chunks = [pathname];
        conf.hash = true;
    }
    //生成独立html文件
    buildConf.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = buildConf;