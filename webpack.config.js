// $ webpack

var webpack = require("webpack");

module.exports = {
	entry: './src/lifeGame/webpackMain.js',
	output: {
		filename: './dest/LifeCanvas.js'
	},
	module: {
		loaders: [
			// { test: /\.html$/, loader: 'html' }
		]
	},
	//	devtool: 'source-map',
	resolve : {
		root : "./src/",
		alias : {
			jquery : "lib/jquery-2.1.3.min",
		}
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		})
	]
};
