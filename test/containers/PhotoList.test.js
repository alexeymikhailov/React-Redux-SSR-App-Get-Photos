import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import PhotoList from 'PhotoList';

const currentListPhotos=[
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
];

test('should exist', () => {
	const container=shallow(
		<PhotoList />
	);

	expect(container).toBeTruthy();
});

test('should render', () => {
	const container=renderer.create(
    	<PhotoList currentListPhotos={currentListPhotos} />
    );

    expect(toJson(container)).toMatchSnapshot();
});

test('should render two photos based on props currentListPhotos', () => {
	const container=mount(
		<PhotoList currentListPhotos={currentListPhotos} />
	);

	expect(container.find('li')).toHaveLength(2);
});

test('should like when button is clicked', () => {
	const mockFunction=jest.fn();

	const container=renderer.create(
		<PhotoList currentListPhotos={currentListPhotos} onClick={mockFunction} />
	);

	expect(mockFunction).not.toHaveBeenCalled();

	container.find('button').simulate('click');

	expect(mockFunction).toHaveBeenCalled();

	expect(container.hasClass('like-clicked')).toBeTruthy();
});