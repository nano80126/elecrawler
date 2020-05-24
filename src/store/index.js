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
		}
	},
	actions: {},
	modules: {}
});
