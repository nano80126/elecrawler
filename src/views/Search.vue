<template>
	<div>
		<v-row no-gutters align="stretch" justify="center">
			<!-- style="min-height: 1080px; min-width:392px;" -->
			<v-col
				cols
				class="pl-3"
				:style="{
					'min-height': `${$root.webHeight - 44}px`,
					'max-width': isTwoColumn || isThreeColumn ? '416px' : null
				}"
			>
				<!-- 416px = 480 - 64(navigation) -->
				<!-- {{ $refs.firstCol ? $ref.firstCol.clientWidth : '123' }} -->
				<v-row no-gutters align="center" justify="center">
					<v-col>
						<v-text-field
							v-model="title"
							filled
							rounded
							dense
							:placeholder="$t('song')"
							hide-details
							class="mx-1"
							color="info"
							@keyup.enter="lyricSearch"
						>
							<template v-slot:prepend-inner>
								<v-icon left small class="mt-1 mr-1">fas fa-music</v-icon>
							</template>
						</v-text-field>
					</v-col>

					<v-col>
						<v-text-field
							v-model="artist"
							filled
							rounded
							dense
							hide-details
							:placeholder="$t('singer')"
							class="mx-1"
							color="info"
							@keyup.enter="lyricSearch"
						>
							<template v-slot:prepend-inner>
								<v-icon left small class="mt-1 mr-1">fas fa-microphone-alt</v-icon>
							</template>
						</v-text-field>
					</v-col>

					<v-col cols="auto">
						<v-btn icon color="success" height="40" @click="lyricSearch" :disabled="!canSearch">
							<!-- <span class="mr-2">検索</span> -->
							<v-icon small>fas fa-search</v-icon>
						</v-btn>

						<v-btn text outlined height="40" min-width="0" width="15" class="px-0" @click="expandWidth">
							<v-icon x-small class="mx-0">
								{{ $root.webWidth >= 1440 ? 'fas fa-caret-left' : 'fas fa-caret-right' }}
							</v-icon>
						</v-btn>
					</v-col>

					<template v-if="keywords.length > 0">
						<v-col cols="12" class="mt-3" />
						<!-- reserved for change line -->
						<v-col cols="auto">
							<v-chip label small color="orange lighten-1">
								<v-icon x-small color="white">fas fa-star</v-icon>
								<span class="ml-1 white--text">{{ $t('keyWord') }}</span>
							</v-chip>
						</v-col>
						<v-col cols class="px-3 ellipsis" style="width:100%;">
							<!-- <div style="overflow-x:auto; white-space:nowrap;"> -->
							<v-chip
								v-for="(words, key) in keywords"
								:key="`keywords${key}`"
								small
								class="ml-2 mt-1"
								color="light-blue lighten-1"
								style="cursor: pointer;"
								@click="historySearch(words.artist, words.title)"
							>
								{{ words.title || words.artist }}
							</v-chip>
						</v-col>
					</template>

					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<transition name="lyricSlide">
						<v-col v-if="lyricObj && !isTwoColumn" cols="12" class="mt-3">
							<!-- :style="{height: `${($root.webHeight - 136) / 2 - 12}px`" -->
							<div
								class="min-scroll y success-scroll"
								:style="{ height: `${($root.webHeight - 136) / 2.5 - 12}px` }"
							>
								<lyricCard :lyric="lyricObj" :exist.sync="lyricObj.exist" />
							</div>
						</v-col>
					</transition>

					<v-col cols="12" class="mt-3">
						<v-virtual-scroll
							class="min-scroll y success-scroll scroll-darken"
							bench="1"
							:items="searchList"
							item-height="150"
							:height="($root.webHeight - 136) / (lyricObj && !isTwoColumn ? 1.667 : 1)"
						>
							<!-- <div
							class="min-scroll y success-scroll mt-3 pr-3"
							:style="{ height: `${$root.webHeight - 136}px` }"
							> -->
							<!-- <v-row no-gutters> -->

							<!-- <v-col cols="12"> -->
							<!-- <transition-group name="cardList"> -->
							<!-- <v-responsive class="overflow-y-auto" max-height="400">
										<v-responsive height="1080"> -->
							<!-- <v-lazy> -->
							<template v-slot="{ item }">
								<v-card :key="item.id" class="mx-auto mr-3" outlined min-height="130">
									<v-card-title style="position:relative;">
										<span class="dummy" />
										<span class="ellipsis" style="position: absolute;">
											{{ item.title }}
										</span>

										<v-btn
											icon
											v-if="item.exist"
											class="ml-auto mr-n2 no-active"
											@click.prevent
											:ripple="false"
										>
											<v-icon small color="grey">fas fa-list</v-icon>
											<v-icon
												size="16"
												color="success darken-1"
												class="mt-n2 mr-n1"
												style="position:absolute; right:0;"
											>
												fas fa-check
											</v-icon>
										</v-btn>
									</v-card-title>
									<v-card-subtitle>{{ item.artist }}</v-card-subtitle>

									<v-divider />
									<v-card-actions>
										<v-btn text color="info" @click="getLyric(item.lyricUrl, item.exist)">
											<v-icon>fas fa-link</v-icon>
											<span class="ml-2 font-weight-bold">リンク</span>
										</v-btn>

										<v-spacer />

										<v-tooltip left max-width="348" transition="slide-y-transition">
											<template v-slot:activator="{ on, attrs }">
												<v-btn icon v-bind="attrs" v-on="on">
													<v-icon style="transform: rotateY(180deg)">
														far fa-comment-dots
													</v-icon>
												</v-btn>
											</template>
											<span>
												{{ item.lyric }}
											</span>
										</v-tooltip>
									</v-card-actions>
									<!-- <v-expand-transition>
										<div v-show="item.expanded">
											<v-divider />
											<v-card-text>{{ item.lyric }}</v-card-text>
										</div>
									</v-expand-transition> -->
								</v-card>
							</template>
							<!-- </v-lazy> -->
							<!-- </v-responsive> -->
							<!-- </v-responsive> -->
							<!-- </transition-group> -->
							<!-- </v-col> -->
							<!-- </v-row> -->
							<!-- </div> -->
						</v-virtual-scroll>
						<!-- scroll end --><!-- scroll end --><!-- scroll end --><!-- scroll end --><!-- scroll end -->
					</v-col>
					<!--  -->
				</v-row>
			</v-col>
			<!-- 1st column end --><!-- 1st column end --><!-- 1st column end --><!-- 1st column end -->

			<!-- <template v-if="isTwoColumn"> -->
			<!-- <v-divider vertical /> -->

			<transition name="lyricsFadeIn">
				<v-col
					v-if="isTwoColumn"
					cols
					class="pl-3"
					:style="{ 'max-width': isThreeColumn ? '480px' : null }"
					style="border-left:1px solid rgba(150, 150, 150, 0.5);"
				>
					<!-- {{ this.lyricObj ? this.lyricObj.exist : null }} -->
					<template v-if="lyricObj">
						<div class="min-scroll y primary-scroll" :style="{ height: `${$root.webHeight - 44}px` }">
							<lyricCard :lyric="lyricObj" :exist.sync="lyricObj.exist" />
						</div>
					</template>
					<template v-else>
						<div class="d-flex align-center" style="height:100%;">
							<v-card flat shaped class="mr-3" width="100%">
								<v-card-subtitle class="text-center">
									{{ $t('doSearchLyrics') }}
									<!-- 歌詞を探しましょう -->
								</v-card-subtitle>
							</v-card>
						</div>
					</template>
					<!-- </transition> -->
				</v-col>
			</transition>

			<!-- </template> -->

			<!-- <keep-alive> -->
			<!-- <template v-if="isThreeColumn"> -->
			<transition name="lyricsFadeIn">
				<v-col
					v-if="isThreeColumn"
					cols
					class="pl-3"
					:style="{ 'max-width': bigImage ? `${$root.webWidth - 480}px` : `${$root.webWidth - 960}px` }"
					style="border-left:1px solid rgba(150, 150, 150, 0.5);"
				>
					<!-- border-right:1px solid rgba(150, 150, 150, 0.5); -->
					<template v-if="lyricObj && lyricObj.exist">
						<!-- <div class="min-scroll y info-scroll" :style="{ height: `${$root.webHeight - 44}px` }"> -->
						<lyricMedia :bigImage.sync="bigImage" :lyric="lyricObj" />
						<!-- </div> -->
					</template>
					<template v-else>
						<div class="d-flex align-center" style="height:100%">
							<v-card flat shaped width="100%">
								<v-card-subtitle class="text-center">
									{{ $t('addListToAccess') }}
									<!-- リストに追加しないと操作できず -->
								</v-card-subtitle>
							</v-card>
						</div>
					</template>
				</v-col>
			</transition>
			<!-- </template> -->
			<!-- </keep-alive> -->
		</v-row>
	</div>
