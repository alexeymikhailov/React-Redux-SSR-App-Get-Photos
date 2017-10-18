/* @flow */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'reducers';
import { API_KEY_GOOGLE_MAPS } from 'constants';
import path from 'path';
import fs from 'fs';
import routes from 'routes';
import App from 'App';

const serverRenderer=(): Function => {
	return (req: express$Request, res: express$Response, next: express$NextFunction) => {
		const store=createStore(rootReducer, applyMiddleware(thunkMiddleware));

		const data=store.getState();
		
		const context={};

		const markup=ReactDOMServer.renderToString(
			<Provider store={store}>
				<StaticRouter location={req.url} context={context}>
					<App />
				</StaticRouter>
			</Provider>
		);

		res.send(fs.readFileSync('config/static/template.html', 'utf8').replace(
		    /<div id="root"><\/div>/,
		    `<div id="root">${markup}</div>`
	   	).replace(
	   	 	/<script><\/script>/,
	   	 	`<script>window.__INITIAL_STATE__=${JSON.stringify(data)}</script>`
	   	).replace(
	   		/<script src=""><\/script>/,
	   		`<script src="https://maps.googleapis.com/maps/api/js?key=${API_KEY_GOOGLE_MAPS}&libraries=places"><\/script>`
	   	));
	};
};

export default serverRenderer;