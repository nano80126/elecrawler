<template>
	<div>
		<v-card class="mr-3" outlined>
			<v-card-title>
				<span class="limited-width" v-text="lyric.obj.title" />
				<v-spacer />
				<v-tooltip left>
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on" @click="listAdd" :disabled="lyric.exist">
							<v-icon>fas fa-plus</v-icon>
						</v-btn>
					</template>
					<span>{{ lyric.exist ? '追加済み' : 'リストに追加' }}</span>
				</v-tooltip>
			</v-card-title>
			<v-card-subtitle>
				<span v-text="lyric.obj.artist" />
			</v-card-subtitle>
			<v-divider />

			<v-card-text
				class="teal--text text--lighten-1 font-weight-bold lyric-body"
				v-html="lyric.obj.lyric || '<span>歌詞が存在しない。</span>'"
			/>

			<!-- <v-card-text>
				{{ lyric }}
			</v-card-text> -->
		</v-card>
	</div>
</template>

<script>
export default {
	props: {
		lyric: {
			type: [Object],
			required: true
		},
		exist: {
			type: Boolean,
			required: true
		}
	},
	mounted() {
		// console.log(this.$parent);
		// this.$dbList.count({}, (err, count) => {
		// 	console.log(err, count);
		// });

		console.log(this.lyric);
	},

	methods: {
		listAdd() {
			if (!this.lyric.exist) {
				this.$parent.listAdd();
				this.$emit('update:exist', true);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.lyric-body {
	font-family: 'メイリオ', 'ＭＳ Ｐゴシック', sans-serif;
	font-weight: 600;
}

.limited-width {
	max-width: calc(100% - 68px);
	overflow-x: hidden;
}
</style>
