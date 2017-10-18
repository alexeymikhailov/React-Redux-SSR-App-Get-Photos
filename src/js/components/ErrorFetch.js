/* @flow */

import React from 'react';

const ErrorMessage=({ error }: { error: string }) => {
	return (
		<div className="error-fetch-weather">
			<img src={require('robot.svg')} />
			<p>Oops, an error occured.</p>
			<h1>{ error }</h1>
		</div>
	);
}; 

export default ErrorMessage;