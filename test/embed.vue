
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
			// checkProgress: null,
			//
			//
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
			return this.$store.state.player;
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
			console.log(state);
			this.playState = state;
			// this.$store.commit('clearProgress');
			// console.log(this.$store.state.intervalArray);
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
					// this.$store.commit(
					// 	'playerProgress',
					// eslint-disable-next-line no-case-declarations
					this.$store.commit(
						'psuhIntervalArr',
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
		},

		// watch change from app.vue
		sheet(e) {
			if (e) this.CheckPlayer();
		},

		videoID(id) {
			if (id && id.length == 11) {
				// id is valid
				if (!this.$store.state.player) {
					this.IframeAPIReady(this.videoID);
				} else {
					this.progressCurr = 0;
					this.$store.commit('cuePlayerById', id);
				}
			}
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
		// clearInterval(this.checkProgress);
		this.$store.commit('clearIntervalArr');
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

			switch (this.playState) {
				case 0:
					this.progressCurr = this.progressMax;
					break;
				case 1:
					this.$store.commit(
						'psuhIntervalArr',
						setInterval(() => {
							this.progressCurr = this.$store.state.player.getCurrentTime();
						}, 250)
					);
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