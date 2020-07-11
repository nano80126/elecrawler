<template>
	<div>
		<v-card v-if="lyric" flat shaped width="100%">
			<v-card-title>
				<span class="ellipsis" v-text="lyric.title" style="max-width: 500px" />
			</v-card-title>
			<v-card-subtitle style="position: relative;">
				<span v-text="lyric.artist" />

				<!-- <div style="position: absolute; bottom:0; right:0;">
					<v-btn color="success">colors</v-btn>
				</div> -->
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

				<!-- <v-parallax
					class="full-card"
					height="100%"
					src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
				/> -->
			</v-card-text>

			<v-divider />
			<v-card-actions>
				<!-- <v-btn>123</v-btn>
				文字顏色、背景透明度 -->

				<v-menu top offset-y nudge-top="16px" transition="scale-transition" origin="bottom left">
					<template v-slot:activator="{ on, attrs }">
						<v-btn text outlined class="rounded-xl mr-3" v-bind="attrs" v-on="on">
							<v-icon :color="mainColor">fas fa-square</v-icon>
						</v-btn>
					</template>

					<v-btn-toggle v-model="mainColor" color="primary" dense group class="white">
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

					<v-btn-toggle v-model="subColor" color="primary" dense group class="white">
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
					step="0.032"
					type="range"
					class="slider"
					style="width:12%; min-width: 120px"
				/>
			</v-card-actions>

			<v-divider />

			<v-card-actions>
				<embedPlayer :videoID="this.lyric.ytID" style="width:100%;" />
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import player from '@/components/Embed.vue';
// import card from '@/components/LyricCard.vue';

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
		embedPlayer: player
	},

	data() {
		return {
			image: null,
			//
			mainColor: 'primary',
			subColor: 'grey',
			textAlign: 'left',
			//
			colors: ['primary', 'info', 'success', 'teal', 'warning', 'orange', 'error', 'purple', 'grey'],
			//
			fullImg: true,
			backOpacity: 0.52
		};
	},

	computed: {
		backSize() {
			if (this.lyric) return this.lyric.imageSize;
			else return null;
		}
	},

	watch: {
		'lyric.image'(img) {
			this.image = null;
			if (img) {
				this.backimgLoad();
			}
		}
	},

	mounted() {
		if (this.lyric && this.lyric.image) {
			this.backimgLoad();
		}
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

// input[type='range'] {
// 	-webkit-appearance: none;
// 	// // width: 200px;
// 	// padding: 10px;
// 	width: 200px;
// 	height: 40px;
// 	outline: none; /* 避免點選會有藍線或虛線 */
// 	background: none;
// 	overflow: hidden; /* 限定範圍 */
// 	cursor: pointer;

// }

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
			white 0,
			white 7px,
			grey 7px,
			grey calc(100% - 7px),
			white calc(100% - 7px),
			white 100%
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

// input[type='range']::-webkit-slider-runnable-track {
// 	width: 100%;
// 	height: 8.4px;
// 	cursor: pointer;
// 	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
// 	background: #3071a9;
// 	border-radius: 1.3px;
// 	border: 0.2px solid #010101;
// }

// input[type='range']::-webkit-slider-thumb {
// 	-webkit-appearance: none;
// 	border: 1px solid #000000;
// 	height: 36px;
// 	width: 16px;
// 	border-radius: 3px;
// 	background: #ffffff;
// 	cursor: pointer;
// 	margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
// 	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
// }
</style>
