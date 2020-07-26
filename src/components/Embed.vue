<template>
	<div>
		<v-card-actions>
			<v-list class="py-0" dense width="100%" color="transparent">
				<v-list-item :disabled="!player">
					<v-list-item-content>
						<div class="d-flex align-center">
							<span>{{ $moment.utc(progressCurr * 1000).format('mm:ss') }}</span>
							<v-progress-linear
								v-model="progress"
								class="my-0 mx-3"
								height="4"
								@change="onProgressChanged"
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
								<v-btn icon @click="onVolumeToggle" v-bind="attrs" v-on="on" :disabled="!player">
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
									@end="onVolumeChange"
									@click="onVolumeChange"
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

<script>
export default {
	props: {
		videoID: {
			type: String,
			required: false
		},

		sheet: {
			type: Boolean,
			return: false
		}
	},

	data() {
		return {
			// progress: 0,

			progressCurr: 0,
			progressMax: 0,
			checkProgress: null,

			volume: 75,
			volumeBack: 75,
			// loop: false,
			// shuffle: false,

			// canPlay: true,
			playState: -1
		};
	},
	computed: {
		canPlay() {
			// end // pause // ready
			return this.playState == 0 || this.playState == 2 || this.playState == 5;
		},

		player() {
			return this.$store.state.player || false;
		},

		loop: {
			get() {
				return this.$store.state.playerLoop;
			},
			set(b) {
				this.$store.commit('videoLoop', b);
			}
		},

		shuffle: {
			get() {
				return this.$store.state.playerShuffle;
			},
			set(b) {
				this.$store.commit('videoShuffle', b);
			}
		},

		progress: {
			get() {
				return (this.progressCurr / this.progressMax) * 100;
			},
			set(e) {
				this.progressCurr = (this.progressMax * e) / 100;
			}
		}
	},

	watch: {
		'$store.getters.playState'(state) {
			this.playState = state;
			clearInterval(this.checkProgress);

			switch (state) {
				case 0:
					this.progressCurr = this.progressMax;
					break;
				case 1:
					this.checkProgress = setInterval(() => (this.progressCurr = this.player.getCurrentTime()), 250);
					this.progressMax = this.player.getDuration();
					break;
				case 5:
					this.progressMax = this.player.getDuration();
					break;
			}
		},
		sheet(e) {
			if (e) this.CheckPlayer();
		},

		videoID(id) {
			console.log(id);
			if (id && id.length == 11) {
				this.progressCurr = 0;
				this.$store.commit('cuePlayerById', id);
				// this.progressMax = this.player.getDuration();
			}
			// } else this.$store.commit('snackbar', { text: '無効な動画 ID', color: 'warning' });
		}
	},

	mounted() {
		if (!this.$store.state.player) {
			this.IframeAPIReady(this.videoID);
		} else {
			this.CheckPlayer();
		}
	},

	beforeDestroy() {
		clearInterval(this.checkProgress);
	},

	methods: {
		// running at player is not existing
		IframeAPIReady(id) {
			if (!id) return;

			const youtube = window['YT'];

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
						// playlist: id,
						// eslint-disable-next-line prettier/prettier
						"cc_lang_policy": 0,
					},
					events: {
						onReady: e => {
							e.target.setPlaybackQuality('small');
							e.target.setVolume(this.volume);
							this.$store.state.playState = 5;
							// e.target.setLoop(false);
							// e.target.mute().playVideo();
							// this.progressMax = e.target.getDuration();
						}
					}
				})
			);
		},

		// checking player in mounted when player already exists
		CheckPlayer() {
			const player = this.$store.state.player;

			this.playState = player.getPlayerState();
			this.volume = this.volumeBack = player.getVolume();
			this.progressCurr = player.getCurrentTime();
			this.progressMax = player.getDuration();
			// this.loop = this.$store.state.playerLoop;

			switch (this.$store.getters.playState.data) {
				case 0:
					this.progressCurr = this.progressMax;
					break;
				case 1:
					this.checkProgress = setInterval(() => {
						this.progressCurr = this.$store.state.player.getCurrentTime();
					}, 250);
					break;
			}
		},

		// toogle volumn
		onVolumeToggle() {
			if (!this.player) return;

			if (this.volume > 0) {
				this.volumeBack = this.volume;
				this.volume = 0;
			} else this.volume = this.volumeBack;

			this.$store.commit('videoSetVolume', this.volume);
		},

		// change volumn
		onVolumeChange() {
			if (!this.player) return;

			if (this.volume > 0) this.volumeBack = this.volume;
			this.$store.commit('videoSetVolume', this.volume);
		},

		videoStart() {
			this.$store.commit('playVideo');
		},

		videoPause() {
			this.$store.commit('pauseVideo');
		},

		backward10() {
			this.$store.commit('backward10');
		},

		forward10() {
			this.$store.commit('forward10');
		},

		toggleLoop() {
			this.shuffle = false;
			this.loop = !this.loop;
		},

		toggleShuffle() {
			this.loop = false;
			this.shuffle = !this.shuffle;
		},

		onProgressChanged(e) {
			this.$store.commit('videoProgress', (this.progressMax * e) / 100);
			// this.$root.$player.seekTo((this.progressMax * e) / 100);
		}
	}
};
</script>

<style lang="scss" scoped></style>
