/* @flow */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import type { Store } from 'redux';
import type { PhotoState } from 'CurrentPhotos';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'CurrentPhotos';

const configureStore=(initialState: PhotoState, routerMiddleware: Object, middleware: Object) => {
	const store: Store<*, *, *>=createStore(
		combineReducers({
			currentPhotos: rootReducer,
			router: routerMiddleware		
		}),
		initialState,
		applyMiddleware(middleware, thunkMiddleware)
	);

	if (module.hot) {
		module.hot.accept('../reducers', () => {
			const nextRootReducer=require('reducers').default;
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
};

export default configureStore;
