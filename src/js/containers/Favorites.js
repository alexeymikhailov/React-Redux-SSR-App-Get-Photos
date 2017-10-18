/* @flow */

type State={
	dimensionsPhoto: {
    	width: Array<number>,
    	height: Array<number>
  	}
};

type MappedProps={
	currentPhotos: PhotoState
};

type Props={
	dispatch: Dispatch<*>,
	currentPhotos: PhotoState
};

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { PhotoState } from 'CurrentPhotos';
import { Link } from 'react-router-dom';
import { push } from "react-router-redux";
import { removePhotoFromFavorite } from 'actions';

class Favorites extends Component<Props, State> {
	state: State;

	imageInfo: Function;

	e: Event & { target: EventTarget };

	onHandleRemoveLike: Function;

	onHandleNavigateTo: Function;

	constructor(props: Props) {
		super(props);

		this.state={
      		dimensionsPhoto: {
        		width: [],
        		height: []
      		}
    	};

    	this.imageInfo=(e) => {
    		e.preventDefault();

      		this.setState({
        		dimensionsPhoto: {
          			width: this.state.dimensionsPhoto.width.concat(e.target.width),
          			height: this.state.dimensionsPhoto.height.concat(e.target.height)
        		}
      		}); 
    	};

    	this.onHandleRemoveLike=(photo: Object): void => {
    		this.props.dispatch(removePhotoFromFavorite(photo));	
    	};

    	this.onHandleNavigateTo=(location: string): void => {
    		this.props.dispatch(push(location));
    	};
	}

	render() {
		const { currentPhotos }=this.props;

		const headerFavoritesContainer=(
			<div className="header-favorites">
				<div className="logo">
					<img className="img-responsive" src={require('two-polaroid-pictures.png')} />
					<p>photopage</p>
				</div>
				<div className="back">
					<Link to="/" onClick={() => { this.onHandleNavigateTo('/favorites') }}>Return back</Link>
				</div>
			</div>
		);

		if (currentPhotos.favorites.length > 0) {
			return (
				<div className="flex-markup">
					<div className="main-layer">
						{headerFavoritesContainer}
						<div className="block-images">
							{currentPhotos.favorites && currentPhotos.favorites.map((photo, index) => {
								const currentPhoto=`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
			         	 		const profilePhoto=`https://farm${photo.owner.iconfarm}.staticflickr.com/${photo.owner.iconserver}/buddyicons/${photo.owner.nsid}.jpg`;

								return [
									<div className="list" key={index}>
						            	<div className="photo-list-wrapper">
						                	<div className="photo">
						                  		<img className="img-responsive" src={currentPhoto} onLoad={this.imageInfo} alt="" />
						                	</div>
						                	<div className="button-like">
							                	<button type="button" className={ photo.likePhoto ? "like like-clicked" : "like" } style={{ 
							                		top: this.state.dimensionsPhoto.height[index] / 2 - 16 + 'px',
							                		left: this.state.dimensionsPhoto.width[index] / 2 - 16 + 'px'
							                	}} onClick={() => { this.onHandleRemoveLike(photo) }} />
							                	<div className={ photo.likePhoto ? "circles circles-clicked" : "circles" } style={{ 
							                		top: this.state.dimensionsPhoto.height[index] / 2 - 22 + 'px',
							                		left: this.state.dimensionsPhoto.width[index] / 2 - 20 + 'px'
							                	}} />                    
							                </div>
						                	<div className="clear" />
						                  	<div className="data-wrapper">
						                    	<div className="avatar">
						                      		<img src={Number(photo.owner.iconserver) !== 0 ? profilePhoto : require('avatar.svg')} />
						                    	</div>
						                    	<div className="data-details">
						                      		<div className="data-name">
						                        		<span>User name</span>
						                        		&nbsp;
						                        		<span>@{photo.owner.username}</span>
						                      		</div>
						                     	 	<div className="data-meta">
						                        		<span>{photo.title._content ? photo.title._content : 'No title'}</span>
						                        		<br />
								                        {photo.tags.tag[0] ? (
								                          	photo.tags.tag.map((tag, id) => {
								                            	return <span>{`#${tag.raw} `}</span>
								                          	})
								                        ) : (
								                          	<span>No tags</span>
								                        )} 
						                      		</div>
						                      		<div className="data-other-details">
						                        		<div className="data-time">
						                        			<img src={require('clock-circular-outline.png')} />
						                        			&nbsp;
						                        			<span>{new Date(photo.dates.taken).toLocaleString().replace(/\b(\d{1})\b/g, '0$1')}</span>
						                      			</div>
						                      			<div className="data-likes">
						                        			<img src={require('heart.png')} />
						                        			&nbsp;
						                        			<span>{photo.total}</span>
						                        			&nbsp;
						                        			<span>like</span>
						                      			</div>
						                      			<div className="location">
						                        			<img src={require('placeholder-filled-point.png')} />
						                        			&nbsp;
						                        			<span>{photo.location && photo.location.locality ? `${photo.location.locality._content}, ` : ''} {photo.location && photo.location.country ? `${photo.location.country._content}` : 'No location'}</span>
						                      			</div>
						                    		</div>
						                  		</div>
						                	</div>
						                	<div className="overlay"></div>
						              	</div>
						            </div>
								];
							})}
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="flex-markup">
					<div className="main-layer">
						{headerFavoritesContainer}
						<div className="not-favorites">
							<p>You haven't favorites photos at the moment.</p>
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

export default connect(mapStateToProps)(Favorites);