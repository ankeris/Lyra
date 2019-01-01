let path = require('path');
const glob = require('glob');

module.exports = {
	mode: 'development', //add 'production' when deploy
	// watch: true,
	entry: {
		global: glob.sync('./public/js/manual/global/*.js'),
		index: glob.sync('./public/js/manual/index/*.js'),
		products: glob.sync('./public/js/manual/products/*.js'),
		product: glob.sync('./public/js/manual/product/*.js')
	},
	output: {
		path: path.resolve('./public/js/', 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
		  {
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
			  loader: 'babel-loader',
			  options: {
				presets: ['@babel/preset-env']
			  }
			}
		  }
		]
	  }
};