import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'store';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { Link } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Favorites from 'Favorites';

const coordsCity={
	favorites: [
		{ 
			description: {
				_content: "Moscow"
			},
			media: "photo",
			originalformat: "jpg"
		},

		{ 
			description: {
				_content: "Red Square"
			},
			media: "photo",
			originalformat: "jpg"
		}	
	]
};

const initialState={};

const store=configureStore(initialState);

const history=createBrowserHistory();

const app=mount(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Favorites />
		</ConnectedRouter>
	</Provider>
);

test('should exist', () => {
	expect(app).toBeTruthy();
});

test('should render', () => {
	const container=mount(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Favorites coordsCity={coordsCity} />
			</ConnectedRouter>
		</Provider>
	);

    expect(toJson(container)).toMatchSnapshot();
});

test('should render two photos', () => {
	const container=mount(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Favorites coordsCity={coordsCity} />
			</ConnectedRouter>
		</Provider>
	);

	expect(container.find('li')).toHaveLength(2);
});

test('should like when button is clicked', () => {
	const mockFunction=jest.fn();

	const container=mount(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Favorites coordsCity={coordsCity} onClick={mockFunction} />
			</ConnectedRouter>
		</Provider>
	);

	expect(mockFunction).not.toHaveBeenCalled();

	container.find('button').simulate('click');

	expect(mockFunction).toHaveBeenCalled();
	
	expect(container.hasClass('like-clicked')).not.toBeTruthy();
});

test('should displays a link tag with the Favorites text', () => {
	const container=mount(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Favorites coordsCity={coordsCity} />
			</ConnectedRouter>
		</Provider>
	);

	const link=container.find('Link').find({ to: '/' });

	expect(link.html()).toBe('<a href="/">Return back</a>');
});

test('should handle the click event', () => {
	const mockFunction=jest.fn();

	const container=render.create(
		<Link to="/">Return back</Link>
	);

	container.simulate('click');

	expect(mockFunction).toHaveBeenCalled();
});