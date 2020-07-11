'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		overlay: false,
		///
		snackbars: [],
		///
		isElectron: process.env.IS_ELECTRON ? true : false,
		//
		player: null,
		playState: -1
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

		creatPlayer(state, yt) {
			state.player = yt;
			state.player.addEventListener('onStateChange', e => {
				state.playState = e;
			});
		},

		playVideo(state) {
			state.player.playVideo();
		},

		pauseVideo(state) {
			state.player.pauseVideo();
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
			state.player.setVolume(value);
		},

		destroyPlayer(state) {
			state.player.destroy();
			state.player = null;
			state.playState = -1;
		}
	},
	actions: {},
	modules: {}
});
