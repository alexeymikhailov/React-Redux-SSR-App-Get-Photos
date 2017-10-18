const webpack=require('webpack');
const path=require('path');
const merge=require('webpack-merge');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const ExtractTextPlugin=require('extract-text-webpack-plugin');
const CleanWebpackPlugin=require('clean-webpack-plugin');
const nodeExternals=require('webpack-node-externals');
const baseWebpackConfig=require('./webpack.base.conf');

const cssOutputName='styles.[hash].css';
const vendorsOutputName='vendors.[hash].js';

const prodClientConfig=merge(baseWebpackConfig, {
	devtool: 'cheap-module-source-map',

	name: 'client',

	target: 'web',

	entry: {
		bundle: [
			'babel-polyfill',
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
		path: path.resolve(__dirname, 'static'),
		filename: 'client.[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		publicPath: '/'
	},

	module: {
	    rules: baseWebpackConfig.module.rules.concat([
		    {
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
			            	loader: 'css-loader',
				            options: {
								importLoaders: 1,
								minimize: true,
								sourceMap: true,
								discardComments: {
			      					removeAll: true
			    				}
			    			}
						},

			          	{
				          	loader: 'postcss-loader',
				          	options: {
				          		sourceMap: true,
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
				})
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
			'process.env.NODE_ENV': JSON.stringify('production')
		}),

    	new ExtractTextPlugin({
			filename: cssOutputName,
			disable: false,
			allChunks: true
		}),

		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),

		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: vendorsOutputName
		}),

		new CleanWebpackPlugin(['./static'], {
			root: __dirname,
			verbose: true,
			dry: false
		}),

		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				unused: true,
        		dead_code: true
			},
			mangle: {
       	 		screw_ie8: true
      		},
			output: {
				comments: false,
				screw_ie8: true
			},
			sourceMap: true
		})
  	])
});

const prodServerConfig=merge(baseWebpackConfig, {
	devtool: 'cheap-module-source-map',

	name: 'server',
	
	target: 'node',

	externals: [nodeExternals()],

	entry: './server/server.js',

	output: {
		path: path.resolve(__dirname, 'static'),
		filename: 'server.[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
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
			            loader: 'css-loader/locals',
			            options: {
							importLoaders: 1,
							minimize: true,
							sourceMap: true,
							discardComments: {
		      					removeAll: true
		    				}
						}
		            },

		            {
		          		loader: 'postcss-loader',
		          		options: {
		          			sourceMap: true,
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

module.exports=[prodClientConfig, prodServerConfig];