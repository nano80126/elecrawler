'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isLogin: false,
		///
		isConnected: false,
		sampling: false,
		///
		isWebsocket: false,
		///
		snackbars: [],
		///
		isElectron: process.env.IS_ELECTRON ? true : false
	},
	getters: {
		barsHidden(state) {
			return state.snackbars.filter(x => !x.show).length;
		},

		barsVisible(state) {
			return state.snackbars.filter(x => x.show).length;
		}
	},
	mutations: {
		loginCheck(state, login) {
			state.isLogin = login;
		},

		changeConnected(state, value) {
			if (value) {
				state.isConnected = value;
			} else {
				// 否則 取消取樣
				state.isConnected = value;
				state.sampling = false;
			}
		},
		changeSampling(state, value) {
			state.sampling = value;
		},

		changeWebsocket(state, value) {
			state.isWebsocket = value;
		},

		snackbar(state, bar) {
			state.snackbars.push({
				show: true,
				color: bar.color || null,
				timeout: bar.timeout || 3000,
				text: bar.text || ''
			});
		}
	},
	actions: {},
	modules: {}
});
