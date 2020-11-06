<template>
	<div>
		<v-row no-gutters align="stretch" justify="center">
			<v-col
				class="pl-3"
				:style="{ 'min-height': `${$root.webHeight - 44}px`, 'max-width': isTwoColumn ? '416px' : null }"
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
				</div>
				<!-- </v-col>
				<v-col
					cols="12"
					class="pl-3"
					:style="{ 'min-height': `${$root.webHeight - 84}px`, 'max-width': isTwoColumn ? '416px' : null }"
				> -->
				<v-list two-line class="transparent mt-2 py-0">
					<v-virtual-scroll
						:items="filterList"
						:height="$root.webHeight - 92"
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
									<v-icon v-else style="transform: rotate(135deg);">fas fa-tag</v-icon>
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

											<v-list-item @click="singleRemove(item.lyricsKey, $event)">
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

			<v-col v-if="isTwoColumn" cols class="px-3" style="border-left:1px solid rgba(150, 150, 150, 0.5);">
				<!-- <div class="d-flex align-center" style="height:100%;"> -->
				<transition name="fadeIn" mode="out-in">
					<template v-if="lyricsObj">
						<v-card flat shaped width="100%">
							<LyricDisplay :lyricsObj="lyricsObj" />
							<v-divider />
							<EmbedPlayer :videoID="videoID" />
						</v-card>
					</template>
					<template v-else>
						<div class="d-flex align-center" style="height:100%">
							<v-card flat shaped width="100%">
								<v-card-subtitle class="text-center">
									<v-icon size="128">fas fa-spider</v-icon>
									<span class="mx-auto logo-text" style="">
										EleCrawler
									</span>
								</v-card-subtitle>
							</v-card>
						</div>
					</template>
				</transition>
			</v-col>
		</v-row>

		<!--   absolute-->
		<!-- <v-menu v-model="showMenu" offset-y :position-x="menuX" :position-y="menuY" fixed min-width="150">
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
import { IlyricsDisplayObj, IlyricsObj, IsongList, IsongListWithIcon } from '@/types/renderer';
import { OutputInfo } from 'sharp';

import { Component, Vue } from 'vue-property-decorator';
// import { getModule } from 'vuex-module-decorators';

// import mymod from '@/store/mymodule';
// const $mymod = getModule(mymod);

@Component({
	components: {
		LyricDisplay: display,
		EmbedPlayer: player
	}
})
export default class List extends Vue {
	/**過濾字串 */
	private filterStr = '';

	/**清單 */
	private list: IsongListWithIcon[] = [];

	/**歌詞物件 */
	private lyricsObj: IlyricsDisplayObj | null = null;
	/**影片ID，Embed用 */
	private videoID: string | null = null;
	/**影片Title，Embed用 */
	// private videoTitle: string | null = null;

	get isTwoColumn(): boolean {
		return this.$root.$data.webWidth >= 960;
	}

	/**過濾後清單 */
	get filterList() {
		return this.$lodash.filter(this.list, o => {
			return o.title.toLowerCase().match(this.filterStr) || o.artist.toLowerCase().match(this.filterStr);
		});
	}

	// life cycle
	created() {
		if (!this.$root._events.getLyricByID) {
			this.$root.$on('getLyricByID', (obj: IlyricsDisplayObj) => {
				this.lyricsObj = obj;
			});
		}
	}

	mounted() {
		this.loadList();
	}

	beforeDestroy() {
		this.$root.$off('getLyricByID');
	}

	// methods

	/**展開視窗 */
	private expandWidth() {
		if (!this.isTwoColumn) this.$ipcRenderer.send('windowWidth', { width: 1680 });
	}

	/**刷新列表 */
	private loadList() {
		this.$ipcRenderer
			.invoke('listFind', { query: {}, sort: { artist: 1, title: 1, datetime: -1 } })
			.then((doc: IsongList[]) => {
				const filter = this.$lodash.filter(doc, 'videoArr').map(e => e.videoArr);
				const flatten = this.$lodash.flatten(filter).map(e => e?.videoID) as string[];
				AppModule.setPlayList(flatten);

				const iconArray = doc.map(item => item.iconPath || undefined);

				this.$ipcRenderer
					.invoke('loadBuffer', { path: iconArray })
					.then((res: { data: Buffer; info: OutputInfo }[]) => {
						doc.forEach((e, i) => {
							if (res[i]) Object.assign(e, { icon: Buffer.from(res[i].data) });
						});
						this.list = doc as IsongListWithIcon[];
						console.log(this.list);
					})
					.catch((err: Error) => {
						AppModule.snackbar({ text: err.message, color: Colors.Error });
					});

				// show all songs
				const toStr = doc.map((item: { title: string; artist: string }) => `${item.title} / ${item.artist}`);
				console.log(`%c${toStr.join(', ')}`, `color: ${this.$vuetify.theme.themes.dark.accent}`);

				/// /// /// /// /// /// /// /// ///
				this.lyricsObj = LyModule.lyricObj;
				console.log(this.lyricsObj);
			})
			.catch(err => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});
	}

	/**取得歌詞資訊 */
	private async getLyric(item: IsongListWithIcon, videoID: string, videoTitle: string) {
		AppModule.changeOverlay(true);
		this.expandWidth();

		if (!videoID) PlayerModule.destroyPlayer();

		const res = await this.$ipcRenderer.invoke('getLyrics', { url: item.lyricsUrl, exist: true });
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
						imageSize: item.imageSize || undefined
					};
					this.videoID = videoID;
					AppModule.setVideoTitle(videoTitle);

					console.log(this.lyricsObj);
					console.log(obj);
				});
			}
			AppModule.changeOverlay(false);
		});
	}

	/**刪除歌詞(包含圖片等) */
	private singleRemove(key: string) {
		this.$ipcRenderer
			.invoke('listRemoveOne', { query: { lyricsKey: key } })
			.then(res => {
				console.log(res);
				if (res.ok > 0) {
					this.$ipcRenderer.send('removeFile', {
						files: [`${key}.jpg`, `${key}.icon.jpg`]
					});

					const index = this.$lodash.findIndex(this.list, ['lyricsKey', key]);
					this.list.splice(index, 1);
				}
			})
			.catch(err => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});
	}

	private openEditWindow(obj: IsongListWithIcon) {
		const lyricObj = {
			artist: obj.artist,
			title: obj.title,
			lyricsKey: obj.lyricsKey,
			lyricsUrl: obj.lyricsUrl
		};
		const qs = this.$qs.stringify(lyricObj, { delimiter: ',' });

		const routeData = this.$router.resolve({ path: '/panel.html', append: true });
		// window.open(routeData.location.path, 'editPanel', qs);
		window.open(routeData.location.path, 'editPanel', qs);
		console.log(routeData);
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
