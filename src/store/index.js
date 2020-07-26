'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import { stat } from 'fs';
// import { resolve } from 'core-js/fn/promise';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		overlay: false,
		///
		snackbars: [],
		///
		isElectron: process.env.IS_ELECTRON ? true : false,
		//
		lyricObj: null,
		player: null,
		playerLoop: false,
		playerShuffle: false,
		playState: -1,
		playerVolume: 75,
		playList: []
	},
	getters: {
		barsHidden(state) {
			return state.snackbars.filter(x => !x.show).length;
		},

		barsVisible(state) {
			return state.snackbars.filter(x => x.show).length;
		},

		playState(state) {
			return state.playState;
		}
	},
	mutations: {
		changeOverlay(state, bool) {
			state.overlay = bool;
		},

		snackbar(state, bar) {
			state.snackbars.push({
				show: true,
				color: bar.color || null,
				timeout: bar.timeout || 3000,
				text: bar.text || ''
			});
		},

		saveLyric(state, obj) {
			state.lyricObj = obj;
		},

		clearLyric(state) {
			if (state.lyricObj) {
				state.lyricObj = null;
			}
		},

		creatPlayer(state, yt) {
			state.player = yt;
			state.player.addEventListener('onStateChange', e => {
				state.playState = e.data;
			});
		},

		cuePlayerById(state, id) {
			if (state.player) {
				state.player.cueVideoById({ videoId: id, suggestedQuality: 'small' });
				state.player.setVolume(stat.playerVolume);
			}
		},

		loadPlayerById(state, id) {
			if (state.player) {
				state.player.loadVideoById({ videoId: id, suggestedQuality: 'small' });
				state.player.setVolume(stat.playerVolume);
			}
		},

		playVideo(state) {
			// 確認可播放
			if (state.playState != -1 || state.playState != 3) state.player.playVideo();
			if (state.player.isMuted()) state.player.unMute(); // 若靜音則開啟
		},

		pauseVideo(state) {
			// 確認播放中
			if (state.playState == 1) state.player.pauseVideo();
		},

		backward10(state) {
			const curr = state.player.getCurrentTime();
			state.player.seekTo(curr - 10);
		},

		forward10(state) {
			const curr = state.player.getCurrentTime();
			state.player.seekTo(curr + 10);
		},

		videoProgress(state, value) {
			state.player.seekTo(value);
		},

		videoSetVolume(state, value) {
			state.playerVolume = value;
			state.player.setVolume(value);
			if (value == 0) state.player.mute();
			else state.player.unMute();
		},

		videoLoop(state, bool) {
			// state.player.setLoop(bool);
			state.playerLoop = bool;
		},

		videoShuffle(state, bool) {
			state.playerShuffle = bool;
		},

		destroyPlayer(state) {
			if (state.player) {
				state.player.destroy();
				state.player = null;
				state.playState = -1;
			}
			if (state.lyricObj) state.lyricObj = null;
		},

		setPlayList(state, list) {
			state.playList = list;
		}
	},
	actions: {},
	modules: {}
});
