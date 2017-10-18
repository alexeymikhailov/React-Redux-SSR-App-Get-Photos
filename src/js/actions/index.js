/* @flow */

import fetch from 'node-fetch';
import { API_KEY_FLICKR } from 'constants';

export const REQUEST_CURRENT_PHOTOS: string='REQUEST_CURRENT_PHOTOS';
export const RECEIVE_CURRENT_PHOTOS: string='RECEIVE_CURRENT_PHOTOS';
export const REQUEST_CURRENT_PHOTOS_FAILED: string='REQUEST_CURRENT_PHOTOS_FAILED';
export const REQUEST_GEOCODING_FAILED: string='REQUEST_GEOCODING_FAILED';
export const REQUEST_GEOLOCATION_FAILED: string='REQUEST_GEOLOCATION_FAILED';

export const ADD_PHOTO_IN_FAVORITES: string='ADD_PHOTO_IN_FAVORITES';
export const REMOVE_PHOTO_FROM_FAVORITES: string='REMOVE_PHOTO_FROM_FAVORITES';
export const LOAD_NEXT_LIST_PHOTOS: string='LOAD_NEXT_LIST_PHOTOS';

export type PhotoAction=
	| { type: typeof REQUEST_CURRENT_PHOTOS }
	| { type: typeof RECEIVE_CURRENT_PHOTOS, payload: { json: Array<Object> } } 
	| { type: typeof REQUEST_CURRENT_PHOTOS_FAILED, payload: { error?: string } }
	| { type: typeof REQUEST_GEOCODING_FAILED, payload: { error?: string } }
	| { type: typeof REQUEST_GEOLOCATION_FAILED, payload: { error?: string } }
	| { type: typeof ADD_PHOTO_IN_FAVORITES, payload: { photo: Object } }
	| { type: typeof REMOVE_PHOTO_FROM_FAVORITES, payload: { photo: Object } }
	| { type: typeof LOAD_NEXT_LIST_PHOTOS, payload: { currentPage: number } };

type PromiseAction=Promise<PhotoAction>;
type ThunkAction=(dispatch: Dispatch) => any;
type Dispatch=(action: PhotoAction | ThunkAction | PromiseAction | Array<Object>) => any;

export const requestCurrentPhotos=(): PhotoAction => {
	return {
		type: REQUEST_CURRENT_PHOTOS
	};
};

export const receiveCurrentPhotos=(json: Array<Object>): PhotoAction => {
	return {
		type: RECEIVE_CURRENT_PHOTOS,
		payload: {
			json
		}
	};
};

export const requestCurrentPhotosFailed=(error: string): PhotoAction => {
	return {
		type: REQUEST_CURRENT_PHOTOS_FAILED,
		payload: {
			error
		}
	};
};

export const requestGeocodingFailed=(error: string): PhotoAction => {
	return {
		type: REQUEST_GEOCODING_FAILED,
		payload: {
			error
		}
	};
};

export const requestGeolocationFailed=(error: string): PhotoAction => {
	return {
		type: REQUEST_GEOCODING_FAILED,
		payload: {
			error
		}
	};
};
 
export const fetchCurrentPhotos=(location: string): ThunkAction => {
	const urlRegular=`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&tags=${location}&sort=relevance&per_page=50&api_key=${API_KEY_FLICKR}`;

	return async (dispatch) => {
		dispatch(requestCurrentPhotos());

		try {
			const response=await fetch(`${urlRegular}`);
			const json=await response.json();

			dispatch(fetchInfoPhotoFavorites(json.photos.photo));
		} catch(error) {
			dispatch(requestCurrentPhotosFailed(error));
		}
	}
};

const fetchInfoPhotoFavorites=(photos: Array<Object>): ThunkAction => {
	return async (dispatch) => {
		let promises=[];

	    photos.map((item) => {
	      	const urlInfoPhotos=`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&format=json&nojsoncallback=1&photo_id=${item.id}&page=1&per_page=50&api_key=${API_KEY_FLICKR}`;
	      	const urlInfoFavorites=`https://api.flickr.com/services/rest/?method=flickr.photos.getFavorites&format=json&nojsoncallback=1&photo_id=${item.id}&api_key=${API_KEY_FLICKR}`; 

	      	return promises=[...promises, fetch(urlInfoPhotos), fetch(urlInfoFavorites)];
	    });

	    try {
	    	let response=await Promise.all(promises);

	      	let arrResponsePhotosFavorites=await Promise.all(response.map((res) => {
	        	return res.json();
	      	}));

	      	let arrInfoPhotosFavorites=arrResponsePhotosFavorites.map((json, index) => {
	        	return json.photo;
	      	});

	      	dispatch(receiveCurrentPhotos(mergedInfoPhotoFavorites(arrInfoPhotosFavorites)));
	    } catch(error) {
	    	dispatch(requestCurrentPhotosFailed(error));
	    }
	}
};

const mergedInfoPhotoFavorites=(infoPhotosFavorites: Array<Object>): Array<Object> => {
	const objectMergedById=infoPhotosFavorites.reduce((result: Object, object: Object, index: number) => ({
    	...result,
      	[object.id]: {
    		...result[object.id],
        	...object
      	}  
    }), {});

    const arrMergedById=Object.keys(objectMergedById).map((key: string) => {
    	return objectMergedById[key];   
    });

    return arrMergedById;
};

export const addPhotoInFavorite=(photo: Object): PhotoAction => {
	return {
		type: ADD_PHOTO_IN_FAVORITES,
		payload: {
			photo
		}
	};
};

export const removePhotoFromFavorite=(photo: Object): PhotoAction => {
	return {
		type: REMOVE_PHOTO_FROM_FAVORITES,
		payload: {
			photo
		}	
	};
};

export const getNextListPhotos=(currentPage: number): PhotoAction => {
	return {
		type: LOAD_NEXT_LIST_PHOTOS,
		payload: {
			currentPage
		}
	};
};