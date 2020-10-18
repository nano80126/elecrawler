<template>
	<div class="mr-3">
		<v-card outlined>
			<v-card-title>
				<span class="limited-width" v-text="lyric.obj.title" />
				<v-spacer />
				<v-tooltip left>
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on" :disabled="lyric.exist" @click="listAdd">
							<v-icon>fas fa-plus</v-icon>
						</v-btn>
					</template>
					<span>{{ lyric.exist ? $t('inList') : $t('addList') }}</span>
				</v-tooltip>
			</v-card-title>
			<v-card-subtitle>
				<span v-text="lyric.obj.artist" />
			</v-card-subtitle>
			<v-divider />

			<v-card-text
				class="teal--text text--lighten-1 font-weight-bold lyric-body"
				v-html="lyric.obj.lyric || `<span>${$t('noLyricsExist')}</span>`"
			/>
		</v-card>
	</div>
</template>

<script lang="ts">
import { AppModule } from '@/store/modules/app';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Board extends Vue {
	/**歌詞物件 */
	@Prop({ required: true, type: Object }) lyric!: {
		obj: {
			key: string;
			artist: string;
			title: string;
			url: string;
		};
		exist: boolean;
	};
	/**是否已存在清單 */
	@Prop({ required: true, type: Boolean }) exist!: boolean;

	mounted() {
		console.info(`%c${this.lyric.obj.title} / ${this.lyric.obj.artist}`, 'color: #03A9F4;');
	}

	/**加入清單 */
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
			}).catch(err => {
				AppModule.snackbar({ text: err, color: 'error' });
			});
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
