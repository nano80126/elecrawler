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
							@keyup.enter="lyricsSearch"
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
							@keyup.enter="lyricsSearch"
						>
							<template v-slot:prepend-inner>
								<v-icon left small class="mt-1 mr-1">fas fa-microphone-alt</v-icon>
							</template>
						</v-text-field>
					</v-col>

					<v-col cols="auto">
						<v-btn icon color="success" height="40" @click="lyricsSearch" :disabled="!canSearch">
							<v-icon small>fas fa-search</v-icon>
						</v-btn>

						<v-btn text outlined height="40" min-width="0" width="15" class="px-0" @click="expandWidth">
							<v-icon x-small class="mx-0">
								{{ $root.webWidth >= 1440 ? 'fas fa-caret-left' : 'fas fa-caret-right' }}
							</v-icon>
						</v-btn>
					</v-col>

					<template v-if="keywordsExist">
						<v-col cols="12" class="mt-3" />
						<!-- reserved for change line -->
						<v-col cols="auto">
							<v-chip label small color="orange lighten-1">
								<v-icon x-small color="white">fas fa-star</v-icon>
								<span class="ml-1 white--text">{{ $t('keyWord') }}</span>
							</v-chip>
						</v-col>
						<v-col cols class="pl-3 keyword">
							<!-- <div style="overflow-x:auto; white-space:nowrap;"> -->
							<transition-group name="slideIn" mode="out-in">
								<!-- <template v-if="keywords.length > 0"> -->
								<v-chip
									v-for="(words, key) in keywords"
									:key="`keywords${key}`"
									small
									class="ml-2"
									color="light-blue lighten-1"
									style="cursor: pointer;"
									@click="historySearch(words.artist, words.title)"
								>
									{{ words.title || words.artist }}
								</v-chip>
								<!-- </template> -->
							</transition-group>
						</v-col>
					</template>

					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<transition name="lyricSlide">
						<v-col v-if="lyricsObj && !isTwoColumn" cols="12" class="mt-3">
							<!-- :style="{height: `${($root.webHeight - 136) / 2 - 12}px`" -->
							<div
								class="min-scroll y success-scroll"
								:style="{ height: `${($root.webHeight - 136) / 2.5 - 12}px` }"
							>
								<lyricCard :lyricsObj="lyricsObj" :exist.sync="lyricsObj.exist" />
							</div>
						</v-col>
					</transition>

					<v-col cols="12" class="mt-3">
						<v-virtual-scroll
							class="min-scroll y success-scroll scroll-darken"
							bench="1"
							:items="searchList"
							item-height="150"
							:height="($root.webHeight - 136) / (lyricsObj && !isTwoColumn ? 1.667 : 1)"
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
									<v-card-title style="position:relative; white-space: nowrap;">
										<span class="ellipsis-title">{{ item.title }}</span>
										<!-- <v-chip
											icon
											v-if="item.exist"
											class="ml-auto mr-n2 no-active"
											@click.prevent
											:ripple="false"
										> -->
										<span v-if="item.exist" class="ml-auto">
											<v-icon small color="grey">fas fa-list</v-icon>
											<v-icon
												size="16"
												color="success darken-1"
												class="mr-1"
												style="position:absolute; right:0;"
											>
												fas fa-check
											</v-icon>
										</span>
										<!-- </v-chip> -->
									</v-card-title>
									<v-card-subtitle>
										<span class="ellipsis-artist">{{ item.artist }}</span>
									</v-card-subtitle>

									<v-divider />
									<v-card-actions>
										<v-btn text color="info" @click="getLyric(item.lyricsUrl, item.exist)">
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
												{{ item.lyricsFront }}
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
					<!-- {{ this.lyricsObj ? this.lyricsObj.exist : null }} -->
					<template v-if="lyricsObj">
						<div class="min-scroll y primary-scroll" :style="{ height: `${$root.webHeight - 44}px` }">
							<lyricCard :lyricsObj="lyricsObj" :exist.sync="lyricsObj.exist" />
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

			<transition name="lyricsFadeIn">
				<v-col
					v-if="isThreeColumn"
					cols
					class="pl-3"
					:style="{ 'max-width': extendImage ? `${$root.webWidth - 480}px` : `${$root.webWidth - 960}px` }"
					style="border-left:1px solid rgba(150, 150, 150, 0.5);"
				>
					<template v-if="lyricsObj && lyricsObj.exist">
						<!-- <div class="min-scroll y info-scroll" :style="{ height: `${$root.webHeight - 44}px` }"> -->
						<lyricMedia :extendImage.sync="extendImage" :lyricsObj="lyricsObj" />
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
		</v-row>
	</div>
</template>

<script lang="ts">
import board from '@/components/Search/Board.vue';
import media from '@/components/Search/Media.vue';
import { AppModule, Colors } from '@/store/modules/app';

import { Component, Vue } from 'vue-property-decorator';
import { EwindowSend, Ikeywords, IlistSearched, IlyricsObjSearched } from '@/types/renderer';

@Component({
	components: {
		lyricCard: board,
		lyricMedia: media
	}
})
export default class Search extends Vue {
	/**搜尋清單 */
	private searchList: IlistSearched[] = [];

	/**歌詞物件 */
	private lyricsObj: IlyricsObjSearched | null = null;

