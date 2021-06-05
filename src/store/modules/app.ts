import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store/index';

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
	snackbars: Isnackbar[];
	/**是否為 electron */
	isElectron: boolean;
	/**圖片路徑 */
	picPath: string;
	/**後端 port */
	port: number;
	/**播放列表 video ID */
	playList: string[];
	/**歌詞列表 Lyrics Url */
	urlList: string[];
}

@Module({ dynamic: true, store, name: 'app' })
class Common extends VuexModule implements AppState {
	public subWindow: Window | null = null;
	public overlay = false;
	//
	public snackbars: Array<Isnackbar> = [];
	//
	public isElectron = process.env.IS_ELECTRON ? true : false;
	public picPath = '';
	public port = 0;

	public playList: Array<string> = [];
	public urlList: Array<string> = [];

	/// getters
	get barsHidden(): number {
		return this.snackbars.filter((x) => !x.show).length;
	}

	get barsVisible(): number {
		return this.snackbars.filter((x) => x.show).length;
	}

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
	}

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
