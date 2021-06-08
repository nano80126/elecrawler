import { Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import store from '@/store/index';
import { IdisplayText, IlyricsDisplayObj } from '@/types/renderer';

export interface LyricsState {
	lyricObj: IlyricsDisplayObj | null;
	lyricText: IdisplayText | null;
}

@Module({ dynamic: true, store, name: 'lyrics' })
class Lyrics extends VuexModule implements LyricsState {
	public lyricObj: IlyricsDisplayObj | null = null;
	public lyricText: IdisplayText | null = null;
	///

	@Mutation
	saveLyrics(obj: IlyricsDisplayObj): void {
		this.lyricObj = obj;
	}

	@Mutation
	clearLyric(): void {
		this.lyricObj = null;
	}

	/**save lyrics text config (color, sub color, align) */
	@Mutation
	saveTextConf(txt: IdisplayText): void {
		this.lyricText = txt;
	}
}

export const LyModule = getModule(Lyrics);
