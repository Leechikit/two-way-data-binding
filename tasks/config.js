/*
 *  配置参数
 */
exports.default = {
	//文件别名配置
	alias: {

	},
	//全局引入模块配置
	global: {
		'jquery': 'window.jQuery',
		'hiido_yylive_v3': 'window.hiido_yylive_v3',
		'yyApiUtil': 'window.yyApiUtil',
		'jweixin': 'window.wx'
	},
	//端口
	port: 2333,
	//静态资源地址
	publicPath: '//web.yystatic.com/project/two-way-data-binding/mobile/',
	//项目输出地址
	outputPath: '../dist/'
}