	/**搜尋歌手 */
	private artist = '';
	/**搜尋歌曲名 */
	private title = '';
	/**是否展開大圖 */
	private extendImage = false;
	/**關鍵字紀錄 */
	private keywords: Ikeywords[] = [];
	/**關鍵字是否存在 */
	private keywordsExist = false;
	/**防抖動計時器 */
	private debounceTimer: NodeJS.Timeout | null = null;

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
		return this.$root.$data.webWidth >= 960 && !this.extendImage;
	}

	get isThreeColumn(): boolean {
		return this.$root.$data.webWidth >= 1440 && this.lyricsObj != null;
	}

	created() {
		this.$ipcRenderer
			.invoke('historyFind', { query: {} })
			.then((res: Ikeywords[]) => {
				// forEach + setTimeout for animation load
				if (res.length > 0) {
					this.keywordsExist = true;
					res.forEach((item, i: number) => {
						setTimeout(() => {
							this.keywords.push(item);
						}, 100 * (i + 1));
					});
				}
			})
			.catch(err => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});
	}

	mounted() {
		// // load list saved
		// this.$ipcRenderer
		// 	.invoke('listFind', { query: {}, sort: { datetime: 1 } })
		// 	.then((doc: IsongList[]) => {
		// 		this.list = doc;
		// 		console.log(this.list);
		// 		this.urlList = doc.map(item => item.lyricsUrl);
		// 		console.log(this.urlList);
		// 	})
		// 	.catch(err => {
		// 		this.$store.commit('snackbar', { text: err, color: Colors.Error });
		// 	});
	}

	beforeDestroy() {
		this.$ipcRenderer.removeAllListeners('searchRes');
		this.$ipcRenderer.removeAllListeners('lyricRes');
	}
	/**搜尋 */
	private lyricsSearch() {
		clearTimeout(this.debounceTimer as NodeJS.Timeout);
		this.debounceTimer = setTimeout(() => {
			if (!this.canSearch) return;
			AppModule.changeOverlay(true);

			this.extendImage = false;
			this.lyricsObj = null;
			this.searchList = [];
			this.$ipcRenderer
				.invoke('searchReq', {
					artist: this.artist,
					title: this.title
				})
				.then(res => {
					this.searchRes(res);
				})
				.catch((err: Error) => {
					AppModule.snackbar({ text: err.message, color: Colors.Error });
				})
				.finally(() => {
					this.keywordSave(this.artist, this.title);
				});
			///
		}, 250);
	}

	/**歷史紀錄搜尋 */
	private historySearch(artist: string, title: string) {
		AppModule.changeOverlay(true);

		this.extendImage = false;
		this.lyricsObj = null;
		this.searchList = [];
		this.$ipcRenderer
			.invoke('searchReq', {
				artist: artist,
				title: title
			})
			.then(res => {
				this.searchRes(res);
			})
			.catch((err: Error) => {
				AppModule.snackbar({ text: err.message, color: Colors.Error });
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
	/**處理搜尋回傳之物件 */
	private searchRes(res: { error: Error; list: IlistSearched[] }) {
		if (res.error) {
			AppModule.snackbar({ text: res.error.message, color: Colors.Error });
		}

		// 確認是否存在列表中
		this.$nextTick(() => {
			res.list.forEach(obj => {
				// const index = this.list.findIndex(item => item.lyricsUrl == obj.lyricsUrl);
				const exist = AppModule.urlList.includes(obj.lyricsUrl);
				Object.assign(obj, { exist });

				setTimeout(() => {
					this.searchList.push(Object.freeze(obj));
				}, obj.id * 50);
			});
			AppModule.changeOverlay(false);
		});
	}

	/**取得歌詞 */
	private getLyric(url: string, exist: boolean) {
		AppModule.changeOverlay(true);

		this.$ipcRenderer
			.invoke('getLyrics', { url, exist })
			.then(res => {
				// 這邊為 main process產生的error
				if (res.error) {
					AppModule.snackbar({ text: res.error, color: Colors.Error });
				}

				const { obj, exist } = res;
				this.$nextTick(() => {
					// check if has be in list
					this.lyricsObj = {
						obj: Object.freeze({
							artist: obj.artist,
							title: obj.title,
							lyricsKey: obj.lyricsKey,
							lyricsUrl: obj.lyricsUrl,
							lyrics: obj.lyrics
						}),
						exist: exist
					};
				});
			})
			.catch(err => {
				// 這邊為其他 error，主要原因為上面
				AppModule.snackbar({ text: err, color: Colors.Error });
			})
			.finally(() => {
				AppModule.changeOverlay(false);
			});
	}

	/**展開寬度，三段 */
	private expandWidth() {
		if (this.$root.$data.webWidth < 960) {
			this.$ipcRenderer.send(EwindowSend.WINDOWWIDTH, { width: 960, height: this.windowHeight });
		} else if (this.$root.$data.webWidth < 1440) {
			this.$ipcRenderer.send(EwindowSend.WINDOWWIDTH, { width: 1680, height: this.windowHeight });
		} else {
			this.$ipcRenderer.send(EwindowSend.WINDOWWIDTH, { width: 480, height: this.windowHeight });
			this.extendImage = false;
		}
	}
}
</script>

<style lang="scss" scoped>
.keyword {
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ellipsis-title {
	display: block;
	width: calc(100% - 48px); // 12 + 16 + 36
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ellipsis-artist {
	display: block;
	width: 100%; // 12 + 16 + 36
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

.slideIn-enter-active,
.slideIn-leave-active {
	transition: all 0.5s;
}

.slideIn-enter {
	opacity: 0.12;
	transform: translateX(200%);
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
