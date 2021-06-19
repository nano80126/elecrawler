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
import { IdisplayConfig, IlyricsDisplayObj, IlyricsObj, IsongList } from '@/types/renderer';
import { EwindowOn, EtrayMode, EtrayVolume, EcrawlerOn, EfsOn, EplayHotkey } from '@/types/enum';
import '@/style.scss';

/// ///
Object.defineProperties(Vue.prototype, {
	$moment: {
		value: moment,
	},
	$lodash: {
		value: lodash,
	},
	$axios: {
		value: axios,
	},
	$qs: {
		value: qs,
	},
	$shell: {
		value: process.env.IS_ELECTRON ? window.shell : undefined,
	},
	$ipcRenderer: {
		value: process.env.IS_ELECTRON ? window.ipcRenderer : undefined,
	},
	$eventNames: {
		value: function () {
			return Object.keys(this._events);
		},
	},
});

// declare namespace YT {
// 	export class Player {}
// }

// type YTplayer = YT.Player;

// declare namespace YTP {
// 	type YTPlayer = YT.Player;
// }

declare global {
	/**window add YT interface */
	interface Window {
		YT: YT.Player;
		ipcRenderer: IpcRenderer;
		shell: Shell;
	}
}

declare module 'vue/types/vue' {
	/**Vue add some module interfaces */
	interface Vue {
		$moment(input?: MomentInput): Moment;
		$axios: AxiosStatic;
		$lodash: LoDashStatic;
		$qs: { stringify: typeof stringify };
		$ipcRenderer: IpcRenderer;
		$shell: Shell;
		$eventNames(): Array<string>;
		// _events: { getLyricByID: [Function] };
	}
}

