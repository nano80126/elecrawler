/**interface of text config  */
export interface ItextConfig {
	mainColor: string;
	subColor: string;
	textAlign: string;
}

/**interface of text config and start window position */
export interface Iconfig {
	x?: number;
	y?: number;
}

/**interface of song list crawled */
export interface IlistCrawled {
	id: number;
	artist: string;
	title: string;
	lyricsUrl: string;
	lyricsFront: string;
}

/**interface of lyrics object crawled */
export interface IlyricsObjCrawled {
	artist: string;
	title: string;
	lyricsUrl: string;
	lyricsKey: string;
	lyrics: string;
}

/**interface of lyrics object pass through main process */
export interface IchannelLyricsObj {
	artist: string;
	title: string;
	lyricsKey: string;
	lyricsUrl: string;
}

/**enumerater of ipcMain.on event for window control */
export enum EwindowOn {
	WINDOWMIN = 'window-min',
	WINDOWMAX = 'window-max',
	WINDOWRESTORE = 'window-restore',
	WINDOWHIDE = 'window-hide'
}

/**enumerater of ipcMain.on event for tray control */
export enum EtrayOn {
	MODE = 'tray-mode',
	VOLUME = 'tray-volume'
}

/**enumerator of ipcMain.send to main.ts */
export enum EmodeSend {
	MODESINGLE = 'mode-single',
	MODELOOP = 'mode-loop',
	MODESHUFFLE = 'mode-shuffle'
}

/**enumerator of ipcMain.send to main.ts */
export enum EvolumeSend {
	VOLUMEPLUS = 'volume-plus',
	VOLUMEMINUS = 'volume-minus',
	VOLUMESET = 'volume-set'
}
