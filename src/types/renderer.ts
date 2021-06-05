import { IconfigLocale, IconfigText, IlistCrawled, IlyricsCrawled } from '@/types';

/**main color, sub color, text align = IconfigText */
export type IdisplayText = IconfigText;

/**extend from config text and locale // 歌詞主顏色、副顏色、對齊 // 語系 */
export interface IdisplayConfig extends IconfigText, IconfigLocale {}

/**extend from list crawled and add exist value */
export interface IlistSearched extends IlistCrawled {
	exist: boolean;
}

/**interface for response object of invoke getLyrics */
export type IlyricsObj = IlyricsCrawled;

/**extend from lyrics crawled and add exist property */
export interface IlyricsSearched {
	obj: IlyricsCrawled;
	exist: boolean;
}

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
