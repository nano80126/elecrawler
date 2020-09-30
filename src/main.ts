import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { AppModule } from '@/store/modules/app';
import { PlayerModule } from '@/store/modules/player';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
// import { listDB, historyDB, NeDBStatic } from './plugins/nedb';

// import path from 'path';
// import * as fs from 'fs';
// import { remote, IpcRenderer, Shell } from 'electron';
const { /*remote,*/ IpcRenderer, ipcRenderer, shell } = window.require('electron');

import { Shell } from 'electron';

import moment, { Moment, MomentInput } from 'moment';
import lodash, { LoDashStatic } from 'lodash';
import axios, { AxiosStatic } from 'axios';
// import sharp, { Sharp, FitEnum } from 'sharp';

// import sharp, { FitEnum, Sharp, SharpOptions } from 'sharp';
// import {} } from "nedb"

// import { adminDB, errorDB } from './plugins/nedb';

// import { getModule } from 'vuex-module-decorators';

// import common from './store/modules/common';
// import lyrics from './store/modules/lyrics';
// import player from './store/modules/player';

// const $common = getModule(common);
// const $lyrics = getModule(lyrics);
// const $player = getModule(player);

import './style.scss';
import { IpcRenderer } from 'electron';

Object.defineProperties(Vue.prototype, {
	$moment: {
		value: moment
	},
	$lodash: {
		value: lodash
	},
	$axios: {
		value: axios
	},
	// $dbHistory: {
	// 	value: historyDB
	// },
	// $dbList: {
	// 	value: listDB
	// },

	$shell: {
		value: shell
	},
	$ipcRenderer: {
		value: ipcRenderer
	}
	// $sharp: {
	// 	value: sharp
	// },
	// $sharpFit: {
	// 	value: sharp.fit
	// },

	// $remote: {
	// 	value: remote
	// },
	// $picPath: {
	// 	value:
	// 		process.env.NODE_ENV == 'development'
	// 			? path.resolve(remote.app.getPath('pictures'), 'lyric_scrawer')
	// 			: path.resolve(remote.app.getPath('exe'), '../pictures')
	// }
});

declare global {
	interface Window {
		YT: YT.Player;
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$moment(input?: MomentInput): Moment;
		$axios: AxiosStatic;
		$lodash: LoDashStatic;

		// $sharp(input: Buffer | string): Sharp;
		// $sharpFit: FitEnum;
		$fs: { readdirSync: Function; unlink: Function; exists: Function; mkdir: Function };

		// $dbHistory: NeDBStatic;
		// $dbList: NeDBStatic;
		$ipcRenderer: IpcRenderer;
		$shell: Shell;
		// $picPath: string;

		///
		// webWidth: number;
		// webHeight: number;
		_events: { getLyricByID: [Function] };
	}
}

new Vue({
	router,
	store,
	vuetify,
	i18n,
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
				// const loop = this.$store.state.playerLoop;
				const loop = PlayerModule.playerLoop;
				// const shuffle = this.$store.state.playerShuffle;
				const shuffle = PlayerModule.playerShuffle;
				if (loop) setTimeout(() => this.$store.commit('playVideo'), 1500);
				else if (shuffle)
					setTimeout(() => {
						// const old = this.$store.state.player.getVideoData();
						// const old = (PlayerModule.player as YTPlayer).getVideoData();
						// const arr = this.$lodash.without(this.$store.state.playList, old.video_id);
						// const arr = this.$lodash.without(AppModule.playList, old.video_id);
						const arr = this.$lodash.without(AppModule.playList, AppModule.videoID);
						const videoID = arr[this.$lodash.random(0, arr.length - 1)];

						// console.log(PlayerModule.player);
						// console.log(old, videoID);
						console.log(arr, AppModule.playList);

						// this.$store.commit('loadPlayerById', videoID);
						PlayerModule.loadPlayerByID(videoID);

						// code above for loading video // code below for get lyric object

						// if route is List enable
						if (this.$route.name == 'List') this.$store.commit('changeOverlay', true);
						// this.$dbList.findOne({ 'ytObj.id': videoID }, async (err, doc) => {
						// findOne of ytObj arr has one of element match videoID

						this.$ipcRenderer
							.invoke('listFindOne', {
								query: {
									ytObj: { $elemMatch: { id: videoID } }
								}
							})
							.then(async doc => {
								console.log(doc);
								const res = await this.$ipcRenderer.invoke('getLyric', { url: doc.lyricUrl });

								console.log(res);

								this.$nextTick(() => {
									const { obj } = res;

									const lyObj = Object.freeze({
										key: obj.lyricKey,
										url: obj.url,
										title: obj.mainTxt,
										artist: obj.artist,
										lyric: obj.lyricContent,
										image: doc.imagePath || null,
										imageSize: doc.imageSize || {}
									});
									this.$emit('getLyricByID', lyObj);
									this.$store.commit('saveLyric', lyObj);
									this.$store.commit('changeOverlay', false);
								});
							})
							.catch(err => {
								this.$store.commit('snackbar', { text: err, color: 'error' });
							});

						/*
						this.$dbList.findOne({ ytObj: { $elemMatch: { id: videoID } } }, async (err, doc) => {
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
						});*/
					}, 1500);
			}
		}
	},

	created() {
		// set theme dark
		this.$vuetify.theme.dark = true;

		// create pictures file if not exists
		// this.$fs.exists(this.$picPath, (exist: boolean) => {
		// 	if (!exist) {
		// 		this.$fs.mkdir(this.$picPath, (err: string) => {
		// 			if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
		// 		});
		// 	}
		// });

		/** 
		this.$dbList.find({}).exec((err, doc) => {
			console.log('err', err);
			console.log('doc', doc);
		});
		*/

		// make pictures directory
		this.$ipcRenderer.invoke('mkPicDir').then((res: { path: string }) => {
			// this.$store.commit('savePicPath', res.path);
			// this.$store..common.commit('savePicPath', res.path);
			// $common.savePicPath(res.path);
			// this.$store.commit("")
			// $common.savePicPath(res.path);
			AppModule.savePicPath(res.path);
		});
	},

	mounted() {
		if (process.env.NODE_ENV == 'development') console.warn('env', process.env);
		// ////

		window.onresize = async () => {
			this.webWidth = window.innerWidth;
			this.webHeight = window.innerHeight;

			this.windowIsMax = await this.$ipcRenderer.invoke('isMaxmized');
		};

		console.log(this.$store);
		/**
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
		 */
	}
}).$mount('#app');
