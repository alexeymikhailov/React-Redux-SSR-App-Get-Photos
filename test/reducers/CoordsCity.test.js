import CoordsCity from 'CoordsCity';

import {
	REQUEST_COORDS_CITY,
	RECEIVE_COORDS_CITY,
	REQUEST_COORDS_CITY_FAILED,
	REQUEST_GEOCODING_FAILED,
	REQUEST_GEOLOCATION_FAILED,
	ADD_PHOTO_IN_FAVORITES,
	REMOVE_PHOTO_FROM_FAVORITES,
	LOAD_NEXT_LIST_PHOTOS
} from 'actions';

test('should handle initial state', () => {
	expect(CoordsCity(undefined, {})).toMatchSnapshot();
});

test('should handle RECEIVE_COORDS_CITY', () => {
	const data=[
		{ 
			description: {
				_content: "Moscow"
			},
			likePhoto: false,
			media: "photo",
			originalformat: "jpg"
		}
	];

	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [],
			currentListImages: [],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [],
			error: ''
		},

		{
			type: RECEIVE_COORDS_CITY,
			payload: {
				json: data
			}
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [
			{ 
				description: {
					_content: "Moscow"
				},
				likePhoto: false,
				media: "photo",
				originalformat: "jpg"
			}
		],
		currentListImages: [],
		occurredErrorGeocoding: false,
		errorGeolocation: false,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: true,
		favorites: [],
		error: ''
	})
	.toMatchSnapshot();
});

test('should handle REQUEST_COORDS_CITY_FAILED', () => {
	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [],
			currentListImages: [],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [],
			error: ''
		},

		{
			type: REQUEST_COORDS_CITY_FAILED,
			payload: {
				error: 'Occurred error'
			}
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [],
		currentListImages: [],
		occurredErrorGeocoding: false,
		errorGeolocation: false,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: false,
		favorites: [],
		error: 'Occurred error'
	})
	.toMatchSnapshot();
});

test('should handle REQUEST_GEOCODING_FAILED', () => {
	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [],
			currentListImages: [],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [],
			error: ''
		},

		{
			type: REQUEST_GEOCODING_FAILED,
			payload: {
				error: 'Occurred error geocoding'
			}
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [],
		currentListImages: [],
		occurredErrorGeocoding: true,
		errorGeolocation: false,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: false,
		favorites: [],
		error: 'Occurred error geocoding'
	})
	.toMatchSnapshot();
});

test('should handle REQUEST_GEOLOCATION_FAILED', () => {
	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [],
			currentListImages: [],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [],
			error: ''
		},

		{
			type: REQUEST_GEOLOCATION_FAILED,
			payload: {
				error: 'Occurred error geolocation'
			}
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [],
		currentListImages: [],
		occurredErrorGeocoding: false,
		errorGeolocation: true,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: false,
		favorites: [],
		error: 'Occurred error geolocation'
	})
	.toMatchSnapshot();
});

test('should handle ADD_PHOTO_IN_FAVORITES', () => {
	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [],
			currentListImages: [],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [
				{ 
					description: {
						_content: "Moscow"
					},
					likePhoto: true,
					media: "photo",
					originalformat: "jpg"
				}
			],
			error: ''
		},

		{
			type: ADD_PHOTO_IN_FAVORITES,
			payload: {
				photo: { 
					description: {
						_content: "Red Square"
					},
					likePhoto: true
					media: "photo",
					originalformat: "jpg"
				}
			}
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [],
		currentListImages: [],
		occurredErrorGeocoding: false,
		errorGeolocation: false,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: true,
		favorites: [
			{ 
				description: {
					_content: "Moscow"
				},
				likePhoto: false,
				media: "photo",
				originalformat: "jpg"
			},

			{ 
				description: {
					_content: "Red Square"
				},
				likePhoto: true,
				media: "photo",
				originalformat: "jpg"
			}
		],
		error: ''
	})
	.toMatchSnapshot();
});

test('should handle REMOVE_PHOTO_FROM_FAVORITES', () => {
	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [],
			currentListImages: [],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [
				{ 
					description: {
						_content: "Moscow"
					},
					likePhoto: true,
					media: "photo",
					originalformat: "jpg"
				},

				{ 
					description: {
						_content: "Red Square"
					},
					likePhoto: true,
					media: "photo",
					originalformat: "jpg"
				}
			],
			error: ''
		}, 

		{
			type: REMOVE_PHOTO_FROM_FAVORITES,
			payload: {
				photo: { 
					description: {
						_content: "Red Square"
					},
					likePhoto: false,
					media: "photo",
					originalformat: "jpg"
				}
			}
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [],
		currentListImages: [],
		occurredErrorGeocoding: false,
		errorGeolocation: false,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: true,
		favorites: [
			{ 
				description: {
					_content: "Moscow"
				},
				likePhoto: true,
				media: "photo",
				originalformat: "jpg"
			}
		],
		error: ''
	})
	.toMatchSnapshot();
});

test('should handle LOAD_NEXT_LIST_PHOTOS', () => {
	expect(CoordsCity(
		{
			coordsCityFetch: false,
			data: [
				{ 
					description: {
						_content: "Red Square"
					},
					likePhoto: true
					media: "photo",
					originalformat: "jpg"
				}
			],
			currentListImages: [
				{ 
					description: {
						_content: "Moscow"
					},
					likePhoto: false,
					media: "photo",
					originalformat: "jpg"
				}
			],
			occurredErrorGeocoding: false,
			errorGeolocation: false,
			totalPages: 1,
			firstRender: false,
			showNextListPicture: true,
			favorites: [],
			error: ''
		}, 

		{
			type: LOAD_NEXT_LIST_PHOTOS,
			payload: {
				currentPage: 0
			}
			
		}
	))
	.toEqual({
		coordsCityFetch: false,
		data: [
			{ 
				description: {
					_content: "Red Square"
				},
				likePhoto: true
				media: "photo",
				originalformat: "jpg"
			}
		],
		currentListImages: [
			{ 
				description: {
					_content: "Moscow"
				},
				likePhoto: false,
				media: "photo",
				originalformat: "jpg"
			},

			{ 
				description: {
					_content: "Red Square"
				},
				likePhoto: false
				media: "photo",
				originalformat: "jpg"
			}
		],
		occurredErrorGeocoding: false,
		errorGeolocation: false,
		totalPages: 1,
		firstRender: false,
		showNextListPicture: true,
		favorites: [],
		error: ''
	})
	.toMatchSnapshot();
});