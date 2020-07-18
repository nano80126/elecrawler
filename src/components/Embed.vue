<template>
	<div>
		<v-card-actions>
			<v-list class="py-0" dense width="100%">
				<v-list-item>
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
							close-delay="1500"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon @click="onVolumeToggle" v-bind="attrs" v-on="on">
									<v-icon small v-if="volume > 40">fas fa-volume-up</v-icon>
									<v-icon small v-else-if="volume > 0">fas fa-volume-down</v-icon>
									<v-icon small v-else>fas fa-volume-mute</v-icon>
								</v-btn>
							</template>
							<v-card width="120px" class="px-1 no-drag" style="overflow: hidden;" dark>
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

					<!-- <v-list-item-icon class="align-center">
					<v-btn icon @click="backward10">
						<v-icon small>fas fa-backward</v-icon>
					</v-btn>
				</v-list-item-icon> -->

					<v-list-item-icon class="align-center">
						<v-btn icon @click="backward10">
							<v-icon small>fas fa-backward</v-icon>
						</v-btn>
						<!-- <v-btn icon v-if="playState == -1 " @click="videoStart" :disabled="!canPlay">
						<v-icon small>fas fa-play</v-icon>
					</v-btn> -->
						<v-btn icon v-if="playState == 2 || playState == 5" @click="videoStart" :disabled="!canPlay">
							<v-icon small>fas fa-play</v-icon>
						</v-btn>
						<v-btn icon v-else-if="playState == 0" @click="videoStart" :disabled="!canPlay">
							<v-icon small>fas fa-undo</v-icon>
						</v-btn>
						<v-btn icon v-else @click="videoPause" :disabled="playState == -1">
							<v-icon small>fas fa-pause</v-icon>
						</v-btn>

						<v-btn icon @click="forward10">
							<v-icon small>fas fa-forward</v-icon>
						</v-btn>

						<v-menu top left offset-y>
							<template v-slot:activator="{ attrs, on }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon small> fas fa-ellipsis-h</v-icon>
								</v-btn>
							</template>
							<v-list width="250px" class="py-0" flat dark>
								<v-list-item @click="toggleLoop">
									<v-list-item-title class="d-flex">
										<span>ループ再生</span>
										<v-icon v-if="loop" class="ml-auto" small>fas fa-check</v-icon>
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
				<!-- 
			<v-list-item>
				<v-btn @click="$store.commit('destroyPlayer')">destroy</v-btn>
			</v-list-item> -->
			</v-list>
			<!-- </v-bottom-sheet> -->
		</v-card-actions>
	</div>
</template>

<script>
export default {
	props: {
		videoID: {
			type: String,
			required: false
		}
	},

	data() {
		return {
			sheet: true,
			// progress: 0,

			progressCurr: 0,
			progressMax: 0,
			checkProgress: null,

			volume: 75,
			volumeBack: 75,
			loop: false,

			// canPlay: true,
			playState: -1
		};
	},
	computed: {
		canPlay() {
			return this.playState == 0 || this.playState == 2 || this.playState == 5;
		},

		progress: {
			get: function() {
				return (this.progressCurr / this.progressMax) * 100;
			},
			set: function(e) {
				this.progressCurr = (this.progressMax * e) / 100;
			}
		}
	},

	watch: {
		'$store.getters.playState'(e) {
			this.playState = e.data;
			clearInterval(this.checkProgress);

			switch (this.playState) {
				case 0:
					this.progressCurr = this.progressMax;
					if (this.loop) setTimeout(() => this.$store.commit('playVideo'), 2000);
					break;
				case 1:
					this.checkProgress = setInterval(() => {
						this.progressCurr = e.target.getCurrentTime();
					}, 250);
					break;
			}

			// if (this.playState == 1) {
			// 	// this.progressCurr = e.target.getCurrentTime();
			// 	this.checkProgress = setInterval(() => {
			// 		this.progressCurr = e.target.getCurrentTime();
			// 	}, 500);
			// }
		}
	},

	mounted() {
		if (!this.$store.state.player) {
			this.IframeAPIReady(this.videoID);
			// this.$store.commit('playVideo');
		} else {
			const player = this.$store.state.player;

			this.playState = player.getPlayerState();
			this.volume = this.volumeBack = player.getVolume();
			this.progressCurr = player.getCurrentTime();
			this.progressMax = player.getDuration();
			this.loop = this.$store.state.playerLoop;

			switch (this.$store.getters.playState.data) {
				case 0:
					this.progressCurr = this.progressMax;
					if (this.loop) setTimeout(() => this.$store.commit('playVideo'), 1500);
					break;
				case 1:
					this.checkProgress = setInterval(() => {
						this.progressCurr = this.$store.state.player.getCurrentTime();
					}, 250);
					break;
			}

			// if (this.$store.getters.playState.data == 1) {
			// 	this.checkProgress = setInterval(() => {
			// 		this.progressCurr = this.$store.state.player.getCurrentTime();
			// 	}, 500);
			// }
		}
	},

	beforeDestroy() {
		clearInterval(this.checkProgress);
	},

	methods: {
		IframeAPIReady(id) {
			if (!id) return;

			const youtube = window['YT'];

			this.$store.commit(
				'creatPlayer',
				new youtube.Player('youtube-audio', {
					height: 20,
					// width: 500,
					videoId: id || 'DS2sP8CDLas',
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
							e.target.setVolume(75);
							// e.target.setLoop(false);
							// e.target.mute().playVideo();
							this.playState = 5;
							this.progressMax = e.target.getDuration();
						}
					}
				})
			);
		},

		onVolumeToggle() {
			if (this.volume > 0) {
				this.volumeBack = this.volume;
				this.volume = 0;
			} else {
				this.volume = this.volumeBack;
			}
			// this.$root.$player.setVolume(this.volume);
			this.$store.commit('videoSetVolume', this.volume);
		},

		onVolumeChange() {
			if (this.volume > 0) this.volumeBack = this.volume;
			// this.$root.$player.setVolume(e);
			this.$store.commit('videoSetVolume', this.volume);
		},

		videoStart() {
			// this.$root.$player.playVideo();
			this.$store.commit('playVideo');
		},

		videoPause() {
			// this.$root.$player.pauseVideo();
			this.$store.commit('pauseVideo');
		},

		backward10() {
			this.$store.commit('backward10');
		},

		forward10() {
			this.$store.commit('forward10');
		},

		toggleLoop() {
			this.$store.commit('videoLoop', !this.loop);
			this.loop = !this.loop;
		},

		onProgressChanged(e) {
			this.$store.commit('videoProgress', (this.progressMax * e) / 100);
			// this.$root.$player.seekTo((this.progressMax * e) / 100);
		}
	}
};
</script>

<style lang="scss" scoped></style>