new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: (h) => h(App),

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
				'black',
			]),
		};
	},

	watch: {
		'$store.getters.playState'(state: YT.PlayerState) {
			if (state == YT.PlayerState.ENDED) {
				const loop = PlayerModule.playerLoop;
				const shuffle = PlayerModule.playerShuffle;
				if (loop) window.setTimeout(() => PlayerModule.playVideo(), 1500);
				else if (shuffle)
					window.setTimeout(() => {
						// if route is List, show overlay
						if (this.$route.name == 'List') AppModule.changeOverlay(true);

						const arr = this.$lodash.without(AppModule.playList, PlayerModule.videoID);
						const videoID = arr[this.$lodash.random(0, arr.length - 1)];

						PlayerModule.loadPlayerByID(videoID);

						// code above for loading video
						console.warn(videoID);
						console.warn(this.$route.name);
						// code below for get lyric object

						this.$ipcRenderer
							.invoke('listFindOne', {
								query: {
									videoArr: { $elemMatch: { videoID: videoID } },
								},
							})
							.then(async (doc: IsongList) => {
								const videoTitle = doc.videoArr?.find((e) => e.videoID == videoID)?.videoTitle;
								// const res = await this.$ipcRenderer.invoke(EcrawlerOn.LYRICS, { url: doc.lyricsUrl });
								this.$ipcRenderer
									.invoke(EcrawlerOn.LYRICS, { url: doc.lyricsUrl })
									.then((doc2: { obj: IlyricsObj }) => {
										this.$nextTick(() => {
											const { obj } = doc2;

											const lyricsObj: IlyricsDisplayObj = {
												lyricsKey: obj.lyricsKey,
												lyricsUrl: obj.lyricsUrl,
												title: obj.title,
												artist: obj.artist,
												lyrics: obj.lyrics,
												imagePath: doc.imagePath || undefined,
												imageSize: doc.imageSize || undefined,
											};

											// this.$emit('getLyricByID', lyricsObj);
											LyModule.saveLyrics(lyricsObj);
											PlayerModule.setVideoTitle(videoTitle || '');
										});
									});
							})
							.catch((err) => {
								AppModule.snackbar({ text: err, color: Colors.Error });
							})
							.finally(() => {
								AppModule.changeOverlay(false);
							});
					}, 1500);
			}
		},
	},

	created() {
		// set theme dark
		this.$vuetify.theme.dark = true;
		//
		this.makePicDir();
		//
		this.readConfig();
		//
		this.registerGlobalHotkey();

		// window.test();
	},

	mounted() {
		if (process.env.NODE_ENV == 'development') console.warn('env', process.env);
		// ////
		/**註冊 resize 事件 */
		window.onresize = async () => {
			this.webWidth = window.innerWidth;
			this.webHeight = window.innerHeight;
			this.windowIsMax = await this.$ipcRenderer.invoke(EwindowOn.WINDOWMAXIMIZED);
		};

		this.loadUrlInList();

		this.$ipcRenderer.on('listFindTest', (e, args) => {
			// console.info(e);
			console.info(args);
		});

		/**web worker test */
		// const worker = new Worker('./worker/index.ts', { type: 'module' });
		// worker.addEventListener('message', msg => {
		// 	console.log(msg);
		// });
		// worker.postMessage('test');
	},

	methods: {
		/**建立圖片資料夾 */
		makePicDir() {
			this.$ipcRenderer.invoke(EfsOn.MAKEDIR).then((res: { path: string }) => {
				console.info(`%c${res.path}`, `color: ${this.$vuetify.theme.themes.dark.success};`);
				AppModule.savePicPath(res.path);
			});
		},

		/**載入Config, text color and align */
		readConfig() {
			this.$ipcRenderer
				.invoke(EfsOn.READCONFIG)
				.then((res: IdisplayConfig) => {
					const { mainColor, subColor, textAlign, locale } = res;

					if (locale) this.$i18n.locale = locale;
					LyModule.saveTextConf({ mainColor, subColor, textAlign });
				})
				.catch((err) => {
					AppModule.snackbar({ text: err, color: Colors.Error });
				});
		},

		/**註冊 global 熱鍵 */
		registerGlobalHotkey() {
			this.$ipcRenderer.on(EplayHotkey.PLAYVIDEO, () => {
				if (PlayerModule.player) {
					PlayerModule.playVideo();
				}
			});

			this.$ipcRenderer.on(EplayHotkey.PAUSEVIDEO, () => {
				if (PlayerModule.player) {
					PlayerModule.pauseVideo();
				}
			});

			this.$ipcRenderer.on(EtrayVolume.VOLUMEPLUS, () => {
				if (PlayerModule.player) {
					PlayerModule.videoPlusVolume(5);
				}
			});

			this.$ipcRenderer.on(EtrayVolume.VOLUMEMINUS, () => {
				if (PlayerModule.player) {
					PlayerModule.videoMinusVolume(5);
				}
			});

			this.$ipcRenderer.on(EtrayVolume.VOLUMESET, (e, args) => {
				if (PlayerModule.player) {
					PlayerModule.videoSetVolume(args.vol);
				}
			});

			this.$ipcRenderer.on(EtrayMode.MODESINGLE, () => {
				PlayerModule.videoLoop({ bool: false, toBackground: false });
				PlayerModule.videoShuffle({ bool: false, toBackground: false });
			});

			this.$ipcRenderer.on(EtrayMode.MODELOOP, () => {
				PlayerModule.videoLoop({ bool: true, toBackground: false });
				PlayerModule.videoShuffle({ bool: false, toBackground: false });
			});

			this.$ipcRenderer.on(EtrayMode.MODESHUFFLE, () => {
				PlayerModule.videoLoop({ bool: false, toBackground: false });
				PlayerModule.videoShuffle({ bool: true, toBackground: false });
			});
		},

		/**載入Url List, 比對用 */
		loadUrlInList() {
			this.$ipcRenderer
				.invoke('listFind', { query: {}, sort: { datetime: 1 } })
				.then((doc: IsongList[]) => {
					const urlList = doc.map((item) => item.lyricsUrl);
					AppModule.setUrlList(urlList);
				})
				.catch((err) => {
					this.$store.commit('snackbar', { text: err, color: Colors.Error });
				});
		},
	},
}).$mount('#app');
