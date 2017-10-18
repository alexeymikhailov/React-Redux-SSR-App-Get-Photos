const webpack=require('webpack');
const path=require('path');
const merge=require('webpack-merge');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const baseWebpackConfig=require('./webpack.base.conf');

const vendorsOutputName='vendors.js';

const devClientConfig=merge(baseWebpackConfig, {
	devtool: 'inline-source-map',
	
	name: 'client',

  	target: 'web',

	entry: {
		bundle: [
			'babel-polyfill',
	    	'react-hot-loader/patch',
	    	'webpack-hot-middleware/client',
	    	'./client/client.js'
		],
		vendor: [
			'react',
			'redux',
			'react-router-redux',
			'react-dom',
			'react-router-dom'
		]
	},
  
	output: {
    	path: path.join(__dirname, 'static'),
    	filename: 'client.js',
    	chunkFilename: '[name].js',
    	publicPath: '/'
  	},

  	module: {
	    rules: baseWebpackConfig.module.rules.concat([
	    	{
		        test: /\.css$/,
		        use: [
		        	{
		            	loader: 'style-loader'
		          	},

		          	{
		            	loader: 'css-loader',
		            	options: {
							importLoaders: 1,
							minimize: false,
							sourceMap: true,
							discardComments: {
	      						removeAll: true
	    					}
						}
		          	},

		          	{
		          		loader: 'postcss-loader',
		          		options: {
		          			sourceMap: 'inline',
		          			plugins: () => {
		          				return [
		          					require('postcss-reporter'),
		          					require('css-mqpacker')({
		          						sort: true
		          					}),
		          					require('autoprefixer')({
		          						browsers: [
		          							'last 2 versions',
            								'ie >= 11'
		          						]
		          					})
		          				];
		          			}
		          		}
		          	}
		        ]  
	    	},

			{
				test: /\.(jpe?g|png|svg)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[hash].[ext]',
							limit: 10000
						}
					}
				]
			},

			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'application/font-woff'
						}
					}
				]
			},

			{
  				test: /\.(eot|ttf)$/,
  				use: [
    				{
      					loader: 'raw-loader'
    				},
    				
				    {
				      	loader: 'ignore-loader'
				    }
				]
			}
	    ])
  	},

  	plugins: baseWebpackConfig.plugins.concat([
  		new webpack.optimize.ModuleConcatenationPlugin(),

  		new HtmlWebpackPlugin({
    		title: 'React-Redux-SSR Application Get Photos',
      		filename: 'template.html',
      		favicon: './src/img/favicon.png',
      		inject: 'body',
      		template: './server/template.html',
      		minify: {
				collapseInlineTagWhitespace: true,
				collapseWhitespace: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true
			}
    	}),

    	new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),

  		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: vendorsOutputName
		}),

    	new webpack.HotModuleReplacementPlugin()
  	])
});

const devServerConfig=merge(baseWebpackConfig, {
	devtool: 'inline-source-map',

	name: 'server',
  
  	target: 'node',

  	entry: './server/server.js',

  	output: {
    	path: path.join(__dirname, 'static'),
    	filename: 'server.js',
    	chunkFilename: '[name].js',
    	libraryTarget: 'commonjs2',
    	publicPath: '/'
  	},

  	node: {
	    __dirname: false,
	    __filename: false,
	    Buffer: false,
	    console: false,
	    global: false,
	    process: false
  	},

  	module: {
	    rules: baseWebpackConfig.module.rules.concat([
	    	{
				test: /\.css$/,
			    use: [
					{
				    	loader: 'style-loader'
					},

			       	{
			            loader: 'css-loader',
			            options: {
							importLoaders: 1,
							minimize: false,
							sourceMap: true,
							discardComments: {
		      					removeAll: true
		    				}
						}
		        	},

		        	{
		          		loader: 'postcss-loader',
		          		options: {
		          			sourceMap: 'inline',
		          			plugins: () => {
		          				return [
		          					require('postcss-reporter'),
		          					require('css-mqpacker')({
		          						sort: true
		          					}),
		          					require('autoprefixer')({
		          						browsers: [
		          							'last 2 versions',
            								'ie >= 11'
		          						]
		          					})
		          				];
		          			}
		          		}
		          	}
		        ]  
	      	},

	      	{
				test: /\.(jpe?g|png|svg)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[hash].[ext]',
							limit: 10000
						}
					}
				]
			},

			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'application/font-woff'
						}
					}
				]
			},

			{
  				test: /\.(eot|ttf)$/,
  				use: [
    				{
      					loader: 'raw-loader'
    				},
    				
				    {
				      	loader: 'ignore-loader'
				    }
				]
			}
	    ])
  	}
});

module.exports=[devClientConfig, devServerConfig];