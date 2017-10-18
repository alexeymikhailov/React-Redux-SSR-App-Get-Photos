import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'store';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { Link } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import AppRoot from 'AppRoot';

const initialState={};

const store=configureStore(initialState);

const history=createBrowserHistory();

const app=mount(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<AppRoot />
		</ConnectedRouter>
	</Provider>
);

test('should exist', () => {
	expect(app.find('p').at(0).text()).toContain('photopage');

	expect(app).toBeTruthy();
});

test('should match its empty snapshot', () => {
    expect(toJson(app)).toMatchSnapshot();
});

test('should send data when is clicked key enter', () => {
	const preventDefault=jest.fn();

	expect(app.state().firstRender).toEqual(true);

	app.find('form').simulate('submit', { preventDefault });

	expect(toJson(app)).toMatchSnapshot();

	expect(preventDefault).toHaveBeenCalled();

	expect(app.state().firstRender).toEqual(false);
});

test('should render', () => {
	const container=shallow(
		<Link to="/favorites">Favorites</Link>
	);

	expect(toJson(container)).toMatchSnapshot();
});

test('should displays a link tag with the Favorites text', () => {
	const link=app.find('Link').find({ to: '/favorites' });

	expect(link.html()).toBe('<a href="/favorites">Favorites</a>');
});

test('should handle the click event', () => {
	const mockFunction=jest.fn();

	const container=render.create(
		<Link to="/favorites">Favorites</Link>
	);

	container.simulate('click');

	expect(mockFunction).toHaveBeenCalled();
});

test('should get photos around geolocation when is clicked', () => {
	const mockFunction=jest.fn();

	app.find('button').at(0).simulate('click');

	expect(mockFunction).toHaveBeenCalled();
});

test('should load more photos when is clicked', () => {
	const mockFunction=jest.fn();

	expect(app.state().currentPage).toEqual(1);

	app.find('button').at(1).simulate('click');

	expect(mockFunction).toHaveBeenCalled();

	expect(app.state().currentPage).not.toEqual(1);
});