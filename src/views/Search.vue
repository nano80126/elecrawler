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
							v-model="artist"
							filled
							rounded
							dense
							hide-details
							placeholder="歌手名"
							class="mx-1"
							color="success"
							@keyup.enter="lyricSearch"
						>
							<template v-slot:prepend-inner>
								<v-icon small class="mt-1 mr-1">fas fa-microphone-alt</v-icon>
							</template>
						</v-text-field>
					</v-col>

					<v-col>
						<v-text-field
							v-model="title"
							filled
							rounded
							dense
							placeholder="曲名"
							hide-details
							class="mx-1"
							color="success"
							@keyup.enter="lyricSearch"
						>
							<template v-slot:prepend-inner>
								<v-icon small class="mt-1 mr-1">fas fa-music</v-icon>
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
								{{ isTwoColumn || isThreeColumn ? 'fas fa-caret-left' : 'fas fa-caret-right' }}
							</v-icon>
						</v-btn>
					</v-col>

					<template v-if="keywords.length > 0">
						<v-col cols="12" class="mt-3" />
						<!-- reserved for change line -->
						<v-col cols="auto">
							<v-chip label small color="orange lighten-1">
								<v-icon x-small color="white">fas fa-star</v-icon>
								<span class="ml-1 white--text">キーワード</span>
							</v-chip>
						</v-col>
						<v-col cols class="px-3 ellipsis" style="width:100%;">
							<!-- <div style="overflow-x:auto; white-space:nowrap;"> -->
							<v-chip
								v-for="words in keywords"
								:key="words._id"
								small
								class="ml-2 mt-1"
								color="light-blue lighten-2"
								style="cursor: pointer;"
								@click="historySearch(words.artist, words.title)"
							>
								{{ words.title || words.artist }}
							</v-chip>
						</v-col>
					</template>
					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<!-- scroll below  --><!-- scroll below  --><!-- scroll below  -->
					<transition name="lyricSlide">
						<v-col v-if="lyricObj && !isTwoColumn" cols="12" class="mt-3">
							<!-- :style="{height: `${($root.webHeight - 136) / 2 - 12}px`" -->
							<div
								class="min-scroll y success-scroll"
								:style="{ height: `${($root.webHeight - 136) / 2.5 - 12}px` }"
							>
								<!-- <v-col  cols="12" class="mb-3 px-0"> -->
								<lyricCard :lyric="lyricObj" :exist.sync="lyricObj.exist" />
								<!-- </v-col> -->
							</div>
						</v-col>
					</transition>

					<v-col cols="12" class="mt-3">
						<v-virtual-scroll
							class="min-scroll y success-scroll scroll-darken"
							bench="1"
							:items="list"
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
									</v-card-title>
									<v-card-subtitle>{{ item.artist }}</v-card-subtitle>

									<v-divider />
									<v-card-actions>
										<v-btn text color="info" @click="getLyric(item.href)">
											<v-icon>fas fa-link</v-icon>
											<span class="ml-2 font-weight-bold">リンク</span>
										</v-btn>

										<v-spacer />

										<v-tooltip left max-width="348" transition="slide-y-transition">
											<template v-slot:activator="{ on, attrs }">
												<v-btn icon v-bind="attrs" v-on="on">
													<!-- @click="item.expanded = !item.expanded" -->
													<v-icon style="transform: rotateY(180deg)">
														far fa-comment-dots
														<!-- {{ item.expanded ? 'fas fa-chevron-up' : '
														fas fa-chevron-down' }} -->
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
								歌詞を探しましょう
							</v-card-subtitle>
						</v-card>
					</div>
				</template>
				<!-- </transition> -->
			</v-col>
			<!-- </template> -->

			<!-- <keep-alive> -->
			<!-- <template v-if="isThreeColumn"> -->
			<v-col
				v-if="isThreeColumn"
				cols
				class="px-3"
				:style="{ 'max-width': bigImage ? `${$root.webWidth - 481}px` : `${$root.webWidth - 962}px` }"
				style="border-left:1px solid rgba(150, 150, 150, 0.5);"
			>
				<template v-if="lyricObj && lyricObj.exist">
					<lyricMedia :bigImage.sync="bigImage" :lyric="lyricObj" />
				</template>
				<template v-else>
					<div class="d-flex align-center" style="height:100%">
						<v-card flat shaped width="100%">
							<v-card-subtitle class="text-center">
								リストに追加しないと操作できず
							</v-card-subtitle>
						</v-card>
					</div>
				</template>
			</v-col>
			<!-- </template> -->
			<!-- </keep-alive> -->
		</v-row>
	</div>
</template>

<script>
import card from '@/components/LyricCard.vue';
import media from '@/components/LyricMedia.vue';

export default {
	components: {
		// lyricCard: () => import(/* webpackChunkName */ '@/components/LyricCard.vue'),
		lyricCard: card,
		// lyricMedia: () => import(/* webpackChunkName */ '@/components/LyricMedia.vue')
		lyricMedia: media
	},
	data() {
		return {
			lyricObj: null,
			//
			list: [],
			//
			artist: null,
			title: null,
			//
			bigImage: false,
			// searchType: 'title',
			// types: Object.freeze({
			// 	artist: '歌手名',
			// 	title: '曲名'
			// }),

			keywords: []
		};
	},
	computed: {
		canSearch() {
			return (this.title && this.title.length > 0) || (this.artist && this.artist.length > 0);
		},

		windowWidth() {
			return this.$root.webWidth;
		},

		windowHeight() {
			return this.$root.webHeight;
		},

		isTwoColumn() {
			return this.$root.webWidth >= 960 && !this.bigImage;
		},

		isThreeColumn() {
			return this.$root.webWidth >= 1440 && this.lyricObj;
		}
		// textFieldHeight() {
		// 	return this.$refs.btn.clientHeight;
		// }
	},

	created() {
		// console.log(this);
		this.$dbHistory
			.find({})
			.sort({ datetime: -1 })
			.limit(5)
			.exec((err, doc) => {
				if (err) console.warn(err);
				this.keywords = doc;

				// if (process.env.NODE_ENV == 'development') console.log(doc);
			});
	},
	mounted() {
		const included = this.$ipcRenderer.eventNames().includes('searchRes');
		if (!included) {
			this.$ipcRenderer.on('searchRes', (e, args) => {
				if (args.error) console.error(args.error);

				this.$nextTick(() => {
					args.list.forEach((obj, idx) => {
						setTimeout(() => {
							this.list.push(Object.freeze(obj));
						}, idx * 50);
					});
				});
				this.$store.commit('changeOverlay', false);
			});
		}
		//

		const included2 = this.$ipcRenderer.eventNames().includes('lyricRes');
		if (!included2) {
			this.$ipcRenderer.on('lyricRes', (e, args) => {
				if (args.error) console.error(args.error);

				this.$nextTick(() => {
					this.$dbList.count({ uniqueKey: args.lyricKey }, (err, count) => {
						if (err) console.warn(err);
						//
						this.lyricObj = {
							obj: Object.freeze({
								key: args.lyricKey,
								url: args.url,
								title: args.mainTxt,
								artist: args.artist,
								lyric: args.lyricContent
							}),
							exist: count > 0
						};
					});
				});
				console.log(args);
				this.$store.commit('changeOverlay', false);
			});
		}
	},

	beforeDestroy() {
		this.$ipcRenderer.removeAllListeners('searchRes');
		this.$ipcRenderer.removeAllListeners('lyricRes');
	},

	methods: {
		lyricSearch() {
			if (!this.canSearch) return;
			this.$store.commit('changeOverlay', true);

			this.bigImage = false;
			this.lyricObj = null;
			this.list = [];
			this.$ipcRenderer.send('searchReq', {
				artist: this.artist,
				title: this.title
			});
			///
			this.historySave(this.artist, this.title);
		},

		historySearch(att, tle) {
			this.$store.commit('changeOverlay', true);

			this.bigImage = false;
			this.lyricObj = null;
			this.list = [];
			this.$ipcRenderer.send('searchReq', {
				artist: att,
				title: tle
			});
		},

		historySave(att, tle) {
			this.$dbHistory.update(
				{ artist: att, title: tle },
				{ artist: att, title: tle, datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss') },
				{ upsert: true },
				(err, nb) => {
					if (err) console.warn(err);

					console.log(nb);
				}
			);
		},

		getLyric(url) {
			this.$store.commit('changeOverlay', true);
			this.$ipcRenderer.send('getLyric', { url });
		},

		listAdd() {
			// this.$dbAdmin.ensureIndex();
			this.$dbList.ensureIndex({ fieldName: 'uniqueKey', unique: true }, err => {
				if (err) console.warn(err);
			});

			this.$dbList.update(
				{ uniqueKey: this.lyricObj.obj.key },
				{
					$set: {
						// uniqueKey: this.lyricObj.key,
						artist: this.lyricObj.obj.artist,
						title: this.lyricObj.obj.title,
						lyricUrl: this.lyricObj.obj.url,
						datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
					}
				},
				{ upsert: true },
				(err, nb) => {
					if (err) console.warn(err);
					console.log(nb);
				}
			);

			// console.log(this.lyricObj);
			// this.$dbList.update(
			// 	{ artist: att, title: tle },
			// 	{ artist: att, title: tle,  ,datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss') },
			// 	{ upsert: true },
			// 	(err, nb) => {
			// 		if (err) console.warn(err);
			// 		console.log(nb);
			// 		// ADD TO LIST
			// 	}
			// );
		},

		expandWidth() {
			if (!this.isTwoColumn && !this.isThreeColumn) {
				this.$ipcRenderer.send('windowWidth', { width: 960, height: this.windowHeight });
				this.bigImage = false;
			} else this.$ipcRenderer.send('windowWidth', { width: 480, height: this.windowHeight });
		}
	}
};
</script>

<style lang="scss" scoped>
.ellipsis {
	width: calc(100% - 32px);
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
	opacity: 0.15;
	transform: translateY(50%);
}
</style>
