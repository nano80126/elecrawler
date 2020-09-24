<template>
	<div>
		<v-card-actions>
			<v-list class="py-0" dense width="100%" color="transparent">
				<v-list-item :disabled="!player">
					<v-list-item-content>
						<div class="d-flex align-center progress-container">
							<span>{{ $moment.utc(progressCurr * 1000).format('mm:ss') }}</span>
							<v-progress-linear
								v-model="progress"
								class="my-0 mx-3"
								height="4"
								@change="progressChange"
								style="cursor: pointer;"
							/>
							<span>{{ $moment.utc(progressMax * 1000).format('mm:ss') }}</span>
						</div>
					</v-list-item-content>

					<v-spacer v-show="$root.webWidth > 1200" />

					<v-list-item-icon class="mr-3 align-center">
						<v-menu
							open-on-hover
							top
							offset-y
							:close-on-content-click="false"
							nudge-left="42"
							nudge-top="10"
							close-delay="1500"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon @click="volumeToggle" v-bind="attrs" v-on="on" :disabled="!player">
									<v-icon small v-if="volume > 40">fas fa-volume-up</v-icon>
									<v-icon small v-else-if="volume > 0">fas fa-volume-down</v-icon>
									<v-icon small v-else>fas fa-volume-mute</v-icon>
								</v-btn>
							</template>
							<v-card width="120px" class="px-1 no-drag" style="overflow: hidden;" color="grey darken-2">
								<v-slider
									v-model="volume"
									color="grey lighten-2"
									hide-details
									@end="volumeChange"
									@click="volumeChange"
								/>
							</v-card>
						</v-menu>
					</v-list-item-icon>

					<!-- {{ playState }}
					{{ $store.state.playState }} -->
					<!-- {{ sheet }} -->

					<!-- <v-list-item-icon class="align-center">
					<v-btn icon @click="backward10">
						<v-icon small>fas fa-backward</v-icon>
					</v-btn>
				</v-list-item-icon> -->

					<v-list-item-icon class="align-center">
						<v-btn icon @click="backward10" :disabled="!player">
							<v-icon small>fas fa-backward</v-icon>
						</v-btn>
						<!--  -->
						<v-btn icon v-if="canPlay" @click="videoStart" :disabled="!player">
							<v-icon small v-if="playState == 2 || playState == 5">fas fa-play</v-icon>
							<v-icon small v-else>fas fa-undo</v-icon>
						</v-btn>
						<v-btn icon v-else @click="videoPause" :disabled="!player">
							<v-icon small>fas fa-pause</v-icon>
						</v-btn>
						<!--  -->
						<v-btn icon @click="forward10" :disabled="!player">
							<v-icon small>fas fa-forward</v-icon>
						</v-btn>

						<v-menu top left offset-y nudge-top="10">
							<template v-slot:activator="{ attrs, on }">
								<v-btn icon v-bind="attrs" v-on="on" :disabled="!player">
									<v-icon small> fas fa-ellipsis-h</v-icon>
								</v-btn>
							</template>
							<v-list width="250px" flat class="py-0 grey darken-2">
								<v-list-item @click.prevent="toggleLoop">
									<v-list-item-title class="d-flex">
										<v-icon small class="mr-3">fas fa-retweet</v-icon>
										<span>ループ再生</span>
										<v-icon v-show="loop" class="ml-auto" small>fas fa-check</v-icon>
									</v-list-item-title>
								</v-list-item>
								<v-list-item @click.prevent="toggleShuffle">
									<v-list-item-title class="d-flex">
										<v-icon small class="mr-3">fas fa-random</v-icon>
										<span>シャッフル再生</span>
										<v-icon v-show="shuffle" class="ml-auto" small>fas fa-check</v-icon>
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-list-item-icon>

					<!-- <v-list-item-icon class="ml-0 align-center">
					<v-btn icon @click="forward10">
						<v-icon small>fas fa-forward</v-icon>
					</v-btn>
				</v-list-item-icon> -->
				</v-list-item>
			</v-list>
		</v-card-actions>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Embed extends Vue {
	@Prop() videoID?: string;
	@Prop() sheet?: boolean;

	private progressCurr = 0;
	private progressMax = 0;

	private volume = 75;
	private volumeBack = 75;

	private playState = -1;
	// private s = stata.a;

	get canPlay() {
		return this.playState == 0 || this.playState == 2 || this.playState == 5;
	}

	get player() {
		return this.$store.state.player;
	}

	get loop(): boolean {
		return this.$store.state.playerLoop;
	}

	set loop(value) {
		this.$store.commit('videoLoop', value);
	}

	get shuffle(): boolean {
		return this.$store.state.playerShuffle;
	}

	set shuffle(value) {
		this.$store.commit('videoShuffle', value);
	}

	get progress() {
		return (this.progressCurr / this.progressMax) * 100;
	}

	set progress(value) {
		this.progressCurr = (this.progressMax * value) / 100;
	}

	@Watch('$store.getters.playState')
	onPlayStateChange(state: number) {
		// console.log(state);
		this.playState = state;

		this.$store.commit('clearIntervalArr');
		switch (state) {
			case -1:
				this.progress = 0;
				this.$nextTick(() => (this.progressMax = 0));
				break;
			case 0:
				this.progressCurr = this.progressMax;
				break;
			case 1:
				this.$store.commit(
					'pushIntervalArr',
					setInterval(() => {
						this.progressCurr = this.$store.state.player.getCurrentTime();
					}, 250)
				);
				this.progressMax = this.player.getDuration();
				break;
			case 5:
				this.progressMax = this.player.getDuration();
				break;
		}
	}

	@Watch('sheet')
	onSheetChange(value: boolean) {
		if (value) this.CheckPlayer();
	}

	@Watch('videoID')
	onVideoIDChange(value?: string) {
		// console.log(value);
		if (value?.length == 11) {
			if (!this.$store.state.player) {
				this.IframeAPIReady(value);
			} else {
				this.progressCurr = 0;
				this.$store.commit('cuePlayerById', value);
			}
		}
	}

	mounted() {
		if (!this.$store.state.player && this.videoID) {
			this.IframeAPIReady(this.videoID);
		} else {
			this.CheckPlayer();
		}
	}

	beforeDestroy() {
		this.$store.commit('clearIntervalArr');
	}

	// methods
	private IframeAPIReady(id: string) {
		if (!id) return;

		const youtube = window.YT;

		this.$store.commit(
			'creatPlayer',
			new youtube.Player('youtube-audio', {
				height: 20,
				// width: 500,
				videoId: id,
				playerVars: {
					enablejsapi: 1,
					autoplay: 0,
					controls: 0,
					loop: 0,
					// eslint-disable-next-line prettier/prettier
					"cc_lang_policy": 0,
				},
				events: {
					onReady: (e: Event) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(e.target as any).setPlaybackQuality('small');
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(e.target as any).setVolume(this.volume);
						this.$store.state.playState = 5;

						// e.target.setLoop(fals);
						// e.target.mute().playVideo();
						// this.progressMax = e.target.getDuration();
					}
				}
			})
		);
	}

	private CheckPlayer() {
		const player = this.$store.state.player;
		this.playState = player.getPlayerState();
		this.volume = this.volumeBack = player.getVolume();
		this.progressCurr = player.getCurrentTime();
		this.progressMax = player.getDuration();

		switch (this.playState) {
			case 0:
				this.progressCurr = this.progressMax;
				break;
			case 1:
				this.$store.commit(
					'pushIntervalArr',
					setInterval(() => {
						this.progressCurr = this.$store.state.player.getCurrentTime();
					}, 250)
				);
				break;
		}
	}

	// toogle volumn
	private volumeToggle() {
		if (!this.player) return;

		if (this.volume > 0) {
			this.volumeBack = this.volume;
			this.volume = 0;
		} else this.volume = this.volumeBack;

		this.$store.commit('videoSetVolume', this.volume);
	}

	// change volumn
	private volumeChange() {
		if (!this.player) return;

		if (this.volume > 0) this.volumeBack = this.volume;
		this.$store.commit('videoSetVolume', this.volume);
	}

	private videoStart() {
		this.$store.commit('playVideo');
	}

	private videoPause() {
		this.$store.commit('pauseVideo');
	}

	private backward10() {
		this.$store.commit('backward10');
	}

	private forward10() {
		this.$store.commit('forward10');
	}

	private toggleLoop() {
		this.shuffle = false;
		this.loop = !this.loop;
	}

	private toggleShuffle() {
		this.loop = false;
		this.shuffle = !this.shuffle;
	}

	private progressChange(e: number) {
		this.$store.commit('videoProgress', (this.progressMax * e) / 100);
		// this.$root.$player.seekTo((this.progressMax * e) / 100);
	}
}
</script>

<style lang="scss" scoped>
.v-list--disabled {
	// 進度調
	.progress-container {
		opacity: 0.3 !important;
	}

	// 控制按鈕
	button > span > i {
		color: rgba(255, 255, 255, 0.3) !important;
	}
}
</style>
