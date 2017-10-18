/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  ConnectedRouter, 
  routerReducer,
  routerMiddleware
} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import configureStore from 'store';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../src/css/photo-app.css';
import '../src/css/spinner.css';
import App from 'App';

const history=createHistory();

const middleware=routerMiddleware(history);

const store=configureStore(window.__INITIAL_STATE__, routerMiddleware, middleware);

ReactDOM.hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
  		<AppContainer>
  			<App />
  		</AppContainer>
  	</ConnectedRouter>
  </Provider>, 
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('../src/App', () => {
    const NextApp = require('App').default;

    ReactDOM.hydrate(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppContainer>
            <NextApp />
          </AppContainer>
        </ConnectedRouter>
      </Provider>, 
      document.getElementById('root')
    );
  });
}