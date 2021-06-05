/**interface of text config  */
export interface IconfigText {
	mainColor: string;
	subColor: string;
	textAlign: string;
}

export interface IconfigLocale {
	locale: string;
}

/**interface of text config and start window position */
export interface Iconfig extends IconfigText, IconfigLocale {
	x?: number;
	y?: number;
}

/**interface of song list crawled */
export interface IlistCrawled {
	id: number;
	artist: string;
	title: string;
	lyricsUrl: string;
	lyricsShort: string;
}

/**interface of lyrics object crawled */
export interface IlyricsCrawled {
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
