import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store/index';

export interface AppState {
	overlay: boolean;
	snackbars: { show: boolean; color: Colors | string; text: string; timeout: number }[];
	isElectron: boolean;
	picPath: string;
	playList: string[];
	videoID: string;
}

export enum Colors {
	Info = 'info',
	Primary = 'primary',
	Success = 'success',
	Warning = 'warning',
	Error = 'error'
}

@Module({ dynamic: true, store, name: 'app' })
class Common extends VuexModule implements AppState {
	public overlay = false;
	//
	public snackbars: { show: boolean; color: Colors | string; text: string; timeout: number }[] = [];
	//
	public isElectron = process.env.IS_ELECTRON ? true : false;
	//
	public picPath = '';
	//
	public playList: string[] = [];
	public videoID = '';

	/// getters
	get barsHidden(): number {
		return this.snackbars.filter(x => !x.show).length;
	}

	get barsVisible(): number {
		return this.snackbars.filter(x => x.show).length;
	}

	@Mutation
	emptySnackbars() {
		this.snackbars = [];
	}

	@Mutation
	changeOverlay(bool: boolean) {
		this.overlay = bool;
	}

	@Mutation
	snackbar(bar: { color?: Colors | string; timeout?: number; text?: string }) {
		this.snackbars.push({
			show: true,
			color: bar.color || Colors.Error,
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

	@Mutation
	setVideoID(id: string) {
		this.videoID = id;
	}
}

export const AppModule = getModule(Common);
