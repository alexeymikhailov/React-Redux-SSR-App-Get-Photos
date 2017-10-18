/* @flow */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import path from 'path';
import webpackConfig from '../config/webpack.dev.conf';
import serverRenderer from './server.js';

const app=express();
const isProd=process.env.NODE_ENV === 'production';
const port=3000;

if (isProd) {
	app.use(express.static(path.join(__dirname, '../config/static')));

	app.use('*', serverRenderer());
} else {
	const compiler=webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		serverSideRender: true
	}));

	app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')));
	app.use(webpackHotServerMiddleware(compiler));
}

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} 
	console.info(`Listening on port ${port}`);
});