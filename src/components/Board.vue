<template>
	<div>
		<v-card class="mr-3" outlined>
			<v-card-title>
				<span class="limited-width" v-text="lyric.obj.title" />
				<v-spacer />
				<v-tooltip left>
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on" :disabled="lyric.exist" @click="listAdd">
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
		</v-card>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Board extends Vue {
	@Prop({ required: true, type: Object }) lyric!: {
		obj: {
			key: string;
			artist: string;
			title: string;
			url: string;
		};
		exist: boolean;
	};
	@Prop({ required: true, type: Boolean }) exist!: boolean;

	mounted() {
		console.warn(this.lyric);
	}

	private listAdd() {
		if (!this.exist) {
			// this.$parent.listAdd();
			const ret = this.$ipcRenderer.invoke('listSave', {
				query: { uniqueKey: this.lyric.obj.key },
				data: {
					$set: {
						artist: this.lyric.obj.artist,
						title: this.lyric.obj.title,
						lyricUrl: this.lyric.obj.url,
						datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}
				}
			});
			ret.then(res => {
				if (res.ok) {
					this.$emit('update:exist', true);
				}
				console.log(res);
			}).catch(err => {
				this.$store.commit('snackbar', { text: err, color: 'error' });
				console.log(err);
			});

			/*
			this.$dbList.ensureIndex({ fieldName: 'uniqueKey', unique: true }, err => {
				if (err) console.warn(err);
			});

			this.$dbList.update(
				{ uniqueKey: this.lyric.obj.key },
				{
					$set: {
						// uniqueKey: this.lyricObj.key,
						artist: this.lyric.obj.artist,
						title: this.lyric.obj.title,
						lyricUrl: this.lyric.obj.url,
						datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}
				},
				{ upsert: true },
				err => {
					if (err) console.warn(err);
					// console.log(nb);
				}
			);
			*/
		}
	}
}
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
