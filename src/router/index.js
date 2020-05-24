import Vue from 'vue';
import VueRouter from 'vue-router';
// import path from 'path';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
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
];

const router = new VueRouter({
	mode: process.env.IS_ELECTRON ? 'hash' : 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
