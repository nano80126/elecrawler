<template>
	<div>
		<v-row no-gutters align="stretch" justify="start">
			<v-col
				class="pl-3"
				:style="{
					'min-height': `${$root.webHeight - 44 - 24}px`,
					'min-width': '416px',
					'max-width': isTwoColumn ? '416px' : null,
				}"
			>
				<div class="d-flex align-center justify-center">
					<v-text-field
						v-model="filterStr"
						filled
						rounded
						dense
						hide-details
						:placeholder="$t('search_alt')"
						color="success"
						class="mr-3"
					>
						<template v-slot:prepend-inner>
							<v-icon left small class="mt-1 mr-1">fas fa-search</v-icon>
						</template>
					</v-text-field>

					<v-btn icon color="info" class="mr-3 blue-grey darken-4" height="40" width="40" @click="loadList">
						<v-icon small>fa fa-sync</v-icon>
					</v-btn>

					<v-btn text outlined height="40" min-width="0" width="15" class="px-0" @click="expandWidth">
						<v-icon x-small class="mx-0">
							{{ $root.webWidth >= 960 ? 'fas fa-caret-left' : 'fas fa-caret-right' }}
						</v-icon>
					</v-btn>
				</div>

				<!-- height: 32+40+8+12 = 92 -->
				<v-list two-line class="transparent mt-2 py-0">
					<v-virtual-scroll
						:items="filterList"
						:height="$root.webHeight - 92 - 24"
						item-height="72"
						class="min-scroll y"
					>
						<template v-slot="{ item }">
							<v-list-item :key="item.uniqueKey" class="mr-3">
								<v-list-item-avatar>
									<v-img
										v-if="item.icon != undefined"
										:src="`data:image/jpeg;base64,${item.icon.toString('base64')}`"
									/>
									<v-icon v-else style="transform: rotate(135deg)">fas fa-tag</v-icon>
									<!-- {{ toBase64(item.avatarPath).length }} -->
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
									<v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-action>
									<v-menu bottom right offset-x nudge-right="15" min-width="250">
										<template v-slot:activator="{ on: menu, attrs }">
											<v-btn icon v-bind="attrs" v-on="menu">
												<v-icon color="grey lighten-1" small>fas fa-info</v-icon>
											</v-btn>
										</template>
										<v-list dense color="brown darken-4" outlined class="py-0">
											<v-list-item>
												<v-icon
													class="mr-3"
													:color="item.videoArr ? 'success' : 'grey'"
													size="20"
												>
													fas fa-music
												</v-icon>
												<v-icon
													class="mx-3"
													:color="item.imagePath ? 'success' : 'grey'"
													size="20"
												>
													fas fa-image
												</v-icon>

												<v-spacer />
												<v-btn icon color="primary" @click="openEditWindow(item)">
													<v-icon size="20">fas fa-edit</v-icon>
												</v-btn>
											</v-list-item>
											<v-divider />

											<template v-if="item.videoArr && item.videoArr.length">
												<v-list-item
													v-for="(obj, idx) in item.videoArr"
													:key="`${obj.videoID}_${idx}`"
													@click="getLyric(item, obj.videoID, obj.videoTitle)"
												>
													<template v-if="obj.artist">
														<span>{{ `${item.title} / ${obj.artist}` }}</span>
														<span v-if="obj.cover" class="ml-3">(cover)</span>
													</template>
													<template v-else>
														{{ obj.videoTitle }}
													</template>
												</v-list-item>
											</template>
											<template v-else>
												<v-list-item @click="getLyric(item, null)">
													{{ item.artist }} - {{ item.title }}
												</v-list-item>
											</template>
											<v-divider />

											<v-list-item @click="listRemoveOne(item)">
												<v-icon small>fas fa-times</v-icon>
												<span class="ml-3">
													{{ $t('delete') }}
												</span>
											</v-list-item>
										</v-list>
									</v-menu>
								</v-list-item-action>
							</v-list-item>
						</template>
					</v-virtual-scroll>
				</v-list>
			</v-col>

			<!-- height: 32+12 = 44 -->
			<transition name="rightClose" mode="out-in">
				<v-col
					v-if="isTwoColumn"
					cols
					class="px-3"
					style="border-left: 1px solid rgba(150, 150, 150, 0.5)"
					:style="{ height: `${$root.webHeight - 44 - 24}px` }"
				>
					<!-- :style="{ height: `${$root.webHeight - 44 - 24}px` }" -->
					<!-- <div class="d-flex align-center" style="height:100%;"> -->
					<transition name="fadeIn" mode="out-in">
						<template v-if="lyricsObj">
							<v-card flat shaped width="100%" height="">
								<LyricDisplay :lyricsObj="lyricsObj" />
								<v-divider />
								<EmbedPlayer :videoID="videoID" />
							</v-card>
						</template>
						<template v-else>
							<div class="d-flex align-center" style="height: 100%">
								<v-card flat shaped width="100%">
									<v-card-subtitle class="text-center">
										<v-icon size="128">fas fa-spider</v-icon>
										<span class="mx-auto logo-text" style=""> EleCrawler </span>
									</v-card-subtitle>
									<!-- <v-card-text>
									{{ filterList }}
								</v-card-text> -->
								</v-card>
							</div>
						</template>
					</transition>
				</v-col>
			</transition>
		</v-row>

		<v-dialog v-model="listRemoveModal" persistent max-width="360">
			<v-card v-if="modalItem" class="mx-auto rounded-lg" outlined>
				<v-card-title class="py-2 px-4 error--text"> {{ $t('delete') }}? </v-card-title>
				<v-divider />

				<v-list-item>
					<v-list-item-content>
						<v-list-item-title>{{ modalItem.title }}</v-list-item-title>
						<v-list-item-subtitle>{{ modalItem.artist }}</v-list-item-subtitle>
					</v-list-item-content>

					<v-list-item-avatar size="80" color="grey darken-2">
						<v-img
							v-if="modalItem.icon"
							class="mx-auto"
							:src="`data:image/jpeg;base64,${modalItem.icon.toString('base64')}`"
						/>
						<v-icon v-else large>far fa-image</v-icon>
					</v-list-item-avatar>
				</v-list-item>

				<v-divider />
				<v-card-actions>
					<v-btn width="120" color="warning" @click="ResolveModal">{{ $t('confirm') }}</v-btn>
					<v-btn width="120" class="ml-auto" color="info" @click="listRemoveModal = false">
						{{ $t('cancel') }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!--   absolute-->
		<!-- 
		<v-menu v-model="showMenu" offset-y :position-x="menuX" :position-y="menuY" fixed min-width="150">
			<v-list color="blue-grey lighten-2">
				<v-list-item>1</v-list-item>
				<v-list-item>2</v-list-item>
				<v-list-item>3</v-list-item>
				<v-list-item>4</v-list-item>
			</v-list>
		</v-menu> -->
	</div>
</template>

<script lang="ts">
import display from '@/components/List/Display.vue';
import player from '@/components/List/Embed.vue';
import { AppModule, Colors } from '@/store/modules/app';
import { LyModule } from '@/store/modules/lyrics';
import { PlayerModule } from '@/store/modules/player';
import { OutputInfo } from 'sharp';
import { IlyricsDisplayObj, IlyricsObj, IsongList, IsongListWithIcon } from '@/types/renderer';
import { EcrawlerOn, EfsOn, EpanelOn, EwindowOn, EmongoOn, EsharpOn } from '@/types/enum';

import { Component, Vue, Watch } from 'vue-property-decorator';
// import { getModule } from 'vuex-module-decorators';

// import mymod from '@/store/mymodule';
// const $mymod = getModule(mymod);

@Component({
	components: {
		LyricDisplay: display,
		EmbedPlayer: player,
	},
})
export default class List extends Vue {
	/**過濾字串 */
	private filterStr = '';
	/**播放清單 */
	private list: IsongListWithIcon[] = [];
	/**歌詞物件 */
	private lyricsObj: IlyricsDisplayObj | null = null;
	/**影片ID，Embed用 */
	private videoID: string | null = null;
	/**影片Title，Embed用 */
	// private videoTitle: string | null = null;
	/**列表刪除 互動視窗 顯示旗標 */
	private listRemoveModal = false;
	/**互動視窗圖片 */
	private modalItem: IsongListWithIcon | null = null;
	/**同意刪除 */
	private ModalResolve = false;

	get isTwoColumn(): boolean {
		return this.$root.$data.webWidth >= 960;
	}

	/**過濾後清單 */
	get filterList(): Array<IsongListWithIcon> {
		const filterTxt = this.filterStr.toLowerCase();
		return this.$lodash.filter(this.list, (o) => {
			return o.title.toLowerCase().match(filterTxt) || o.artist.toLowerCase().match(filterTxt);
		}) as Array<IsongListWithIcon>;
	}

	@Watch('$store.getters.lyricsKey')
	changeLyricsKey(): void {
		this.lyricsObj = LyModule.lyricObj;
	}

	// life cycle
	created(): void {
		// if (!this.$root.$eventNames().includes('getLyricByID')) {
		// 	this.$root.$on('getLyricByID', (obj: IlyricsDisplayObj) => {
		// 		console.info('$emit', obj);
		// 		this.lyricsObj = obj;
		// 		console.info('$emit lyricsObj', this.lyricsObj);
		// 	});
		// }
		// console.info(this.$root.$eventNames());
	}

	mounted(): void {
		this.getPort();
		this.loadList();
	}

	/**取得後端 Port */
	private getPort() {
		if (AppModule.port == 0) {
			this.$ipcRenderer.invoke('getPort').then((port: number) => {
				AppModule.changePort(port);
			});
		}
	}

	/**展開視窗 */
	private expandWidth() {
		if (this.$root.$data.webWidth < 960) this.$ipcRenderer.send(EwindowOn.WINDOWWIDTH, { width: 1680 });
		else this.$ipcRenderer.send(EwindowOn.WINDOWWIDTH, { width: 480 });
	}

	/**刷新列表 */
	private loadList() {
		this.$ipcRenderer
			.invoke(EmongoOn.LISTFIND, { query: {}, sort: { artist: 1, title: 1, datetime: -1 } })
			.then((doc: IsongList[]) => {
				const filter = this.$lodash.filter(doc, 'videoArr').map((e) => e.videoArr);
				const flatten = this.$lodash.flatten(filter).map((e) => e?.videoID) as string[];
				AppModule.setPlayList(flatten);

				///  如果設置 shuffle mode 在載入 playList 之前，call setShufflePlayList()
				// if (PlayerModule.playerShuffle && AppModule.shuffledPlayList == []) {
				// 	AppModule.setShufflePlayList();
				// }
				///

				const iconArray = doc.map((item) => item.iconPath || undefined);
				this.$ipcRenderer
					.invoke(EsharpOn.LOADIMAGEBYPATH, { path: iconArray })
					.then((res: { data: Buffer; info: OutputInfo }[]) => {
						doc.forEach((e, i) => {
							if (res[i]) Object.assign(e, { icon: Buffer.from(res[i].data) });
						});
						this.list = doc as IsongListWithIcon[];
					})
					.catch((err: Error) => {
						AppModule.snackbar({ text: err.message, color: Colors.Error });
					});

				// show all songs
				// if (process.env.NODE_ENV == 'development') {
				// const toStr = doc.map((item) => `${item.title} / ${item.artist}`);
				// console.info(`%c${toStr.join(', ')}`, `color: ${this.$vuetify.theme.themes.dark.accent}`);
				// console.info(toStr);
				// }

				/// /// /// /// /// /// /// /// /// 先判斷不存在 /// 否則會被refresh刷掉
				if (!this.lyricsObj) this.lyricsObj = LyModule.lyricObj;
			})
			.catch((err) => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});
	}

	/**取得歌詞資訊 */
	private async getLyric(item: IsongListWithIcon, videoID: string, videoTitle: string) {
		AppModule.changeOverlay(true);
		if (!this.isTwoColumn) this.expandWidth();

		if (!videoID) PlayerModule.destroyPlayer();

		const res = await this.$ipcRenderer.invoke(EcrawlerOn.LYRICS, { url: item.lyricsUrl, exist: true });
		this.$nextTick(() => {
			if (res.error) {
				AppModule.snackbar({ text: res.error, color: Colors.Error });
			} else {
				this.$nextTick(() => {
					const obj = res.obj as IlyricsObj;

					this.lyricsObj = {
						title: obj.title,
						artist: obj.artist,
						lyricsKey: obj.lyricsKey,
						lyricsUrl: obj.lyricsUrl,
						lyrics: obj.lyrics,
						imagePath: item.imagePath || undefined,
						imageSize: item.imageSize || undefined,
					};
					this.videoID = videoID;
					LyModule.saveLyrics(this.lyricsObj);
					PlayerModule.setVideoTitle(videoTitle);
				});
			}
			AppModule.changeOverlay(false);
		});
	}

	/**Modal Resolve */
	private ResolveModal() {
		this.ModalResolve = true; // 同意刪除
		this.listRemoveModal = false; // 關閉 modal
	}

	/**刪除歌詞(包含圖片等) */
	private listRemoveOne(item: IsongListWithIcon) {
		new Promise((resolve, reject) => {
			const key = item.lyricsKey;

			this.modalItem = item;
			this.listRemoveModal = true;
			this.ModalResolve = false;

			const modalInterval = window.setInterval(() => {
				if (!this.listRemoveModal) {
					window.clearInterval(modalInterval);
					if (this.ModalResolve) {
						this.ModalResolve = false;
						resolve(key);
					} else {
						reject();
					}
				}
			}, 200);
		})
			.then((key) => {
				this.$ipcRenderer
					.invoke(EmongoOn.LISTREMOVEONE, { query: { lyricsKey: key } })
					.then((res) => {
						if (res.ok > 0) {
							// 刪除圖片
							this.$ipcRenderer.send(EfsOn.REMOVEPIC, {
								files: [`${key}.jpg`, `${key}.icon.jpg`],
							});
							// 刪除 list 項目
							const index = this.$lodash.findIndex(this.list, ['lyricsKey', key]);
							this.list.splice(index, 1);
							// 刪除 urlList
							AppModule.removeUrlList(item.lyricsUrl);
						}
					})
					.catch((err) => {
						AppModule.snackbar({ text: err, color: Colors.Error });
					});
			})
			.catch(() => {
				// nothing to do
			})
			.finally(() => {
				this.modalItem = null;
			});
	}

	private openEditWindow(obj: IsongListWithIcon) {
		const lyricObj = {
			artist: obj.artist,
			title: obj.title,
			lyricsKey: obj.lyricsKey,
			lyricsUrl: obj.lyricsUrl,
		};

		if (AppModule.subWindow) {
			this.$ipcRenderer.invoke(EpanelOn.PANELSHOW).then((exist: boolean) => {
				if (exist) {
					const data = Object.assign(lyricObj, { delay: 500 });
					AppModule.subWindow?.postMessage({ type: 'lyricsObj', data }, '*');
				} else {
					const qs = this.$qs.stringify(lyricObj, { delimiter: ',' });
					const routeData = this.$router.resolve({ path: '/panel.html', append: true });

					const subWindow = window.open(routeData.location.path, 'editPanel', qs);
					AppModule.setSubWindow(subWindow);
				}
			});
		} else {
			const qs = this.$qs.stringify(lyricObj, { delimiter: ',' });
			const routeData = this.$router.resolve({ path: '/panel.html', append: true });

			const subWindow = window.open(routeData.location.path, 'editPanel', qs);
			AppModule.setSubWindow(subWindow);
		}
	}
}
</script>

<style lang="scss" scoped>
.logo-text {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	font-size: 32px;
}

.marquee {
	position: absolute;
	left: 0;
	text-align: center;
	width: 150%;
	white-space: nowrap;
	text-overflow: ellipsis;
	// height:50px;
	// background:#f00;
	animation-name: marqueeAnime;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	animation-duration: 2.5s;
}

@keyframes marqueeAnime {
	from {
		margin-left: 100%;
	}
	to {
		margin-left: -250%;
	}
}

.rightClose {
	&-enter-active,
	&-leave-active {
		transition: all 0.5s ease;
	}

	&-leave {
		transform-origin: 100% 50%;
		margin-right: 0;
	}
	&-leave-to {
		transform-origin: 100% 50%;
		margin-right: -100%;
	}
}

.fadeIn-enter-active {
	transition: opacity 0.5s ease;
}

.fadeIn-leave-active {
	transition: all 0.5s ease;
}

.fadeIn-enter {
	opacity: 0.16;
}

.fadeIn-leave-to {
	opacity: 0;
	transform: translateX(100%);
}
</style>
