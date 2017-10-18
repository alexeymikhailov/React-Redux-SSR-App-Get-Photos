/* @flow */

import {
	REQUEST_CURRENT_PHOTOS,
	RECEIVE_CURRENT_PHOTOS,
	REQUEST_CURRENT_PHOTOS_FAILED,
	REQUEST_GEOCODING_FAILED,
	REQUEST_GEOLOCATION_FAILED,
	ADD_PHOTO_IN_FAVORITES,
	REMOVE_PHOTO_FROM_FAVORITES,
	GET_PHOTO_FROM_FAVORITES,
	LOAD_NEXT_LIST_PHOTOS
} from 'actions';

import type { PhotoAction } from 'actions';

export type PhotoState={
	currentPhotosFetch: boolean,
	data: Array<Object>,
	currentListImages: Array<Object>,
	occurredErrorGeocoding: boolean,
	errorGeolocation: boolean,
	totalPages: number,
	firstRender: boolean,
	showNextListPicture: boolean,
	favorites: Array<Object>,
	error: string
};

const initialState={
	currentPhotosFetch: false,
	data: [],
	currentListImages: [],
	occurredErrorGeocoding: false,
	errorGeolocation: false,
	totalPages: 0,
	firstRender: true,
	showNextListPicture: true,
	favorites: [],
	error: ''
};

const currentPhotos=(state: PhotoState=initialState, action: PhotoAction) => {
	switch(action.type) {
		case REQUEST_CURRENT_PHOTOS:
			return {
				currentPhotosFetch: true
			};

		case RECEIVE_CURRENT_PHOTOS:
			action.payload.json.map((photo, index) => {
				return photo.likePhoto=false;	
			});

			const listPhotos=action.payload.json.slice(0, 12);
			
			return {
				...state,
				currentPhotosFetch: false,
				data: action.payload.json,
				currentListImages: listPhotos,
				totalPages: Math.ceil(action.payload.json.length / 12) - 1,
				firstRender: false,
				occurredErrorGeocoding: false,
				errorGeolocation: false,
				showNextListPicture: true,
				favorites: []
			};

		case REQUEST_CURRENT_PHOTOS_FAILED:
			return {
				...state,
				currentPhotosFetch: false,
				firstRender: false,
				occurredErrorGeocoding: false,
				errorGeolocation: false,
				showNextListPicture: false,
				error: action.payload.error
			};

		case REQUEST_GEOCODING_FAILED: 
			return {
				...state,
				currentPhotosFetch: false,
				firstRender: false,
				occurredErrorGeocoding: true,
				errorGeolocation: false,
				showNextListPicture: false,
				error: action.payload.error
			};

		case REQUEST_GEOLOCATION_FAILED: 
			return {
				...state,
				currentPhotosFetch: false,
				firstRender: false,
				occurredErrorGeocoding: false,
				errorGeolocation: true,
				showNextListPicture: false,
				error: action.payload.error
			};

		case ADD_PHOTO_IN_FAVORITES:
			action.payload.photo.likePhoto=true;

			return {
				...state,
				favorites: state.favorites.concat(action.payload.photo)
			};

		case REMOVE_PHOTO_FROM_FAVORITES:
			action.payload.photo.likePhoto=false;

			return {
				...state,
				favorites: state.favorites.filter((photo) => {
					return photo.likePhoto !== action.payload.photo.likePhoto	
				})
			};

		case LOAD_NEXT_LIST_PHOTOS:
			const currentIntervalPhotos=state.data.slice((action.payload.currentPage * 12 - 12), (action.payload.currentPage * 12));
			const nextListPhotos=currentIntervalPhotos;

			if (action.payload.currentPage <= state.totalPages) {
				return {
					...state,
					currentListImages: state.currentListImages.concat(nextListPhotos)
				};
			} else {
				return {
					...state,
					showNextListPicture: false,
					currentListImages: state.currentListImages.concat(nextListPhotos)
				};
			}

		default:
			return state;
	}
};

export default currentPhotos;