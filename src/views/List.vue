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

							<v-list-item :key="item.uniqueKey" class="mr-3">
								<v-list-item-avatar>
									<v-img v-if="item.avatar != undefined" :src="item.avatar" />
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
									<!-- <span v-if="item"> {{ item.ytID || null }} {{ item.ytUrl || null }} </span> -->
									<v-tooltip left dark>
										<template v-slot:activator="{ attrs, on }">
											<v-btn icon @click="getLyric(item)" v-bind="attrs" v-on="on">
												<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
											</v-btn>
										</template>
										<span>
											<v-icon class="mr-2" :color="item.ytUrl ? 'success' : 'error'" size="20">
												fas fa-music
											</v-icon>
											<v-icon :color="item.imagePath ? 'success' : 'error'" size="20">
												fas fa-image
											</v-icon>
										</span>
									</v-tooltip>
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
						<!-- <v-card-actions> -->
						<!-- </v-card-actions> -->
					</v-card>
					<!-- <LyricDisplay :lyric="lyricObj" /> -->
				</template>
				<template v-else>
					<div class="d-flex align-center" style="height:100%">
						<v-card flat shaped width="100%">
							<v-card-subtitle class="text-center">
								<v-icon size="48">fas fa-spider</v-icon>
								<span class="mx-auto" style="position:absolute; bottom: 0;left:0; right:0">
									Lyrics Crawler
								</span>
							</v-card-subtitle>
						</v-card>
					</div>
				</template>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import display from '@/components/Display';
import player from '@/components/Embed.vue';

export default {
	components: {
		LyricDisplay: display,
		EmbedPlayer: player
	},

	data() {
		return {
			filterStr: '',

			list: [],
			lyricObj: null,
			videoID: null
		};
	},
	computed: {
		isTwoColumn() {
			return this.$root.webWidth >= 960;
		},

		filterList() {
			return this.$lodash.filter(this.list, o => {
				return o.title.toLowerCase().match(this.filterStr) || o.artist.toLowerCase().match(this.filterStr);
			});
		}
	},
	created() {
		// $on a new event if not exitst
		if (!this.$root._events.getLyricByID) this.$root.$on('getLyricByID', obj => (this.lyricObj = obj));
	},
	mounted() {
		this.$dbList
			.find({})
			.sort({ artist: 1, title: 1, datetime: -1 })
			.exec((err, doc) => {
				if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
				// console.log(doc);
				this.$store.commit(
					'setPlayList',
					this.$lodash.filter(doc, 'ytID').map(e => e.ytID)
				);

				const prom = [];
				doc.forEach(async ele => {
					if (ele.avatarPath) {
						const buf = this.$sharp(ele.avatarPath)
							.toBuffer()
							.then(data => {
								ele.avatar = `data:image/jpeg;base64,${data.toString('base64')}`;
							})
							.catch(err => {
								this.$store.commit('snackbar', { text: err, color: 'error' });
							});
						prom.push(buf);
					}
					// console.log(ele);
				});
				// wait all promise done
				Promise.all(prom).then(() => {
					this.list = doc;
					// this.list = this.$lodash.concat(doc, doc);
					// console.log(this.list);
				});

				// console.log(doc.length);
				// console.log(this.$lodash.map(doc, 'uniqueKey'));
			});

		this.lyricObj = this.$store.state.lyricObj;
	},

	beforeDestroy() {},

	methods: {
		expandWidth() {
			if (!this.isTwoColumn) this.$ipcRenderer.send('windowWidth', { width: 1600, height: this.windowHeight });
		},

		async getLyric(item) {
			this.$store.commit('changeOverlay', true);
			this.expandWidth();

			// 這邊判斷 player 是否存在
			// this.lyricObj = null;
			// this.$store.commit('destroyPlayer');
			// this.$store.commit('clearLyric');

			// this.$ipcRenderer.send('getLyric', { url: item.lyricUrl });
			const res = await this.$ipcRenderer.invoke('getLyric', { url: item.lyricUrl });

			this.$nextTick(() => {
				if (res.error) {
					this.$store.commit('snackbar', { text: res.error, color: 'error' });
				} else {
					this.$nextTick(() => {
						this.lyricObj = Object.freeze({
							key: res.lyricKey,
							url: res.url,
							title: res.mainTxt,
							artist: res.artist,
							lyric: res.lyricContent,
							image: item.imagePath || null,
							imageSize: item.imageSize || {}
						});
						this.videoID = item.ytID;
					});
				}
				this.$store.commit('changeOverlay', false);
			});
		},

		getLyricByID() {}
		// avatarLoad() {}
	}
};
</script>

<style lang="scss" scoped></style>
