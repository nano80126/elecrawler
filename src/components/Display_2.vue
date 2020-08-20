<template>
	<div>
		<!-- <v-card v-if="lyric" flat shaped width="100%"> -->
		<v-card-title>
			<span class="ellipsis" v-text="lyric.title" style="max-width: 500px" />
		</v-card-title>
		<v-card-subtitle style="position: relative;">
			<span v-text="lyric.artist" />
		</v-card-subtitle>

		<v-divider />

		<!-- height = 32+48+38+2+52+12    -->
		<v-card-text
			class="text-darken-2 font-weight-bold lyric-body py-0"
			style="position:relative;"
			:style="{ height: `${$root.webHeight - 241}px` }"
		>
			<!-- :style="{ height: `${$root.webHeight - 184}px` }" -->

			<!-- <v-img class="back-card my-4 red" contain :src="image" /> -->
			<transition name="fadeIn" mode="out-in">
				<v-img
					v-if="image"
					class="back-card my-4"
					contain
					:width="fullImg ? '100%' : null"
					position="top center"
					:src="`data:image/jpeg;base64,${image.toString('base64')}`"
					:style="{ opacity: backOpacity }"
				/>
				<!-- :width="backSize ? backSize.width : null"
						:height="backSize ? backSize.height : null" -->
			</transition>

			<div
				class="mr-n4 py-4 pr-4 min-scroll y info-scroll lyric-content"
				:class="`${mainColor}--text ${subColor}--subtext text-${textAlign}`"
				style="position:relative; overflow-y: auto; height: 100%;"
			>
				<span class="text-center" v-html="lyric.lyric || '<span>歌詞が存在しない。</span>'"></span>
				<span class="grey--text text-lighten-2 px-4 mt-10" style="float: right;">
					-- 終わり
				</span>
			</div>
		</v-card-text>

		<v-divider />
		<v-card-actions>
			<v-menu top offset-y nudge-top="16px" transition="scale-transition" origin="bottom left">
				<template v-slot:activator="{ on, attrs }">
					<v-btn text outlined class="rounded-xl mr-3" v-bind="attrs" v-on="on">
						<v-icon :color="mainColor">fas fa-square</v-icon>
					</v-btn>
				</template>

				<v-btn-toggle v-model="mainColor" color="grey lighten-3" dense group class="grey darken-2" mandatory>
					<v-btn v-for="(c, k) in colors" :key="`m${k}`" :value="c" text>
						<v-icon :color="c">fas fa-square</v-icon>
					</v-btn>
				</v-btn-toggle>
			</v-menu>

			<v-menu top offset-y nudge-top="16px" transition="scale-transition" origin="bottom left">
				<template v-slot:activator="{ on, attrs }">
					<v-btn text outlined class="rounded-xl mr-3" v-bind="attrs" v-on="on">
						<v-icon :color="subColor">fas fa-square</v-icon>
					</v-btn>
				</template>

				<v-btn-toggle v-model="subColor" color="grey lighten-3" dense group class="grey darken-2" mandatory>
					<v-btn v-for="(c, k) in colors" :key="`m${k}`" :value="c" text>
						<v-icon :color="c">fas fa-square</v-icon>
					</v-btn>
				</v-btn-toggle>
			</v-menu>

			<v-btn-toggle v-model="textAlign" mandatory dense class="mr-3">
				<v-btn value="lelt" min-width="0" width="48">
					<v-icon size="18">fas fa-align-left</v-icon>
				</v-btn>

				<v-btn value="center" min-width="0" width="48">
					<v-icon size="18">fas fa-align-center</v-icon>
				</v-btn>

				<v-btn value="right" min-width="0" width="48">
					<v-icon size="18">fas fa-align-right</v-icon>
				</v-btn>
			</v-btn-toggle>

			<v-btn icon outlined @click="fullImg = !fullImg">
				<v-icon size="18" :color="fullImg ? 'info' : 'grey darken-1'">fas fa-expand-arrows-alt</v-icon>
				<!-- <v-icon style="position:absolute; top:0; left: 0;">fas fa-search</v-icon> -->
			</v-btn>

			<v-spacer />

			<input
				v-model="backOpacity"
				max="1"
				min="0.2"
				step="0.02"
				type="range"
				class="slider"
				style="width:12%; min-width: 120px"
			/>
		</v-card-actions>

		<!-- <v-card-actions>
				<embedPlayer :videoID="this.lyric.ytID" style="width:100%;" />
			</v-card-actions> -->
		<!-- </v-card> -->
	</div>
</template>

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
		},

		imgLoaded() {}
	}
};
</script>

<style lang="scss" scoped>
.lyric-body {
	font-family: 'メイリオ', 'ＭＳ Ｐゴシック', sans-serif;
	font-weight: 600;
}

.back-card {
	position: absolute;
	top: 0;
	bottom: 0;
	max-width: calc(100% - 32px);

	left: 50%;
	transform: translate(-50%);
	// margin: 0 auto;
	// width: calc(100% - 32px);
	// margin: auto;
}

.fadeIn-enter-active,
.fadeIn-leave-active {
	transition: all 0.5s;
}

.fadeIn-enter {
	opacity: 0.3;
	transform: translateX(-125%);
}

.fadeIn-leave-to {
	opacity: 0.12;
	transform: translateX(125%);
}

input[type='range'] {
	-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
	position: relative;
	height: 2px;
	background: transparent;
	// background-color: red; /* Otherwise white in Chrome */

	&:focus {
		outline: none;
	}

	&::-webkit-slider-runnable-track {
		height: 2px;
		background: linear-gradient(
			to right,
			transparent 0,
			transparent 7px,
			grey 7px,
			grey calc(100% - 7px),
			transparent calc(100% - 7px),
			transparent 100%
		);
		opacity: 0.75;
		cursor: pointer;
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		position: relative;
		height: 14px;
		width: 14px;
		border-radius: 50%;
		margin: -6px 0;
		border: 2px outset darkgreen;
		background: #ffffff;
		cursor: pointer;
	}
}
</style>
