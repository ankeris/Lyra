let path = require('path');
const glob = require('glob');

module.exports = {
	mode: 'production', //add 'production' when deploy
	// watch: true,
	entry: {
		global: glob.sync('./public/js/manual/global/*.js'),
		index: glob.sync('./public/js/manual/index/*.js'),
		products: glob.sync('./public/js/manual/products/*.js'),
		product: glob.sync('./public/js/manual/product/*.js'),
		brand: glob.sync('./public/js/manual/brand/*.js')
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
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		]
	},
	resolve: {
		extensions: ['.jsx', '.js', '.json', '.less'],
		modules: [
			path.resolve(__dirname, 'node_modules'),
			'node_modules'
		],
		alias: {
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},
	optimization: {
		splitChunks: {
		 	cacheGroups: {
		  		vendor: {
		   			test: /node_modules/,
		   			chunks: 'initial',
		   			name: 'vendor',
		   			enforce: true
		  		}
			}
		} 
	}
};
