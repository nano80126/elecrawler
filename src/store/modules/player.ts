import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store/index';
import { LyModule } from './lyrics'; // for destroy lyrics obj
import { EtrayOn } from '@/types/enum';

export interface PlayerState {
	intervalArray: Array<number>;
	/**播放器 */
	player: YT.Player | null;
	/**循環播放 */
	playerLoop: boolean;
	/**隨機播放 */
	playerShuffle: boolean;
	/**播放器狀態 */
	playerState: YT.PlayerState;
	/**播放器音量 */
	playerVolume: number;
	/**播放中 Video ID */
	videoID: string;
	/**播放中 video title */
	videoTitle: string;
}

@Module({ dynamic: true, store, name: 'player' })
export default class Player extends VuexModule implements PlayerState {
	public intervalArray: Array<number> = [];
	public player: YT.Player | null = null;
	public playerLoop = false;
	public playerShuffle = false;
	public playerState = -1;
	public playerVolume = 75;
	///
	public videoID = '';
	public videoTitle = '';

	/**播放狀態 */
	get playState(): number {
		return this.playerState;
	}

	/**音量大小, Default 75 */
	get volume(): number {
		return this.playerVolume;
	}

	/// Mutation

	/**紀錄interval ID, 之後清除使用 */
	@Mutation
	pushIntervalArr(interval: number): void {
		this.intervalArray.push(interval);
	}

	/**清除所有interval ID */
	@Mutation
	clearIntervalArr(): void {
		this.intervalArray.forEach((id) => {
			clearInterval(id);
		});
		this.intervalArray = [];
	}

	@Mutation
	createPlayer(yt: YT.Player): void {
		this.player = yt;
		this.player.addEventListener('onStateChange', (e: YT.OnStateChangeEvent) => {
			this.playerState = e.data;

			if (e.data == YT.PlayerState.PLAYING) {
				this.player?.setVolume(this.playerVolume);
			}
		});
	}

	@Mutation
	changeState(state: YT.PlayerState): void {
		this.playerState = state;
	}

	@Mutation
	destroyPlayer(): void {
		if (this.player) {
			this.player.destroy();
			this.player = null;
			this.playerState = -1;
		}
		// if (this.lyricObj) this.lyricObj = null;
		// lyrics.state.lyricObj = null;
		LyModule.clearLyric();
	}

	@Mutation
	cuePlayerByID(id: string): void {
		if (this.player) {
			this.player.cueVideoById({ videoId: id, suggestedQuality: 'small' });
			// this.player.setVolume(this.playerVolume);
			this.videoID = id;
			// AppModule.setVideoID(id);
		}
	}

	@Mutation
	loadPlayerByID(id: string): void {
		if (this.player) {
			this.player.loadVideoById({ videoId: id, suggestedQuality: 'small' });
			// this.player.setVolume(this.playerVolume);
			this.videoID = id;
			// AppModule.setVideoID(id);
		}
	}

	@Mutation
	playVideo(): void {
		const state = this.player?.getPlayerState();
		if (state != -1 && state != 3) this.player?.playVideo();
	}

	@Mutation
	pauseVideo(): void {
		if (this.player?.getPlayerState() == 1) this.player.pauseVideo();
	}

	@Mutation
	backward10(): void {
		const curr = this.player?.getCurrentTime();
		if (curr) this.player?.seekTo(curr - 10, true);
	}

	@Mutation
	forward10(): void {
		const curr = this.player?.getCurrentTime();
		if (curr) this.player?.seekTo(curr + 10, true);
	}

	@Mutation
	videoProgress(value: number): void {
		this.player?.seekTo(value, true);
	}

	/**變更音量 */
	@Mutation
	videoSetVolume(value: number): void {
		this.playerVolume = value;
		this.player?.setVolume(value);
		window.ipcRenderer.send(EtrayOn.VOLUME, { volume: value });
	}

	/**音量 + */
	@Mutation
	videoPlusVolume(value: number): void {
		if (this.playerVolume + value > 100) this.playerVolume = 100;
		else this.playerVolume += value;

		this.player?.setVolume(this.playerVolume);
		window.ipcRenderer.send(EtrayOn.VOLUME, { volume: this.playerVolume });
	}

	/**音量 - */
	@Mutation
	videoMinusVolume(value: number): void {
		if (this.playerVolume - value < 0) this.playerVolume = 0;
		else this.playerVolume -= value;

		this.player?.setVolume(this.playerVolume);
		window.ipcRenderer.send(EtrayOn.VOLUME, { volume: this.playerVolume });
	}

	/**變更 loop */
	@Mutation
	videoLoop(/**new value */ bool: boolean, /**send to background? */ toBackground: boolean): void {
		this.playerLoop = bool;
		if (toBackground) window.ipcRenderer.send(EtrayOn.MODE, { loop: bool });
	}

	/**變更 shffle */
	@Mutation
	videoShuffle(/**new value */ bool: boolean, /**send to background? */ toBackground: boolean): void {
		this.playerShuffle = bool;
		if (toBackground) window.ipcRenderer.send(EtrayOn.MODE, { shuffle: bool });
	}

	/**更改播放中影片ID */
	@Mutation
	setVideoID(id: string): void {
		this.videoID = id;
	}

	/**更改播放中標題 */
	@Mutation
	setVideoTitle(title: string): void {
		this.videoTitle = title;
	}
}

export const PlayerModule = getModule(Player);
