import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from './index';

@Module({ dynamic: true, store, name: 'mymod' })
export default class MyModule extends VuexModule {
	overlay = false;
	//
	snackbars: { show: boolean; color: string; text: string; timeout: number }[] = [];
	//
	isElectron = process.env.IS_ELECTRON ? true : false;
	//
	lyricObj = null;
	lyricText = '';
	//
	intervalArray: NodeJS.Timeout[] = [];
	player: YT.Player | null = null;
	playerLoop = false;
	playerShuffle = false;
	playState = -1;
	playerVolume = 75;
	playList = [];
	//
	picPath = '';

	get barsHidden(): number {
		return this.snackbars.filter(x => !x.show).length;
	}

	get barsVisible(): number {
		return this.snackbars.filter(x => x.show).length;
	}

	get playState1(): number {
		return this.playState;
	}

	@Mutation
	changeOverlay(bool: boolean) {
		this.overlay = bool;
	}

	snackbar(bar: { show: boolean; color?: string; timeout?: number; text?: string }) {
		this.snackbars.push({
			show: true,
			color: bar.color || 'error',
			timeout: bar.timeout || 3000,
			text: bar.text || ''
		});
	}

	savePicPath(path: string) {
		this.picPath = path;
	}

	saveLyric(obj) {
		this.lyricObj = obj;
	}

	saveText(txt: string) {
		this.lyricText = txt;
	}

	clearLyric() {
		if (this.lyricObj) this.lyricObj = null;
	}

	pushIntervalArr(interval: NodeJS.Timeout) {
		this.intervalArray.push(interval);
	}

	clearIntervalArr() {
		this.intervalArray.forEach(id => {
			clearInterval(id);
		});
		this.intervalArray = [];
	}

	creatPlayer(yt: YT.Player) {
		this.player = yt;
		this.player.addEventListener('onStateChange', (e: YT.OnStateChangeEvent) => {
			this.playState = e.data;
		});
	}

	cuePlayerByID(id: string) {
		if (this.player) {
			this.player.cueVideoById({ videoId: id, suggestedQuality: 'small' });
			this.player.setVolume(this.playerVolume);
		}
	}

	loadPlayerByID(id: string) {
		if (this.player) {
			this.player.loadVideoById({ videoId: id, suggestedQuality: 'small' });
			this.player.setVolume(this.playerVolume);
		}
	}

	playVidio() {
		const state = this.player?.getPlayerState();
		if (state != -1 && state != 3) this.player?.playVideo();
	}

	pauseVideo() {
		if (this.player?.getPlayerState() == 1) this.player.pauseVideo();
	}

	backward10() {
		const curr = this.player?.getCurrentTime();
		if (curr) this.player?.seekTo(curr - 10, true);
	}

	forward10() {
		const curr = this.player?.getCurrentTime();
		if (curr) this.player?.seekTo(curr + 10, true);
	}

	videoProgress(value: number) {
		this.player?.seekTo(value, true);
	}

	videoSetVolume(value: number) {
		this.playerVolume = value;
		this.player?.setVolume(value);
		if (value == 0) this.player?.mute();
		else this.player?.unMute();
	}

	videoLoop(bool: boolean) {
		this.playerLoop = bool;
	}

	videoShuffle(bool: boolean) {
		this.playerShuffle = bool;
	}

	destroyPlayer() {
		if (this.player) {
			this.player.destroy();
			this.player = null;
			this.playState = -1;
		}
		if (this.lyricObj) this.lyricObj = null;
	}

	setPlayList(list) {
		this.playList = list;
	}
}
