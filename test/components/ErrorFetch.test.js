import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import ErrorFetch from 'ErrorFetch';

test('should exist', () => {
	const container=shallow(
		<ErrorFetch />
	);

	expect(container).toBeTruthy();
});

test('should render', () => {
	const error='Occurred error';

	const container=renderer.create(
    	<ErrorFetch error={error} />
    );

    expect(toJson(container)).toMatchSnapshot();
});

test('should check for class and content of the element', () => {
	const container=shallow(
		<AppRoot />
	);

	expect(container.find('h1').text()).toContain('Occurred error');

	expect(container.hasClass('error-fetch-weather')).toBeTruthy();
});