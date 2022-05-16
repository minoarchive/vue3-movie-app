const { VueLoaderPlugin } = require('vue-loader');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, options) => {
	console.log(env, options);
	return {
		resolve: {
			extensions: ['.js', '.vue'],
			alias: {
				'~': `${__dirname}/src`,
			},
		},
		entry: './src/main.js',
		// entry: { main: './src/main.js' },
		output: {
			// path: `${__dirname}/dist`,
			// filename: '[name].js',
			publicPath: '/',
			clean: true,
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.vue$/,
					use: 'vue-loader',
				},
				{
					test: /\.s?css$/,
					use: [
						'vue-style-loader',
						'css-loader',
						'postcss-loader',
						{
							loader: 'sass-loader',
							options: {
								additionalData: `
                  @import "~/scss/main";`,
							},
						},
					],
				},
				// https://webpack.kr/guides/asset-modules/
				{
					test: /\.(png|jpe?g|svg|gif|webp)/,
					type: 'asset/resource',
				},
			],
		},
		plugins: [
			new HtmlPlugin({
				template: './src/index.html',
			}),
			new CopyPlugin({
				patterns: [{ from: 'static' }],
			}),
			new VueLoaderPlugin(),
			new Dotenv(),
		],

		// 개발 서버 옵션
		devServer: {
			host: 'localhost',
			port: 8079,
			hot: true,
		},
	};
};
