import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from './index';

@Module({ dynamic: true, store, name: 'common' })
export default class Common extends VuexModule {
	overlay = false;
	//
	snackbars: { show: boolean; color: string; text: string; timeout: number }[] = [];
	//
	isElectron = process.env.IS_ELECTRON ? true : false;
	//
	picPath = '';
	//
	playList: string[] = [];

	/// getters
	get barsHidden(): number {
		return this.snackbars.filter(x => !x.show).length;
	}

	get barsVisible(): number {
		return this.snackbars.filter(x => x.show).length;
	}

	@Mutation
	changeOverlay(bool: boolean) {
		this.overlay = bool;
	}

	@Mutation
	snackbar(bar: { show: boolean; color?: string; timeout?: number; text?: string }) {
		this.snackbars.push({
			show: true,
			color: bar.color || 'error',
			timeout: bar.timeout || 3000,
			text: bar.text || ''
		});
	}

	@Mutation
	savePicPath(path: string) {
		this.picPath = path;
	}

	@Mutation
	setPlayList(list: string[]) {
		this.playList = list;
	}
}
