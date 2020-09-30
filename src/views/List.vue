<template>
	<div>
		<v-row no-gutters align="stretch" justify="center">
			<v-col
				cols
				class="pl-3"
				:style="{ 'min-height': `${$root.webHeight - 44}px`, 'max-width': isTwoColumn ? '416px' : null }"
			>
				<!-- <v-toolbar flat height="40" class="mb-2 mr-3 rounded-lg px-0"> -->
				<v-text-field
					v-model="filterStr"
					filled
					rounded
					dense
					hide-details
					placeholder="サーチ"
					color="success"
					class="mr-3"
				>
					<template v-slot:prepend-inner>
						<!-- style="margin-top: 6px;" -->
						<v-icon left small class="mt-1 mr-1">
							fas fa-search
						</v-icon>
					</template>
				</v-text-field>
				<!-- </v-toolbar> -->

				<v-list two-line class="transparent mt-2 py-0">
					<!-- transparent subheader -->
					<!--  -->
					<!-- <v-subheader inset>sub header</v-subheader>
					<v-divider inset />

					<v-list-item v-for="n1 in 2" :key="n1">
						<v-list-item-avatar>
							<v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" />
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title>{{ n1 }}</v-list-item-title>
							<v-list-item-subtitle>subtitle</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn icon>
								<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item> -->
					<!--  -->

					<v-virtual-scroll
						:items="filterList"
						:height="$root.webHeight - 92"
						item-height="72"
						class="min-scroll y"
					>
						<template v-slot="{ item }">
							<!-- <v-subheader inset v-if="index == 0">sub header</v-subheader> -->
							<!-- :src="`data:image/jpeg;base64,${imgurl.toString('base64')}`" -->

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
									<!-- {{ item.avatar == null }} -->
									<!-- {{ item.avatar }} -->
								</v-list-item-content>
								<v-list-item-action>
									<v-menu bottom right offset-x nudge-right="15" min-width="150">
										<template v-slot:activator="{ on: menu, attrs }">
											<!-- <v-tooltip left dark>
												<template v-slot:activator="{ on: tooltip }"> -->
											<v-btn icon v-bind="attrs" v-on="menu">
												<!-- v-on="{ ...tooltip, ...menu }" @click="getLyric(item)" -->
												<!-- @click.right="menuShowCmd(menu, attrs, value)" -->
												<v-icon color="grey lighten-1" small>
													fas fa-info
												</v-icon>
											</v-btn>
											<!-- </template>
											</v-tooltip> -->
										</template>
										<v-list dense color="brown darken-4" outlined class="py-0">
											<v-list-item>
												<v-icon
													class="mr-3"
													:color="item.ytObj ? 'success' : 'error'"
													size="20"
												>
													fas fa-music
												</v-icon>
												<v-icon
													class="mx-3"
													:color="item.imagePath ? 'success' : 'error'"
													size="20"
												>
													fas fa-image
												</v-icon>
											</v-list-item>
											<v-divider />

											<template v-if="item.ytObj && item.ytObj.length">
												<v-list-item
													v-for="(obj, idx) in item.ytObj"
													:key="item.ytObj[idx].id"
													@click="getLyric(item, item.ytObj[idx].id)"
												>
													<!-- <span class="marquee"> -->
													{{ obj.title }}
													<!-- </span> -->
												</v-list-item>
											</template>
											<template v-else>
												<v-list-item @click="getLyric(item, null)">
													{{ item.artist }} - {{ item.title }}
												</v-list-item>
											</template>
											<v-divider />

											<v-list-item @click="singleRemove(item.uniqueKey, $event)">
												<v-icon small>fas fa-times</v-icon>
												<span class="ml-3">削除</span>
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
				<template v-if="lyricObj">
					<v-card flat shaped width="100%">
						<LyricDisplay :lyric="lyricObj" />
						<v-divider />
						<EmbedPlayer :videoID="this.videoID" />
					</v-card>
				</template>
				<template v-else>
					<div class="d-flex align-center" style="height:100%">
						<v-card flat shaped width="100%">
							<v-card-subtitle class="text-center">
								<v-icon size="128">fas fa-spider</v-icon>
								<span class="mx-auto logo-text" style="">
									Lyrics Crawler
									<!-- {{ $t('message') }} -->
								</span>
							</v-card-subtitle>
						</v-card>
					</div>
				</template>
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
import display from '@/components/Display.vue';
import player from '@/components/Embed.vue';
import { LyModule } from '@/store/modules/lyrics';

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
	private filterStr = '';

	private list: Array<{
		title: string;
		artist: string;
	}> = [];
	private lyricObj: {
		key: string;
		url: string;
		title: string;
		artist: string;
		lyric: string;
		image?: string;
		imageSize: {};
	} | null = null;
	private videoID: string | null = null;

	private menuX = 0;
	private menuY = 0;

	get isTwoColumn(): boolean {
		return this.$root.$data.webWidth >= 960;
	}

	get filterList() {
		return this.$lodash.filter(this.list, o => {
			return o.title.toLowerCase().match(this.filterStr) || o.artist.toLowerCase().match(this.filterStr);
		});
	}

	// life cycle
	created() {
		if (!this.$root._events.getLyricByID) {
			this.$root.$on(
				'getLyricByID',
				(obj: {
					key: string;
					url: string;
					title: string;
					artist: string;
					lyric: string;
					image?: string;
					imageSize: {};
				}) => {
					console.log(obj);
					this.lyricObj = obj;
				}
			);
		}
	}

	mounted() {
		this.$ipcRenderer
			.invoke('listFind', { query: {}, sort: { artist: 1, title: 1, datetime: -1 } })
			.then(doc => {
				const filter = this.$lodash.filter(doc, 'ytObj').map(e => e.ytObj);
				const flatten = this.$lodash.flatten(filter).map(e => e.id);
				this.$store.commit('setPlayList', Object.freeze(flatten));

				const iconArray = doc.map((item: { iconPath?: string }) => item.iconPath || undefined);

				this.$ipcRenderer
					.invoke('loadBuffer', { path: iconArray })
					.then(res => {
						console.log(res);
						doc.forEach((e: { icon: Uint8Array }, i: number) => {
							if (res[i]) Object.assign(e, { icon: Buffer.from(res[i].data) });
						});
						this.list = doc;
					})
					.catch(err => {
						console.log(err);
					});

				console.log(doc);
				// this.lyricObj = this.$store.state.lyrics.lyricObj;
				this.lyricObj = LyModule.lyricObj;
				console.log(this.lyricObj);
			})
			.catch(err => {
				console.log(err);
				this.$store.commit('snackbar', { text: err, color: 'error' });
			});

		// this.lyricObj = this.$store.state.lyricObj;
	}

	beforeDestroy() {
		this.$root.$off('getLyricByID');
	}

	// methods
	private expandWidth() {
		if (!this.isTwoColumn) this.$ipcRenderer.send('windowWidth', { width: 1680 });
	}

	private async getLyric(item: { lyricUrl: string; imagePath: string; imageSize: {} }, ytID: string) {
		console.log(item);
		console.log(ytID);

		this.$store.commit('changeOverlay', true);
		this.expandWidth();

		if (!ytID) this.$store.commit('destroyPlayer');

		const res = await this.$ipcRenderer.invoke('getLyric', { url: item.lyricUrl });

		this.$nextTick(() => {
			if (res.error) {
				this.$store.commit('snackbar', { text: res.error, color: 'error' });
			} else {
				this.$nextTick(() => {
					const { obj } = res;
					this.lyricObj = {
						key: obj.lyricKey,
						url: obj.url,
						title: obj.mainTxt,
						artist: obj.artist,
						lyric: obj.lyricContent,
						image: item.imagePath || undefined,
						imageSize: item.imageSize || {}
					};
					this.videoID = ytID;
					console.log(this.lyricObj);
				});
			}
			this.$store.commit('changeOverlay', false);
		});
	}

	private singleRemove(key: string) {
		this.$ipcRenderer
			.invoke('listRemoveOne', { query: { uniqueKey: key } })
			.then(res => {
				console.log(res);
				if (res.ok > 0) {
					this.$ipcRenderer.send('removeFile', {
						files: [`${key}.jpg`, `${key}.icon.jpg`]
					});

					const index = this.$lodash.findIndex(this.list, ['uniqueKey', key]);
					this.list.splice(index, 1);
				}
			})
			.catch(err => {
				console.error(err);
			});

		// 刪除資料庫
		// this.$dbList.remove({ uniqueKey: key }, {}, err => {
		// 	if (err) {
		// 		this.$store.commit('snackbar', { text: err, color: 'error' });
		// 		return;
		// 	}

		// 	// 刪除圖片
		// 	const files = [`${this.$picPath}\\${key}.jpg`, `${this.$picPath}\\${key}_avatar.jpg`];
		// 	// files.forEach(file => {
		// 	// 	this.$fs.exists(file, exist => {
		// 	// 		if (exist) {
		// 	// 			this.$fs.unlink(file, err => {
		// 	// 				if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
		// 	// 			});
		// 	// 		}
		// 	// 	});
		// 	// });
		// 	this.$ipcRenderer.invoke('removeFile', { files }).then(res => {
		// 		console.log(res);
		// 	});

		// 	// 刪除列表
		// 	const index = this.$lodash.findIndex(this.list, ['uniqueKey', key]);
		// 	this.list.splice(index, 1);
		// });
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
</style>
