<script>
// import player from '@/components/Embed.vue';
// import card from '@/components/LyricCard.vue';
import debounce from 'lodash/debounce';

export default {
	props: {
		lyric: {
			type: Object,
			required: false
		}

		// backImg: {
		// 	type: String,
		// 	required: false
		// }
	},

	components: {
		// embedPlayer: player
	},

	data() {
		return {
			image: null,
			//
			mainColor: 'primary',
			subColor: 'grey',
			textAlign: 'left',
			//
			colors: Object.freeze([
				'primary',
				'cyan',
				'success',
				'teal',
				'error',
				'warning',
				'yellow',
				'purple',
				'white',
				'grey',
				'black'
			]),
			//
			fullImg: true,
			bkOpacity: 0.36
		};
	},

	computed: {
		backSize() {
			if (this.lyric) return this.lyric.imageSize;
			else return null;
		},

		backOpacity: {
			get() {
				return this.bkOpacity;
			},
			set: debounce(function(val) {
				this.bkOpacity = val;
			}, 100)
		}
	},

	watch: {
		'lyric.image'(img) {
			this.image = null;
			if (img) this.backimgLoad();
		}
	},

	mounted() {
		if (this.lyric && this.lyric.image) {
			this.backimgLoad();
		}

		const text = this.$store.state.lyricText;
		if (text) {
			this.mainColor = text.main;
			this.subColor = text.sub;
			this.textAlign = text.align;
		}
	},

	beforeDestroy() {
		// save lyric object before before
		if (this.lyric) this.$store.commit('saveLyric', this.lyric);
		this.$store.commit('saveText', { main: this.mainColor, sub: this.subColor, align: this.textAlign });
	},

	methods: {
		backimgLoad() {
			this.$sharp(this.lyric.image)
				.toBuffer()
				.then(data => {
					this.image = data;
				})
				.catch(err => {
					this.$store.commit('snackbar', { text: err, color: 'error' });
				});
		}

		// imgLoaded() {}
	}
};
</script>