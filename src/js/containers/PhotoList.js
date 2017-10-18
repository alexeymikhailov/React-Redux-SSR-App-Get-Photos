/* @flow */

type Props={
    currentListPhotos: Array<Object>,
    onLikePhoto: Function
};

type State={
    dimensionsPhoto: {
        width: Array<number>,
        height: Array<number>
    }
};

import React, { Component } from 'react';

class PhotoList extends Component<Props, State> {
    state: State;

    imageInfo: Function;

    e: Event & { target: EventTarget };

    constructor(props: Props) {
        super(props);
    
        this.state={
            dimensionsPhoto: {
                width: [],
                height: []
            }
        };

        this.imageInfo=(e): void => {
            e.preventDefault();

            this.setState({
                dimensionsPhoto: {
                    width: this.state.dimensionsPhoto.width.concat(e.target.width),
                    height: this.state.dimensionsPhoto.height.concat(e.target.height)
                }
            }); 
        };
    }

    render() {
        return (
  	        <div className="block-images">
                {this.props.currentListPhotos && this.props.currentListPhotos.map((photo, index) => {
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
                                    }} onClick={() => { this.props.onLikePhoto(photo) }} />
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
                                                <span className="clock" />
                                                &nbsp;
                                                <span>{new Date(photo.dates.taken).toLocaleString().replace(/\b(\d{1})\b/g, '0$1')}</span>
                                            </div>
                                            <div className="data-likes">
                                                <span className="heart" />
                                                &nbsp;
                                                <span>{photo.total}</span>
                                                &nbsp;
                                                <span>like</span>
                                            </div>
                                            <div className="location">
                                                <span className="placeholder-pointer" />
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
  	    );
    }
}

export default PhotoList;