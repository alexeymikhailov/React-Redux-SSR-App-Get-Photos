import AppRoot from 'AppRoot';
import Favorites from 'Favorites';

const routes=[
	{
		path: '/',
		exact: true,
		component: AppRoot
	},

	{
		path: '/favorites',
		component: Favorites
	}
];

export default routes;