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
				: path.resolve(remote.app.getPath('exe'), '../pictures')
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
			windowIsMax: false, // used in app.vue for changing icon
			///
			webWidth: window.innerWidth,
			webHeight: window.innerHeight,
			screenWidth: window.screen.width,
			screenHeight: window.screen.height
		};
	},

	watch: {
		'$store.getters.playState'(state) {
			if (state == 0) {
				const loop = this.$store.state.playerLoop;
				const shuffle = this.$store.state.playerShuffle;
				if (loop) setTimeout(() => this.$store.commit('playVideo'), 1500);
				else if (shuffle)
					setTimeout(() => {
						const old = this.$store.state.player.getVideoData();
						const arr = this.$lodash.without(this.$store.state.playList, old.video_id);
						const videoID = arr[this.$lodash.random(0, arr.length - 1)];
						this.$store.commit('loadPlayerById', videoID);
						// code above for loading video // code below for get lyric object

						// if route is List enable
						if (this.$route.name == 'List') this.$store.commit('changeOverlay', true);
						this.$dbList.findOne({ ytID: videoID }, async (err, doc) => {
							if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
							const res = await this.$ipcRenderer.invoke('getLyric', { url: doc.lyricUrl });

							const obj = Object.freeze({
								key: res.lyricKey,
								url: res.url,
								title: res.mainTxt,
								artist: res.artist,
								lyric: res.lyricContent,
								image: doc.imagePath || null,
								imageSize: doc.imageSize || {}
							});
							this.$emit('getLyricByID', obj); // raise event for changing lyric obj in list.vue
							this.$store.commit('saveLyric', obj); // save lyric obj for loading display.vue
							this.$store.commit('changeOverlay', false); // disable overlay
						});
					}, 1500);
			}
		}
	},

	created() {
		// set theme dark
		this.$vuetify.theme.dark = true;

		// create pictures file if not exists
		this.$fs.exists(this.$picPath, exist => {
			if (!exist) {
				this.$fs.mkdir(this.$picPath, err => {
					if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
				});
			}
		});
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
