import { IconfigLocale, IcongiText, IlistCrawled, IlyricsObjCrawled } from '../main';

/**exten from config text and locale // 歌詞主顏色、副顏色、對齊 // 語系 */
export interface IdisplayTxt extends IcongiText, IconfigLocale {}

/**extend from list crawled add exist */
export interface IlistSearched extends IlistCrawled {
	exist: boolean;
}

/**extend from lyrics obj crawled add exist */
export interface IlyricsObjSearched {
	obj: IlyricsObjCrawled;
	exist: boolean;
}

/**interface for response object of invoke getLyrics */
export type IlyricsObj = IlyricsObjCrawled;

/**interface for display.vue lyrics object */
export interface IlyricsDisplayObj extends IlyricsObj {
	imagePath?: string;
	imageSize?: { width: number; height: number };
}

/**interface of keywords have searched */
export interface Ikeywords {
	artist: string;
	title: string;
	datetime: string;
}

/**interfave fot youtube url object */
export interface IyouTubeObj {
	videoID?: string;
	videoUrl: string;
	videoTitle?: string;
	artist?: string;
	cover?: boolean;
}

/**interface rect for icon region */
export interface Irectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**interface for list object saved in mongodb */
export interface IsongList {
	artist: string;
	title: string;
	lyricsUrl: string;
	lyricsKey: string;

	videoArr?: IyouTubeObj[];

	imagePath?: string;
	iconPath?: string;
	imageSize?: { width: number; height: number };
	rectangle?: Irectangle;

	datetime: string;
}

/**interface for list.vue with icon */
export interface IsongListWithIcon extends IsongList {
	icon: Buffer;
}

// /**enumerater of ipcMain.Send event for window control */
// export enum EwindowOn {
// 	WINDOWMIN = 'window-min',
// 	WINDOWMAX = 'window-max',
// 	WINDOWRESTORE = 'window-restore',
// 	WINDOWHIDE = 'window-hide',
// 	WINDOWCLOSE = 'window-close',
// 	WINDOWWIDTH = 'window-width',
// }

// /**enumerater of ipcMain.Send event for panel control */
// export enum EpanelSend {
// 	PANELSHOW = 'panel-show',
// 	PANELHIDE = 'panel-hide',
// }

/**enumerater of ipcRenderer.send event for tray control */
// export enum EtraySend {
// 	MODE = 'tray-mode',
// 	VOLUME = 'tray-volume',
// }

/**enumerator of ipcRenderer.on in main.ts */
// export enum EmodeOn {
// 	MODESINGLE = 'mode-single',
// 	MODELOOP = 'mode-loop',
// 	MODESHUFFLE = 'mode-shuffle',
// }

/**enumerator of ipcRenderer.on in main.ts */
// export enum EvolumeOn {
// 	VOLUMEPLUS = 'volume-plus',
// 	VOLUMEMINUS = 'volume-minus',
// 	VOLUMESET = 'volume-set',
// }
