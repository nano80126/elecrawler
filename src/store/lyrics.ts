import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from './index';

interface LyricObject {
	key: string;
	url: string;
	title: string;
	artist: string;
	lyric: string;
	image?: string;
	imageSize: {};
}

interface LyricsTxtConf {
	main: string;
	sub: string;
	aligin: string;
}

@Module({ dynamic: true, store, name: 'lyrics' })
export default class Lyrics extends VuexModule {
	lyricObj: LyricObject | null = null;
	lyricText: LyricsTxtConf | null = null;
	///

	@Mutation
	saveLyric(obj: LyricObject) {
		this.lyricObj = obj;
	}

	@Mutation
	clearLyric() {
		this.lyricObj = null;
	}

	@Mutation
	saveText(txt: LyricsTxtConf) {
		this.lyricText = txt;
	}
}
