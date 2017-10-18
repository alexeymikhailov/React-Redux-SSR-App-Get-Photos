import { API_KEY_FLICKR } from 'constants';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import fetchMock from 'fetch-mock';
import * as actions from 'actions';

const middleware=[thunkMiddleware];
const mockStore=configureMockStore(middleware);

test('to create an action showing loading spinner', () => {
	expect(actions.requestCoordsCity()).toMatchSnapshot();
});

test('to create an action containing all the information about the photo', () => {
	expect(actions.receiveCoordsCity([
		{ 
			description: {
				_content: "Moscow"
			},
			media: "photo",
			originalformat: "jpg"
		}
	])).toMatchSnapshot();
});

test('to create an action containing error', () => {
	expect(actions.requestCoordsCityFailed(
		error: "Flickr API returned an error message"
	)).toMatchSnapshot();
});

test('to create an action containing error geocoding', () => {
	expect(actions.requestGeocodingFailed(
		error: "Occurred error geocoding"
	)).toMatchSnapshot();
});

test('to create an action containing error geolocation', () => {
	expect(actions.requestGeolocationFailed(
		error: "Occurred error geolocation"
	)).toMatchSnapshot();
});

test('handles fetchCoordsCity and fetchInfoPhotoFavorites success', async (done) => {
	afterEach(() => {
		fetchMock.restore();	
	});

	const store=mockStore();

	fetchMock.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&tags=Moscow&sort=relevance&per_page=50&api_key=${API_KEY_FLICKR}`, {
		photo: [
			{ 
				description: {
					_content: "Moscow"
				},
				media: "photo",
				originalformat: "jpg"
			}
		]
	});

	const fn=await actions.fetchCoordsCity();

	return store.dispatch(fn())
		.then(() => {
			expect(store.getActions()).toEqual([
				{ 
					type: 'REQUEST_COORDS_CITY' 
				},
				{ 
					type: 'RECEIVE_COORDS_CITY', 
					json: [
						{ 
							description: {
								_content: "Moscow"
							},
							media: "photo",
							originalformat: "jpg"
						}
					]   
				}	
			]);

			done();
		});
});

test('handles fetchCoordsCity or fetchInfoPhotoFavorites failure', async (done) => {
	afterEach(() => {
		fetchMock.restore();	
	});

	const store=mockStore();

	fetchMock.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&tags=Moscow&sort=relevance&per_page=50&api_key=${API_KEY_FLICKR}`, 400);

	const fn=await actions.fetchCoordsCity();

	return store.dispatch(fn())
		.then(() => {
			expect(store.getActions()).toEqual([
				{ 
					type: 'REQUEST_COORDS_CITY' 
				},
				{ 
					type: 'RECEIVE_COORDS_CITY', 
					error: 'Error'   
				}	
			]);

			done();
		});
});

test('merged of two objects', () => {
	const data=[
		{ 
			title: {
				_content: "Moscow"
			},
			description: {
				_content: "Red Square"
			},
			media: "photo",
			originalformat: "jpg"
		},
		{
			total: "20",
			tags: {
				tag: [
					{	
						author: null,
						raw: "Moscow"
					},
					{
						author: null,
						raw: "Russia"
					}
				]
			}
			views: "20"
		}
	];

	const fn=actions.mergedInfoPhotoFavorites(data);

	expect(fn()).toEqual(true);
});

test('to create an action for adding a photo in favorites', () => {
	expect(actions.addPhotoInFavorite(
		{ 
			description: {
				_content: "Red Square"
			},
			likePhoto: true
			media: "photo",
			originalformat: "jpg"
		}
	)).toMatchSnapshot();
});

test('to create an action for removing a photo from favorites', () => {
	expect(actions.removePhotoFromFavorite(
		{ 
			description: {
				_content: "Red Square"
			},
			likePhoto: false
			media: "photo",
			originalformat: "jpg"
		}
	)).toMatchSnapshot();
});

test('to create an action for load the next list photos', () => {
	expect(actions.getNextListPhotos(
		currentPage: 0
	)).toMatchSnapshot();
});