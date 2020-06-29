<template>
	<div>
		<v-row no-gutters align="stretch" justify="center">
			<v-col
				cols
				class="pl-3"
				:style="{ 'min-height': `${$root.webHeight - 44}px`, 'max-width': isTwoColumn ? '416px' : null }"
			>
				<v-toolbar flat color="cyan lighten-2" height="40" class="mb-2">
					<!-- <v-toolbar-title> </v-toolbar-title> -->

					<v-text-field filled rounded dense hide-details placeholder="search">
						<template v-slot:prepend-inner>
							<v-icon small class="mt-1 mr-1">fas fa-search</v-icon>
						</template>
					</v-text-field>
				</v-toolbar>

				<v-list two-line subheader>
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
						:height="$root.webHeight - 136"
						item-height="72"
						class="min-scroll y"
					>
						<template v-slot="{ item }">
							<v-list-item :key="item.uniqueKey">
								<v-list-item-avatar>
									<v-img v-if="item.avatar" :src="item.avatar" @load="avatarLoad" />
									<v-icon v-else style="transform: rotate(135deg);">fas fa-tag</v-icon>
									<!-- {{ toBase64(item.avatarPath).length }} -->
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
									<v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
									<!-- {{ item.avatar == null }} -->
								</v-list-item-content>
								<v-list-item-action>
									<v-btn icon @click="getLyric(item)">
										<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-list-item>
						</template>
					</v-virtual-scroll>

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
	created() {
		this.$dbList.find({}, (err, doc) => {
			if (err) this.$store.commit('snackbar', { text: err, color: 'error' });

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
			});
		});
	},
	mounted() {
		const events = this.$ipcRenderer.eventNames();
		if (!events.includes('lyricRes')) {
			this.$ipcRenderer.on('lyricRes', (e, args) => {
				if (args.error) this.$store.commit('snackbar', { text: args.error, color: 'error' });

				this.$nextTick(() => {
					this.lyricObj = Object.freeze({
						key: args.lyricKey,
						url: args.url,
						title: args.mainTxt,
						artist: args.artist,
						lyric: args.lyricContent
					});

					// this.$dbList.count({ uniqueKey: args.lyricKey }, (err, count) => {
					// 	if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
					// 	//
					// 	this.lyricObj = {
					// 		obj: Object.freeze({
					// 			key: args.lyricKey,
					// 			url: args.url,
					// 			title: args.mainTxt,
					// 			artist: args.artist,
					// 			lyric: args.lyricContent
					// 		}),
					// 		exist: count > 0
					// 	};

					// 	console.log(this.lyricObj);
					// });
				});
				this.$store.commit('changeOverlay', false);
			});
		}
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

		getLyric(item) {
			// this.$store.commit('changeOverlay', true);
			this.expandWidth();

			this.$ipcRenderer.send('getLyric', { url: item.lyricUrl });
		},

		avatarLoad() {}
	}
};
</script>

<style lang="scss" scoped></style>
