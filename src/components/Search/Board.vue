<template>
	<div class="mr-3">
		<v-card outlined>
			<v-card-title>
				<span class="limited-width" v-text="lyricsObj.obj.title" />
				<v-spacer />
				<v-tooltip left>
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on" :disabled="lyricsObj.exist" @click="listAdd">
							<v-icon>fas fa-plus</v-icon>
						</v-btn>
					</template>
					<span>{{ lyricsObj.exist ? $t('inList') : $t('addList') }}</span>
				</v-tooltip>
			</v-card-title>
			<v-card-subtitle>
				<span class="limited-width-artist" v-text="lyricsObj.obj.artist" />
			</v-card-subtitle>
			<v-divider />

			<v-card-text
				class="grey--text text--lighten-1 font-weight-bold lyric-body"
				v-html="lyricsObj.obj.lyrics || `<span>${$t('noLyricsExist')}</span>`"
			/>
		</v-card>
	</div>
</template>

<script lang="ts">
import { AppModule, Colors } from '@/store/modules/app';
import { Component, Vue, Prop } from 'vue-property-decorator';

import { IlyricsSearched } from '@/types/renderer';
import { EmongoOn } from '@/types/enum';

@Component
export default class Board extends Vue {
	/**歌詞物件 */
	@Prop({ required: true, type: Object }) lyricsObj!: IlyricsSearched;
	/**是否已存在清單 */
	@Prop({ required: true, type: Boolean }) exist!: boolean;

	mounted(): void {
		if (process.env.NODE_ENV == 'development') {
			console.info(`%c${this.lyricsObj.obj.title} / ${this.lyricsObj.obj.artist}`, 'color: #03A9F4;');
		}
	}

	/**加入清單 */
	private listAdd() {
		if (!this.exist) {
			// this.$parent.listAdd();
			const ret = this.$ipcRenderer.invoke(EmongoOn.LISTSAVE, {
				query: { lyricsKey: this.lyricsObj.obj.lyricsKey },
				data: {
					$set: {
						artist: this.lyricsObj.obj.artist,
						title: this.lyricsObj.obj.title,
						lyricsUrl: this.lyricsObj.obj.lyricsUrl,
						datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
					},
				},
			});
			ret.then((res) => {
				if (res.ok) {
					const { lyricsUrl } = this.lyricsObj.obj;
					AppModule.addUrlList(lyricsUrl);
					this.$emit('update:exist', true);
				}
			}).catch((err) => {
				AppModule.snackbar({ text: err, color: Colors.Error });
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

.limited-width-artist {
	max-width: calc(100% - 24px);
	overflow-x: hidden;
}
</style>
