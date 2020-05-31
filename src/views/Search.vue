<template>
	<div>
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
				<v-btn text color="success" height="40" @click="lyricSearch" :disabled="!canSearch">
					<span class="mr-2">検索</span>
					<v-icon small>fas fa-leaf</v-icon>
				</v-btn>
			</v-col>

			<template v-if="keywords.length > 0">
				<div class="my-1" style="width:100%;" />
				<v-col cols="auto">
					<v-chip label small color="orange lighten-1">
						<v-icon x-small color="white">fas fa-star</v-icon>
						<span class="ml-1 white--text">キーワード</span>
					</v-chip>
				</v-col>
				<v-col cols class="px-3">
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

			<transition name="lyricSlide">
				<v-col v-if="lyricObj" cols="12">
					<v-card class="mx-auto mt-3" outlined>
						<v-card-title>
							<span class="ellipsis" v-text="lyricObj.title" style="max-width: 500px" />
							<v-spacer />
							<v-tooltip left>
								<template v-slot:activator="{ on }">
									<v-btn icon v-on="on" @click="listAdd">
										<v-icon>fas fa-plus</v-icon>
									</v-btn>
								</template>
								<span>リストに追加</span>
							</v-tooltip>
						</v-card-title>
						<v-card-subtitle>
							<span v-text="lyricObj.artist" />
						</v-card-subtitle>
						<v-divider />

						<!-- <v-card-text>
							{{ lyricObj }}
						</v-card-text> -->

						<v-card-text
							class="primary--text text--darken-2 font-weight-bold"
							v-html="lyricObj.lyric || '<span>歌詞が存在しない。</span>'"
						/>
					</v-card>
				</v-col>
			</transition>

			<v-col cols="12">
				<transition-group name="cardList">
					<v-card v-for="item in list" :key="item.obj.id" class="mx-auto mt-3" outlined>
						<v-card-title>
							<span class="ellipsis">
								{{ item.obj.title }}
							</span>
						</v-card-title>
						<v-card-subtitle>{{ item.obj.artist }}</v-card-subtitle>

						<v-divider />
						<v-card-actions>
							<v-btn text color="info" @click="getLyric(item.obj.href)">
								<v-icon>fas fa-link</v-icon>
								<span class="ml-2 font-weight-bold">リンク</span>
							</v-btn>

							<v-spacer />
							<v-btn icon @click="item.expanded = !item.expanded">
								<v-icon>
									{{ item.expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down' }}
								</v-icon>
							</v-btn>
						</v-card-actions>
						<v-expand-transition>
							<div v-show="item.expanded">
								<v-divider />
								<v-card-text>{{ item.obj.lyric }}</v-card-text>
							</div>
						</v-expand-transition>
					</v-card>
				</transition-group>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			lyricObj: null,
			//
			list: [],
			//
			artist: null,
			title: null,
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
		}
		// textFieldHeight() {
		// 	return this.$refs.btn.clientHeight;
		// }
	},

	created() {
		this.$dbHistory
			.find({})
			.sort({ datetime: -1 })
			.limit(5)
			.exec((err, doc) => {
				if (err) console.warn(err);
				this.keywords = doc;

				if (process.env.NODE_ENV == 'development') console.log(doc);
			});

		this.$dbList.find({}, (err, doc) => {
			if (err) console.warn(err);
			console.log(doc);
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
							this.list.push({
								obj: Object.freeze(obj),
								expanded: false
							});
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
					this.lyricObj = Object.freeze({
						key: args.lyricKey,
						url: args.url,
						title: args.mainTxt,
						artist: args.artist,
						lyric: args.lyricContent
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
				{ uniqueKey: this.lyricObj.key },
				{
					$set: {
						// uniqueKey: this.lyricObj.key,
						artist: this.lyricObj.artist,
						title: this.lyricObj.title,
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
		}
	}
};
</script>

<style lang="scss" scoped>
.ellipsis {
	overflow: hidden;
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

.lyricSlide-enter-active,
.lyricSlide-leave-active {
	transition: all 0.5s;
}

.lyricSlide-enter {
	opacity: 0.15;
	transform-origin: 50% 0;
	transform: scale(0, 0);
}

.lyricSlide-leave-to {
	opacity: 0;
	transform: translateX(-75%);
}
</style>
