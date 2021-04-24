import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
// import path from 'path';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'Search',
		component: () => import(/* webpackChunkName */ '@/views/Search.vue')
	},
	{
		path: '/list',
		name: 'List',
		component: () => import(/* webpackChunkName */ '@/views/List.vue')
	}
	///
	// {
	// 	path: '/media/:a?',
	// 	name: 'Media',
	// 	component: () => import(/* webpackChunkName */ '@/components/Media.vue')
	// }
	// {
	// 	path: '/dev',
	// 	name: 'Media',
	// 	component: () => import(/* webpackChunkName */ '@/components/LyricMedia.vue')
	// },
	// {
	// 	path: '/test',
	// 	name: 'EmbedViedo',
	// 	component: () => import(/* webpackChunkName */ '@/components/Embed.vue')
	// }
];

const router = new VueRouter({
	mode: process.env.IS_ELECTRON ? 'history' : 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
