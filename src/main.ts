import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { AppModule, Colors } from '@/store/modules/app';
import { PlayerModule } from '@/store/modules/player';
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/i18n';

// import path from 'path';
// import * as fs from 'fs';
// import { remote, IpcRenderer, Shell } from 'electron';
import { IpcRenderer, Shell } from 'electron';
// const { /*remote,*/ /*IpcRenderer,*/ ipcRenderer, shell } = window.require('electron');

import moment, { Moment, MomentInput } from 'moment';
import lodash, { LoDashStatic } from 'lodash';
import axios, { AxiosStatic } from 'axios';
import qs, { stringify } from 'qs';

import { LyModule } from '@/store/modules/lyrics';
import { IdisplayTxt, IlyricsDisplayObj, IlyricsObj, IsongList } from '@/types/renderer';
import '@/style.scss';

/// ///
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
	$qs: {
		value: qs
	},
	$shell: {
		value: process.env.IS_ELECTRON ? window.require('electron').shell : undefined
	},
	$ipcRenderer: {
		value: process.env.IS_ELECTRON ? window.require('electron').ipcRenderer : undefined
	}
});

declare global {
	/**window add YT interface */
	interface Window {
		YT: YT.Player;
	}
}

declare module 'vue/types/vue' {
	/**Vue add some module interfaces */
	interface Vue {
		$moment(input?: MomentInput): Moment;
		$axios: AxiosStatic;
		$lodash: LoDashStatic;
		$qs: { stringify: typeof stringify };

		// $sharp(input: Buffer | string): Sharp;
		// $sharpFit: FitEnum;
		$fs: { readdirSync: Function; unlink: Function; exists: Function; mkdir: Function };

		$ipcRenderer: IpcRenderer;
		$shell: Shell;
		// $picPath: string;

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
			screenHeight: window.screen.height,
			//

			colors: Object.freeze([
				'primary',
				'cyan',
				'success',
				'teal',
				'error',
				'warning',
				'yellow',
				'purple',
				'white',
				'grey',
				'black'
			])
		};
	},

	watch: {
		'$store.getters.playState'(state) {
			if (state == 0) {
				const loop = PlayerModule.playerLoop;
				const shuffle = PlayerModule.playerShuffle;
				if (loop) setTimeout(() => PlayerModule.playVideo(), 1500);
				else if (shuffle)
					setTimeout(() => {
						const arr = this.$lodash.without(AppModule.playList, AppModule.videoID);
						const videoID = arr[this.$lodash.random(0, arr.length - 1)];

						PlayerModule.loadPlayerByID(videoID);
						// code above for loading video

						// code below for get lyric object
						// if route is List enable
						if (this.$route.name == 'List') AppModule.changeOverlay(true);

						this.$ipcRenderer
							.invoke('listFindOne', {
								query: {
									videoArr: { $elemMatch: { videoID: videoID } }
								}
							})
							.then(async (doc: IsongList) => {
								const videoTitle = doc.videoArr?.find(e => e.videoID == videoID)?.videoTitle;
								const res = await this.$ipcRenderer.invoke('getLyrics', { url: doc.lyricsUrl });

								this.$nextTick(() => {
									const obj = res.obj as IlyricsObj;

									const lyricsObj: IlyricsDisplayObj = {
										lyricsKey: obj.lyricsKey,
										lyricsUrl: obj.lyricsUrl,
										title: obj.title,
										artist: obj.artist,
										lyrics: obj.lyrics,
										imagePath: doc.imagePath || undefined,
										imageSize: doc.imageSize || undefined
									};
									this.$emit('getLyricByID', lyricsObj);
									LyModule.saveLyric(lyricsObj);
									AppModule.setVideoTitle(videoTitle || '');
								});
							})
							.catch(err => {
								AppModule.snackbar({ text: err, color: 'error' });
							})
							.finally(() => {
								AppModule.changeOverlay(false);
							});
					}, 1500);
			}
		}
	},

	created() {
		// set theme dark
		this.$vuetify.theme.dark = true;
		//
		this.mkPicDir();
		//
		this.readConfig();
		//
		this.registerGlobalHotkey();
	},

	mounted() {
		if (process.env.NODE_ENV == 'development') console.warn('env', process.env);
		// ////
		/**註冊 resize 事件 */
		window.onresize = async () => {
			this.webWidth = window.innerWidth;
			this.webHeight = window.innerHeight;
			this.windowIsMax = await this.$ipcRenderer.invoke('isMaxmized');
		};

		this.loadUrlInList();
	},

	methods: {
		/**建立圖片資料夾 */
		mkPicDir() {
			this.$ipcRenderer.invoke('mkPicDir').then((res: { path: string }) => {
				console.info(`%c${res.path}`, `color: ${this.$vuetify.theme.themes.dark.success};`);
				AppModule.savePicPath(res.path);
			});
		},

		/**載入Config, text color and align */
		readConfig() {
			this.$ipcRenderer
				.invoke('readConfig')
				.then((res: IdisplayTxt) => {
					const { mainColor, subColor, textAlign } = res;
					LyModule.saveText({ mainColor, subColor, textAlign });
				})
				.catch(err => {
					AppModule.snackbar({ text: err, color: Colors.Error });
				});
		},

		/**載入Url List, 比對用 */
		loadUrlInList() {
			this.$ipcRenderer
				.invoke('listFind', { query: {}, sort: { datetime: 1 } })
				.then((doc: IsongList[]) => {
					const urlList = doc.map(item => item.lyricsUrl);
					AppModule.setUrlList(urlList);
				})
				.catch(err => {
					this.$store.commit('snackbar', { text: err, color: Colors.Error });
				});
		},

		/**  */
		registerGlobalHotkey() {
			this.$ipcRenderer.on('playVideo', () => {
				if (PlayerModule.player) {
					PlayerModule.playVideo();
				}
			});

			this.$ipcRenderer.on('pauseVideo', () => {
				if (PlayerModule.player) {
					PlayerModule.pauseVideo();
				}
			});

			this.$ipcRenderer.on('volumePlus', () => {
				if (PlayerModule.player) {
					PlayerModule.videoPlusVolume(5);
				}
			});

			this.$ipcRenderer.on('volumeMinus', () => {
				if (PlayerModule.player) {
					PlayerModule.videoMinusVolume(5);
				}
			});

			this.$ipcRenderer.on('volumeSet', (e, args) => {
				if (PlayerModule.player) {
					PlayerModule.videoSetVolume(args.vol);
				}
			});

			this.$ipcRenderer.on('videoSingle', () => {
				PlayerModule.videoLoop(false);
				PlayerModule.videoShuffle(false);
			});

			this.$ipcRenderer.on('videoLoop', () => {
				PlayerModule.videoLoop(true);
				PlayerModule.videoShuffle(false);
			});

			this.$ipcRenderer.on('videoShuffle', () => {
				PlayerModule.videoLoop(false);
				PlayerModule.videoShuffle(true);
			});
		}
	}
}).$mount('#app');