</template>

<script lang="ts">
import board from '@/components/Board.vue';
import media from '@/components/Media.vue';
import { AppModule, Colors } from '@/store/modules/app';

import { Component, Vue } from 'vue-property-decorator';

@Component({
	components: {
		lyricCard: board,
		lyricMedia: media
	}
})
export default class Search extends Vue {
	/**歌詞物件 */
	private lyricObj: { obj: {}; exist: boolean } | null = null;

	/**搜尋清單 */
	private searchList: Array<{}> = [];
	/**已加入清單，搜尋比對用，已存在的項目將會被標記 */
	private List: Array<{
		uniqueKey: string;
		title: string;
		artist: string;
		lyricUrl: string;
		datetime: string;
	}> = [];

	/**搜尋歌手 */
	private artist = '';
	/**搜尋歌曲名 */
	private title = '';
	/**是否展開大圖 */
	private bigImage = false;
	/**關鍵字紀錄 */
	private keywords: Array<{ artist: string; title: string; datetime: string }> = [];

	/**是否可以搜尋 */
	get canSearch(): boolean {
		return this.title?.length > 0 || this.artist?.length > 0;
	}
	/**視窗寬度 */
	get windowWidth(): number {
		return this.$root.$data.webWidth;
	}
	/**視窗高度 */
	get windowHeight(): number {
		return this.$root.$data.webHeight;
	}

