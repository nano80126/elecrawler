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
	$dbHistory: {
		value: require('./plugins/nedb').historyDB
	},
	$dbList: {
		value: require('./plugins/nedb').listDB
	},
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
	mounted() {
		// 刪除5天前的搜尋紀錄
		this.$dbHistory.remove(
			{
				datetime: {
					$lt: this.$moment()
						.add(-15, 'days')
						.format('YYYY-MM-DD HH:mm:ss')
				}
			},
			{ multi: true },
			(err, num) => {
				if (err) console.warn(err);
				console.log(num);
			}
		);
	},
	methods: {}
}).$mount('#app');
