/* @flow */

type State={
	firstRender: boolean,
	currentPage: number
};

type MappedProps={
	currentPhotos: PhotoState
};

type Props={
	dispatch: Dispatch<*>,
	currentPhotos: PhotoState
};

import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { PhotoState } from 'CurrentPhotos';
import { Link } from 'react-router-dom';
import fetch from 'node-fetch';
import { 
	fetchCurrentPhotos,
	requestGeocodingFailed,
	requestGeolocationFailed,
	addPhotoInFavorite,
	removePhotoFromFavorite,
	getNextListPhotos 
} from 'actions';
import Spinner from 'Spinner';
import ErrorMessage from 'ErrorFetch';
import PhotoList from 'PhotoList';
import Favorites from 'Favorites';
import { push } from "react-router-redux";

class AppRoot extends Component<Props, State> {
	state: State;

	onHandleSubmit: Function;

	e: Event & { target: EventTarget };

	onHandleGeolocationClick: Function;

	onHandleClickLoadMorePhoto: Function;

	onHandleLikeCurrentPhoto: Function;

	onHandleNavigateTo: Function;

	constructor(props: Props) {
		super(props);

		this.state={
			firstRender: true,
			currentPage: 1
		};

		this.onHandleSubmit=(e): void => {
			e.preventDefault();

			const geocoder=new google.maps.Geocoder();

			const inputValue=this.refs.searchCity.value;

			e.target.reset();

			geocoder.geocode({'address': inputValue}, (results: Array<Object>, status: string) => {
				if (status === 'OK') {
					this.props.dispatch(fetchCurrentPhotos(results[0].address_components[0].long_name));
				} else {
					const error=`Geocode was not successful for the following reason: ${status}`;

					this.props.dispatch(requestGeocodingFailed(error));
				}
			});
		};

		this.onHandleGeolocationClick=(e: SyntheticEvent<HTMLButtonElement>): void => {
			e.preventDefault();

			if (window.navigator.geolocation) {
				window.navigator.geolocation.getCurrentPosition((position: Object) => {
					const { latitude: lat, longitude: lon }=position.coords;
					
					const geocoder=new google.maps.Geocoder();

					geocoder.geocode({'location': { lat, lng: lon }}, (results: Array<Object>, status: string) => {
						if (status === 'OK') {
							this.props.dispatch(fetchCurrentPhotos(results[1].address_components[0].long_name));
						} else {
							const error=`Geocoder failed due to: ${status}`;

							this.props.dispatch(requestGeolocationFailed(error));
						}	
					});		
				}, (error: string) => {
					this.props.dispatch(requestGeolocationFailed(error));
				});
			} else {
				const error='Your browser does not support geolocation.';

				this.props.dispatch(requestGeolocationFailed(error));
			}
		};

		this.onHandleClickLoadMorePhoto=(): void => {
			this.setState({
				currentPage: this.state.currentPage + 1
			});

			this.props.dispatch(getNextListPhotos(this.state.currentPage + 1));

			let currentImages=this.props.currentPhotos.data.slice(0, 12);	
		};

		this.onHandleLikeCurrentPhoto=(photo: Object): void => {
			if (!photo.likePhoto) {
				this.props.dispatch(addPhotoInFavorite(photo));	
			} else {
				this.props.dispatch(removePhotoFromFavorite(photo));	
			}	
		};

		this.onHandleNavigateTo=(location: string): void => {
			this.props.dispatch(push(location));
		};
	}

	render() {
		const { currentPhotos }=this.props;

		let headerFunctionalContainer=(
			<div className="header">
				<div className="logo">
					<div className="img" />
					<p>photopage</p>
				</div>
				<div className="favorites">
					<Link to="/favorites" onClick={() => { this.onHandleNavigateTo('/favorites') }}>Favorites</Link>
				</div>
				<div className="location">
					<button type="button" onClick={this.onHandleGeolocationClick}><span className="location-pointer" />Get location</button>
				</div>
				<div className="input-group search">
					<span className="input-group-addon" />
					<form onSubmit={this.onHandleSubmit}>
						<input type="text" name="Search" ref="searchCity" className="form-control" autoComplete="off" autoFocus placeholder="Search the city" />
					</form>	
				</div>
			</div>
		);

		if (currentPhotos.currentPhotosFetch) {
			if (!currentPhotos.data) {
				return (
					<div className="flex-markup">
						<div className="main-layer">
							{headerFunctionalContainer}
							<Spinner />
						</div>
					</div>
				);
			} else if (currentPhotos.error) {
				return (
					<div className="flex-markup">
						<div className="main-layer">
							{headerFunctionalContainer}
							<ErrorMessage error={currentPhotos.error} />
						</div>
					</div>
				);
			}
		} else if (currentPhotos.firstRender) {
			return (
				<div className="flex-markup">
					<div className="main-layer">
						{headerFunctionalContainer}
						<div className="start-words">
							<p>Display photos by specific position or your current location.</p>
						</div>	
					</div>
				</div>
			);
		} else if (currentPhotos.errorGeolocation) {
			return (
				<div className="flex-markup">
					<div className="main-layer">
						{headerFunctionalContainer}
						<ErrorMessage error={currentPhotos.error} />
					</div>
				</div>
			);			
		} else if (currentPhotos.occurredErrorGeocoding) {
			return (
				<div className="flex-markup">
					<div className="main-layer">
						{headerFunctionalContainer}
						<ErrorMessage error={currentPhotos.error} />
					</div>
				</div>
			);
		} else {
			return (
				<div className="flex-markup">
					<div className="main-layer">
						{headerFunctionalContainer}
						<TransitionGroup>
							<CSSTransition appear timeout={{ appear: 1000, enter: 2000, exit: 1000 }} classNames="fade">
								<PhotoList currentListPhotos={currentPhotos.currentListImages} onLikePhoto={this.onHandleLikeCurrentPhoto} likePhoto={currentPhotos} />
							</CSSTransition>
						</TransitionGroup>
						<div className="footer">
							<div className="loading">
								{ currentPhotos.showNextListPicture ?  ( 
									<button type="button" onClick={() => { this.onHandleClickLoadMorePhoto() }}>Load more</button>
								) : (
									<div className="end-feed">
										<p>All the photos shown</p>
									</div>		
								) }	
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

const mapStateToProps=(state): MappedProps => {
	const { currentPhotos }=state;

	return {
		currentPhotos
	};
};

export default connect(mapStateToProps)(AppRoot);