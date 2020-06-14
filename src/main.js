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
	$remote: {
		value: require('electron').remote
	},
	$sharp: {
		value: require('sharp')
	}
	// $clipboard: {
	// 	value: require('electron').clipboard
	// },
	// $nativeImage: {
	// 	value: require('electron').nativeImage
	// }
});

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
	///
	data() {
		return {
			windowIsMax: false,
			///
			webWidth: window.innerWidth,
			webHeight: window.innerHeight,
			screenWidth: window.screen.width,
			screenHeight: window.screen.height
		};
	},
	mounted() {
		window.onresize = () => {
			this.webWidth = window.innerWidth;
			this.webHeight = window.innerHeight;

			this.windowIsMax = this.$remote.BrowserWindow.getFocusedWindow().isMaximized();
			// console.log(this.$vuetify.breakpoint);
		};

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
