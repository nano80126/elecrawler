<template>
	<div>
		<v-row no-gutters align="stretch" justify="center">
			<v-col
				cols
				class="pl-3"
				:style="{ 'min-height': `${$root.webHeight - 44}px`, 'max-width': isTwoColumn ? '416px' : null }"
			>
				<v-toolbar flat color="grey lighten-2" height="40" class="mb-2 mr-3 rounded-lg">
					<!-- <v-toolbar-title> </v-toolbar-title> -->

					<!-- <v-toolbar-title> -->
					<v-text-field rounded dense hide-details placeholder="search">
						<template v-slot:prepend-inner>
							<v-icon small class="ml-n2 mr-1" style="margin-top: 6px;">fas fa-search</v-icon>
						</template>
					</v-text-field>
					<!-- </v-toolbar-title> -->
					<!-- <v-spacer />
					<v-btn icon small>
						<v-icon small>fas fa-search</v-icon>
					</v-btn> -->
				</v-toolbar>

				<v-list two-line subheader class="transparent">
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
						:items="list"
						:height="$root.webHeight - 96"
						item-height="72"
						class="min-scroll y"
					>
						<template v-slot="{ item }">
							<v-list-item :key="item.uniqueKey" class="white mr-3">
								<v-list-item-avatar>
									<v-img v-if="item.avatar != undefined" :src="item.avatar" @load="avatarLoad" />
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
									<v-btn icon @click="getLyric(item)">
										<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-list-item>
						</template>
					</v-virtual-scroll>

					<!-- <v-list-item>
						<v-list-item-content>
							{{ lyricObj }}
						</v-list-item-content>
					</v-list-item> -->

					<!-- <v-subheader inset>sub header</v-subheader>
					<v-divider inset />

					<v-list-item v-for="item in list" :key="item.uniqueKey">
						<v-list-item-avatar>
							<v-icon>far fa-user-circle</v-icon>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title>{{ item.title }}</v-list-item-title>
							<v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn icon>
								<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item> -->
				</v-list>
			</v-col>

			<v-col v-if="isTwoColumn" cols class="px-3" style="border-left:1px solid rgba(150, 150, 150, 0.5);">
				<LyricDisplay :lyric="lyricObj" />
			</v-col>
		</v-row>
	</div>
</template>

<script>
import display from '@/components/Display';

export default {
	components: {
		LyricDisplay: display
	},

	data() {
		return {
			list: [],
			lyricObj: null
			// image: null
		};
	},
	computed: {
		isTwoColumn() {
			return this.$root.webWidth >= 960;
		}

		// isLargeWindow() {
		// 	return this.$root.webWidth >= 1440;
		// }
	},
	created() {},
	mounted() {
		// const events = this.$ipcRenderer.eventNames();
		// if (!events.includes('lyricRes')) {
		// 	this.$ipcRenderer.on('lyricRes', (e, args) => {
		// 		if (args.error) this.$store.commit('snackbar', { text: args.error, color: 'error' });

		// 		this.$nextTick(() => {
		// 			this.lyricObj = Object.freeze({
		// 				key: args.lyricKey,
		// 				url: args.url,
		// 				title: args.mainTxt,
		// 				artist: args.artist,
		// 				lyric: args.lyricContent
		// 			});
		// 		});
		// 		this.$store.commit('changeOverlay', false);
		// 	});
		// }

		this.$dbList.find({}, (err, doc) => {
			if (err) this.$store.commit('snackbar', { text: err, color: 'error' });

			console.log(doc);
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
			});
			// wait all promise done
			Promise.all(prom).then(() => {
				this.list = doc;
				console.log(this.list);
			});
		});
	},

	beforeDestroy() {
		this.$ipcRenderer.removeAllListeners('lyricRes');
	},

	methods: {
		expandWidth() {
			if (!this.isTwoColumn) this.$ipcRenderer.send('windowWidth', { width: 1440, height: this.windowHeight });
			// this.bigImage = false;
			// else this.$ipcRenderer.send('windowWidth', { width: 480, height: this.windowHeight });
		},

		async getLyric(item) {
			this.$store.commit('changeOverlay', true);
			this.expandWidth();

			// this.$ipcRenderer.send('getLyric', { url: item.lyricUrl });
			const res = await this.$ipcRenderer.invoke('getLyric', { url: item.lyricUrl });
			console.log(res);

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
				});
			}
			this.$store.commit('changeOverlay', false);
		},

		avatarLoad() {}
	}
};
</script>

<style lang="scss" scoped></style>
