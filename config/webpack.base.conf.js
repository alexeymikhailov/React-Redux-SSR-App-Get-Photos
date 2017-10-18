const webpack=require('webpack');
const path=require('path');

const config={
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: /node_modules/
			}
		]
	},

	resolve: {
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules'
		],
		extensions: ['.js', '.jsx', '.css']
	},

	plugins: [
		new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop')
	],

	performance: {
		hints: process.env.NODE_ENV === 'production' ? true : false
	}
};

module.exports=config;