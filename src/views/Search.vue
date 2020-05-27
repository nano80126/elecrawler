<template>
	<div>
		<v-row no-gutters align="center" justify="center">
			<v-col>
				<v-text-field
					v-model="artist"
					outlined
					dense
					hide-details
					label="歌手名"
					class="mr-3"
					color="success"
					@keyup.enter="lyricSearch"
				>
					<template v-slot:prepend-inner>
						<v-icon small class="mt-1">fas fa-microphone-alt</v-icon>
					</template>
				</v-text-field>
			</v-col>

			<v-col>
				<v-text-field
					v-model="title"
					outlined
					dense
					hide-details
					label="曲名"
					class="mr-3"
					color="success"
					@keyup.enter="lyricSearch"
				>
					<template v-slot:prepend-inner>
						<v-icon small class="mt-1">fas fa-music</v-icon>
					</template>
				</v-text-field>
			</v-col>

			<v-col cols="auto">
				<v-btn color="success" outlined height="40" @click="lyricSearch" :disabled="!canSearch">
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
						class="mx-2"
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
						title: args.mainTxt,
						artist: args.artist,
						lyric: args.lyricContent
					});
				});

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
			console.log(this.lyricObj);
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