	get isTwoColumn(): boolean {
		return this.$root.$data.webWidth >= 960 && !this.bigImage;
	}

	get isThreeColumn(): boolean {
		return this.$root.$data.webWidth >= 1440 && this.lyricObj != null;
	}

	created() {
		this.$ipcRenderer
			.invoke('historyFind', { query: {} })
			.then(res => {
				this.keywords = res;
			})
			.catch(err => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});
	}

	mounted() {
		// load list saved
		this.$ipcRenderer
			.invoke('listFind', { query: {}, sort: { datetime: 1 } })
			.then(res => {
				this.List = res;

				// 待刪
				const toStr = this.List.map(item => `${item.title} / ${item.artist}`);
				console.info(`%c${toStr.join(', ')}`, `color: ${this.$vuetify.theme.themes.dark.success};`);
			})
			.catch(err => {
				this.$store.commit('snackbar', { text: err, color: Colors.Error });
			});

		// const included = this.$ipcRenderer.eventNames().includes('searchRes');
		if (!this.$ipcRenderer.eventNames().includes('searchRes')) {
			this.$ipcRenderer.on('searchRes', (e, args: { error: string; list: [] }) => {
				if (args.error) {
					this.$store.commit('snackbar', { text: args.error, color: Colors.Error });
				}

				// 取得交集
				// const intersection = this.$lodash.intersectionBy(args.list, this.List, 'lyricUrl');

				///////////////////
				// 確認是否存在列表中
				this.$nextTick(() => {
					args.list.forEach(
						(obj: {
							title: string;
							lyricUrl: string;
							artist: string;
							lyric: string;
							id: number;
							exist: boolean;
						}) => {
							// if (this.$lodash.findIndex(intersection, ['lyric']))
							const index = this.List.findIndex(item => item.lyricUrl == obj.lyricUrl);
							Object.assign(obj, { exist: index > -1 });

							setTimeout(() => {
								this.searchList.push(Object.freeze(obj));
							}, obj.id * 50);
						}
					);
				});
				this.$store.commit('changeOverlay', false);
			});
		}
	}

	beforeDestroy() {
		this.$ipcRenderer.removeAllListeners('searchRes');
		this.$ipcRenderer.removeAllListeners('lyricRes');
	}
	/**搜尋 */
	private lyricSearch() {
		if (!this.canSearch) return;
		this.$store.commit('changeOverlay', true);

		this.bigImage = false;
		this.lyricObj = null;
		this.searchList = [];
		this.$ipcRenderer.send('searchReq', {
			artist: this.artist,
			title: this.title
		});
		///
		this.keywordSave(this.artist, this.title);
	}
	/**歷史紀錄搜尋 */
	private historySearch(artist: string, title: string) {
		this.$store.commit('changeOverlay', true);

		this.bigImage = false;
		this.lyricObj = null;
		this.searchList = [];
		this.$ipcRenderer.send('searchReq', {
			artist: artist,
			title: title
		});
	}
	/**關鍵字紀錄 */
	private keywordSave(artist: string, title: string) {
		this.$ipcRenderer
			.invoke('historySave', {
				query: { artist, title },
				data: {
					$set: {
						artist,
						title,
						datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}
				}
			})
			.then(() => {
				this.keywords.unshift({
					artist,
					title,
					datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
				});
			})
			.catch(err => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});
	}
	/**取得歌詞 */
	private getLyric(url: string, exist: boolean) {
		this.$store.commit('changeOverlay', true);

		this.$ipcRenderer
			.invoke('getLyric', { url, exist })
			.then(res => {
				// 這邊為 main process產生的error
				if (res.error) this.$store.commit('snackbar', { text: res.error, color: Colors.Error });

				const { obj, exist } = res;
				this.$nextTick(() => {
					// check if has be in list
					this.lyricObj = {
						obj: Object.freeze({
							key: obj.lyricKey,
							url: obj.url,
							title: obj.mainTxt,
							artist: obj.artist,
							lyric: obj.lyricContent
						}),
						exist: exist
					};
				});
			})
			.catch(err => {
				// 這邊為其他 error，主要原因為上面
				this.$store.commit('snackbar', { text: err, color: Colors.Error });
			})
			.finally(() => {
				this.$store.commit('changeOverlay', false);
			});
	}

	/**展開寬度，三段 */
	private expandWidth() {
		if (this.$root.$data.webWidth < 960) {
			this.$ipcRenderer.send('windowWidth', { width: 960, height: this.windowHeight });
		} else if (this.$root.$data.webWidth < 1440) {
			this.$ipcRenderer.send('windowWidth', { width: 1680, height: this.windowHeight });
		} else {
			this.$ipcRenderer.send('windowWidth', { width: 480, height: this.windowHeight });
			this.bigImage = false;
		}
	}
}
</script>

<style lang="scss" scoped>
.ellipsis {
	width: calc(100% - 64px);
	// 12 + 16 + 36
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.no-active {
	cursor: default;
	&:hover::before,
	&:not(:hover)::before {
		background-color: transparent;
	}
}

.cardList-enter-active,
.cardList-leave-active {
	transition: all 0.5s;
}
.cardList-enter {
	opacity: 0.3;
	transform: translateX(75%);
}

.cardList-leave-to {
	opacity: 0;
	transform: translateX(-75%);
}

.lyricSlide-enter-active {
	transition: all 0.7s;
}

.lyricSlide-enter {
	opacity: 0.16;
	transform: translateY(50%);
}

.lyricsFadeIn-enter-active {
	transition: opacity 0.5s;
}

.lyricsFadeIn-leave-active {
	transition: 0s;
}

.lyricsFadeIn-enter {
	opacity: 0.16;
	// transform: translateX(75%);
}
</style>
