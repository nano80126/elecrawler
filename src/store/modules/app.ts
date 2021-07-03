import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store/index';
import { first, last, shuffle } from 'lodash';
import { PlayerModule } from './player';

/**snackbar 顏色 */
export enum Colors {
	Info = 'info',
	Primary = 'primary',
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
}

export interface Isnackbar {
	show: boolean;
	color: Colors;
	text: string;
	timeout: number;
}

export interface AppState {
	/**子視窗 Window */
	subWindow: Window | null;
	/**overlay 是否顯示 */
	overlay: boolean;
	/**snackbar array */
	snackbars: Isnackbar[];
	/**是否為 development */
	isDev: boolean;
	/**是否為 electron */
	isElectron: boolean;
	/**是否為主視窗 */
	isMain: boolean;
	/**後端 port */
	port: number;
	/**圖片路徑 */
	picPath: string;
	/**播放列表 video ID */
	playList: string[];
	/**隨機播放列表 */
	shuffledPlayList: string[];
	/**歌詞列表 Lyrics Url, 用來比對是否已經在列表裡 */
	urlList: string[];
}

@Module({ dynamic: true, store, name: 'app' })
class Common extends VuexModule implements AppState {
	public subWindow: Window | null = null;
	public overlay = false;
	//
	public snackbars: Array<Isnackbar> = [];
	//
	public isDev = process.env.NODE_ENV == 'development' ? true : false;
	public isElectron = process.env.IS_ELECTRON ? true : false;
	public isMain = false;
	public port = 0;
	public picPath = '';
	//
	public playList: Array<string> = [];
	public shuffledPlayList: Array<string> = [];
	public urlList: Array<string> = [];

	/**隱藏的snackbars */
	get barsHidden(): number {
		return this.snackbars.filter((x) => !x.show).length;
	}

	/**可見的snackbars */
	get barsVisible(): number {
		return this.snackbars.filter((x) => x.show).length;
	}

	/**上一首排序 videoID */
	get lastOrderedVideoID(): string {
		const idx = this.playList.indexOf(PlayerModule.videoID);
		if (this.playList[idx - 1]) {
			return this.playList[idx - 1];
		} else {
			return last(this.playList) as string;
		}
	}

	/**下一首排序 videoID */
	get nextOrderedVideoID(): string {
		const idx = this.playList.indexOf(PlayerModule.videoID);
		if (this.playList[idx + 1]) {
			return this.playList[idx + 1];
		} else {
			return first(this.playList) as string;
		}
	}

	/**上一首隨機 videoID */
	get lastShuffledVideoID(): string {
		const idx = this.shuffledPlayList.indexOf(PlayerModule.videoID);
		if (this.shuffledPlayList[idx - 1]) {
			return this.shuffledPlayList[idx - 1];
		} else {
			return last(this.shuffledPlayList) as string;
		}
	}

	/**下一首隨機 videoID */
	get nextShuffledVideoID(): string {
		const idx = this.shuffledPlayList.indexOf(PlayerModule.videoID);
		if (this.shuffledPlayList[idx + 1]) {
			return this.shuffledPlayList[idx + 1];
		} else {
			return first(this.shuffledPlayList) as string;
		}
	}

	// /**亂數playList */
	// get randomPlayList(): string[] {
	// 	return shuffle(this.playList);
	// }

	@Mutation
	setSubWindow(window: Window | null): void {
		this.subWindow = window;
	}

	@Mutation
	emptySnackbars(): void {
		this.snackbars = [];
	}

	@Mutation
	changeOverlay(bool: boolean): void {
		this.overlay = bool;
	}

	@Mutation
	snackbar(bar: { color?: Colors; timeout?: number; text?: string }): void {
		this.snackbars.push({
			show: true,
			color: bar.color || Colors.Error,
			timeout: bar.timeout || 3000,
			text: bar.text || '',
		});
	}

	/**設為主視窗 */
	@Mutation
	setMain(bool: boolean) {
		this.isMain = bool;
	}

	/**變更 圖片 儲存路徑 */
	@Mutation
	savePicPath(path: string): void {
		this.picPath = path;
	}

	/**變更 Port */
	@Mutation
	changePort(port: number): void {
		this.port = port;
	}

	/**儲存播放列表 */
	@Mutation
	setPlayList(list: string[]): void {
		this.playList = list;

		if (this.shuffledPlayList.length == 0) this.shuffledPlayList = shuffle(this.playList);
	}

	// /**洗牌播放列表 */
	// @Mutation
	// setShufflePlayList() {
	// 	this.shuffledPlayList = shuffle(this.playList);
	// }

	/**儲存歌詞URL列表 */
	@Mutation
	setUrlList(list: string[]): void {
		this.urlList = list;
	}

	/**新增歌詞URL進列表 */
	@Mutation
	addUrlList(url: string): void {
		this.urlList.push(url);
	}
}

export const AppModule = getModule(Common);
