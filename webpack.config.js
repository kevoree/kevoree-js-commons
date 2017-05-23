'use strict';

var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');

var config = {
	entry: path.resolve(pkg.main),
	output: {
		filename: path.join('browser', pkg.name + '.js'),
		library: 'KevoreeCommons',
		libraryTarget: 'umd'
	},
	plugins: [],
	devServer: {
		contentBase: path.join(__dirname),
		watchContentBase: true,
		compress: true,
		hot: true,
		overlay: {
			warnings: true,
			errors: true
		}
	}
};

if (process.env.NODE_ENV !== 'production') {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.devtool = 'eval';
}

module.exports = config;
