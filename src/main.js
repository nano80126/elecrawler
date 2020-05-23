import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

// import { adminDB, errorDB } from './plugins/nedb';

import './style.scss';

Object.defineProperties(Vue.prototype, {
	$moment: {
		value: require('moment')
	},
	$lodash: {
		value: require('lodash')
	},
	$dbList: {
		value: require('./plugins/nedb').listDB
	},
	// $dbError: {
	// 	value: errorDB
	// },
	$ipcRenderer: {
		value: require('electron').ipcRenderer
	},
	$dialog: {
		value: require('electron').remote.dialog
	}
});

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
	///
	mounted() {},
	watch: {},
	methods: {}
}).$mount('#app');
