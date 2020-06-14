<template>
	<div>
		<v-card class="mr-3" outlined>
			<v-card-title>
				<span class="ellipsis" v-text="lyric.title" style="max-width: 500px" />
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
				<span v-text="lyric.artist" />
			</v-card-subtitle>
			<v-divider />

			<v-card-text
				class="primary--text text--darken-2 font-weight-bold lyric-body"
				v-html="lyric.lyric || '<span>歌詞が存在しない。</span>'"
			/>
		</v-card>
	</div>
</template>

<script>
export default {
	props: {
		lyric: {
			type: [Object],
			required: true
		}
	},
	mounted() {
		// console.log(this.$parent);
		// this.$dbList.count({}, (err, count) => {
		// 	console.log(err, count);
		// });
	},

	methods: {
		listAdd() {
			if (!this.lyric.exist) {
				this.$parent.listAdd();
				this.lyric.exist = true;
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
</style>
