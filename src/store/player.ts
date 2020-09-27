import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from './index';
import lyrics from './lyrics'; // for destroy lyrics obj

@Module({ dynamic: true, store, name: 'player' })
export default class Lyrics extends VuexModule {
	intervalArray: NodeJS.Timeout[] = [];
	player: YT.Player | null = null;
	playerLoop = false;
	playerShuffle = false;
	playerState = -1;
	playerVolume = 75;
	///

	get playState(): number {
		return this.playerState;
	}

	/// Mutation
	@Mutation
	pushIntervalArr(interval: NodeJS.Timeout) {
		this.intervalArray.push(interval);
	}

	@Mutation
	clearIntervalArr() {
		this.intervalArray.forEach(id => {
			clearInterval(id);
		});
		this.intervalArray = [];
	}

	@Mutation
	creatPlayer(yt: YT.Player) {
		this.player = yt;
		this.player.addEventListener('onStateChange', (e: YT.OnStateChangeEvent) => {
			this.playerState = e.data;
		});
	}

	@Mutation
	destroyPlayer() {
		if (this.player) {
			this.player.destroy();
			this.player = null;
			this.playerState = -1;
		}
		// if (this.lyricObj) this.lyricObj = null;
		lyrics.state.lyricObj = null;
	}

	@Mutation
	cuePlayerByID(id: string) {
		if (this.player) {
			this.player.cueVideoById({ videoId: id, suggestedQuality: 'small' });
			this.player.setVolume(this.playerVolume);
		}
	}

	@Mutation
	loadPlayerByID(id: string) {
		if (this.player) {
			this.player.loadVideoById({ videoId: id, suggestedQuality: 'small' });
			this.player.setVolume(this.playerVolume);
		}
	}

	@Mutation
	playVideo() {
		const state = this.player?.getPlayerState();
		if (state != -1 && state != 3) this.player?.playVideo();
	}

	@Mutation
	pauseVideo() {
		if (this.player?.getPlayerState() == 1) this.player.pauseVideo();
	}

	@Mutation
	backward10() {
		const curr = this.player?.getCurrentTime();
		if (curr) this.player?.seekTo(curr - 10, true);
	}

	@Mutation
	forward10() {
		const curr = this.player?.getCurrentTime();
		if (curr) this.player?.seekTo(curr + 10, true);
	}

	@Mutation
	videoProgress(value: number) {
		this.player?.seekTo(value, true);
	}

	@Mutation
	videoSetVolume(value: number) {
		this.playerVolume = value;
		this.player?.setVolume(value);
		if (value == 0) this.player?.mute();
		else this.player?.unMute();
	}

	@Mutation
	videoLoop(bool: boolean) {
		this.playerLoop = bool;
	}

	@Mutation
	videoShuffle(bool: boolean) {
		this.playerShuffle = bool;
	}
}
