<template>
	<div>
		<v-row no-gutters align="center" justify="center">
			<v-col cols="12" class="px-3">
				<v-radio-group v-model="searchType" row :mandatory="true" class="mt-0">
					<v-radio label="歌手名" value="artist" />
					<v-radio label="曲名" value="title" />
				</v-radio-group>
			</v-col>
			<v-col>
				<v-text-field
					v-model="text"
					dense
					outlined
					single-line
					:label="types[searchType]"
					prepend-inner-icon="fa-search"
					hide-details
					@keyup.enter="lyricSearch"
				/>
			</v-col>
			<v-col cols="auto" class="pl-3">
				<v-btn
					color="success"
					outlined
					height="40"
					@click="lyricSearch"
					:disabled="text == null || text.length == 0"
				>
					<span class="mr-2">SEND</span>
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
						v-for="n in 5"
						:key="n"
						small
						class="mx-2"
						color="light-blue lighten-2"
						style="cursor: pointer;"
					>
						{{ n }}
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
									<v-btn icon v-on="on">
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
						<v-card-text class="primary--text text--darken-2 font-weight-bold" v-html="lyricObj.lyric" />
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
			text: null,
			searchType: 'artist',
			types: Object.freeze({
				artist: '歌手名',
				title: '曲名'
			}),

			keywords: []
		};
	},
	computed: {
		// textFieldHeight() {
		// 	return this.$refs.btn.clientHeight;
		// }
	},

	created() {},
	mounted() {
		const included = this.$ipcRenderer.eventNames().includes('searchRes');
		console.log('included', included);
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
					console.log(args);
				});
				this.$store.commit('changeOverlay', false);
			});
		}
		//

		const included2 = this.$ipcRenderer.eventNames().includes('lyricRes');
		console.log('included', included2);
		if (!included2) {
			this.$ipcRenderer.on('lyricRes', (e, args) => {
				if (args.error) console.error(args.error);

				this.$nextTick(() => {
					this.lyricObj = Object.freeze({
						title: args.mainTxt,
						artist: args.artist,
						lyric: args.lyricContent
					});

					console.log(args);
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
			if (this.text == null || this.text.length == 0) return;
			this.$store.commit('changeOverlay', true);

			this.lyricObj = null;
			this.list = [];
			this.$ipcRenderer.send('searchReq', {
				type: this.searchType,
				text: this.text
			});
		},

		historySearch(type, text) {
			console.log(type, text);
		},

		getLyric(url) {
			this.$store.commit('changeOverlay', true);
			this.$ipcRenderer.send('getLyric', { url });
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
