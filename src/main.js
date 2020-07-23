import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import path from 'path';
import { remote } from 'electron';
// import fs from 'fs';

// import { adminDB, errorDB } from './plugins/nedb';

import './style.scss';

Object.defineProperties(Vue.prototype, {
	$moment: {
		value: require('moment')
	},
	$lodash: {
		value: require('lodash')
	},
	// $axiosMain: {
	// 	value: remote.require('axios')
	// },
	$dbHistory: {
		value: require('./plugins/nedb').historyDB
	},
	$dbList: {
		value: require('./plugins/nedb').listDB
	},
	// $dbLyric: {
	// 	value: require('./plugins/nedb').lyricDB
	// },
	$shell: {
		value: require('electron').shell
	},
	$ipcRenderer: {
		value: require('electron').ipcRenderer
	},
	$sharp: {
		value: require('sharp')
	},
	$fs: {
		value: require('fs')
	},
	$remote: {
		value: remote
	},
	$picPath: {
		value:
			process.env.NODE_ENV == 'development'
				? path.resolve(remote.app.getPath('pictures'), 'lyric_scrawer')
				: path.resolve(remote.app.getPath('exe'), '../pic')
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

	watch: {
		'$store.getters.playState'(state) {
			console.log(state);
			if (state == 0) {
				const loop = this.$store.state.playerLoop;
				if (loop) setTimeout(() => this.$store.commit('playVideo'), 1500);
			}
		}
	},

	created() {
		this.$vuetify.theme.dark = true;
	},

	mounted() {
		window.onresize = () => {
			this.webWidth = window.innerWidth;
			this.webHeight = window.innerHeight;

			this.windowIsMax = this.$remote.BrowserWindow.getFocusedWindow().isMaximized();
			// console.log(this.$vuetify.breakpoint);
		};

		// 刪除15天前的搜尋紀錄
		this.$dbHistory.remove(
			{
				datetime: {
					$lt: this.$moment()
						.add(-15, 'days')
						.format('YYYY-MM-DD HH:mm:ss')
				}
			},
			{ multi: true },
			err => {
				if (err) console.warn(err);
				// console.log(num);
			}
		);
	},
	methods: {}
}).$mount('#app');
