import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Spinner from 'Spinner';

test('should exist', () => {
	const container=shallow(
		<Spinner />
	);

	expect(container).toBeTruthy();
});

test('should render', () => {
	const container=renderer.create(
    	<Spinner />
    );

    expect(toJson(container)).toMatchSnapshot();
});

test('should check for class', () => {
	const container=shallow(
		<AppRoot />
	);

	expect(container.hasClass('spinner')).toBeTruthy();
});