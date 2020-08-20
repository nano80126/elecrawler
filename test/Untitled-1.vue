<script lang="ts">
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
			videoID: null,

			showMenu: false,
			attach: null,
			menuX: 0,
			menuY: 0
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
		// console.log(this.$root._events);
		// $on a new event if not exitst
		if (!this.$root._events.getLyricByID) this.$root.$on('getLyricByID', obj => (this.lyricObj = obj));
	},
	mounted() {
		this.$dbList
			.find({})
			.sort({ artist: 1, title: 1, datetime: -1 })
			.exec((err, doc) => {
				if (err) this.$store.commit('snackbar', { text: err, color: 'error' });

				console.log(doc);

				// commit save to list
				const filter = this.$lodash.filter(doc, 'ytObj').map(e => e.ytObj); // remove no youtube obj
				const flatten = this.$lodash.flatten(filter).map(e => e.id); // flatten all youtube id
				this.$store.commit('setPlayList', Object.freeze(flatten));

				// console.log(this.$store.state.playList);

				// console.log(doc);
				// const a = this.$lodash.filter(doc, 'ytObj').map(e => e.ytObj);
				// console.log(a);
				// console.log(this.$lodash.flatten(a).map(e => e.id));
				// console.log(this.$store.state.playList);

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
					// this.list = this.$lodash.concat(doc, doc);
					// console.log(this.list);
				});

				// console.log(doc.length);
				// console.log(this.$lodash.map(doc, 'uniqueKey'));
			});

		this.lyricObj = this.$store.state.lyricObj;
	},

	beforeDestroy() {
		this.$root.$off('getLyricByID');
	},

	methods: {
		expandWidth() {
			if (!this.isTwoColumn) this.$ipcRenderer.send('windowWidth', { width: 1600, height: this.windowHeight });
		},

		async getLyric(item, ytID) {
			this.$store.commit('changeOverlay', true);
			this.expandWidth();

			if (!ytID) this.$store.commit('destroyPlayer'); // id == null => destory player
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
						this.videoID = ytID;
					});
				}
				this.$store.commit('changeOverlay', false);
			});
		},

		removeFromList(key) {
			// 刪除資料庫
			this.$dbList.remove({ uniqueKey: key }, {}, err => {
				if (err) {
					this.$store.commit('snackbar', { text: err, color: 'error' });
					return;
				}

				// 刪除圖片
				const files = [`${this.$picPath}\\${key}.jpg`, `${this.$picPath}\\${key}_avatar.jpg`];
				files.forEach(file => {
					this.$fs.exists(file, exist => {
						if (exist) {
							this.$fs.unlink(file, err => {
								if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
							});
						}
					});
				});
				// 刪除列表
				const index = this.$lodash.findIndex(this.list, ['uniqueKey', key]);
				this.list.splice(index, 1);
			});
		},

		menuShowCmd() {
			// e.preventDefault();
			// console.log(e.target);
			// this.showMenu = false;
			// // this.attach = e.target;
			// this.menuX = e.target.offsetX - e.offsetX;
			// this.menuY = e.target.offsetY - e.offsetY;
			// this.$nextTick(() => {
			// 	this.showMenu = true;
			// });
		},

		getLyricByID() {}
		// avatarLoad() {}
	}
};
</script>
