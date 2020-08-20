<script lang="ts">

import player from '@/components/Embed.vue';

export default {
	name: 'App',

	components: {
		// HelloWorld
		// connect: connect
		EmbedPlayer: player
	},

	data: () => ({
		SHOW: false,

		dialog: false,

		bottomSheet: false,

		playerState: Object.freeze({
			'-1': 'grey darken-2',
			0: 'lime',
			1: 'light-green',
			2: 'warning',
			3: 'pink',
			5: 'info'
		}),

		menu: false,
		languages: Object.freeze({ tw: '中文', en: 'English', jp: '日本語' }),
		language: 2
	}),
	computed: {
		contentHeight() {
			return `${this.$root.webHeight - 38}px`;
		},

		barsHidden() {
			return this.$store.getters.barsHidden;
		}
	},
	watch: {
		// 若 snackbars 全部 timeout 則清空
		'$store.getters.barsVisible'(e) {
			if (e == 0) this.$store.state.snackbars = [];
		},
		language(e) {
			this.$i18n.locale = e;
			this.menu = false;
		}
	},
	created() {
		// console.log(this.$vuetify);

		this.$router.beforeEach((to, from, next) => {
			next();
		});

		// if not electron
		if (!this.$store.state.isElectron) {
			// this.wsInitCreate();
		}
	},
	mounted() {
		this.SHOW = true;
		this.bottomSheet = false;
	},
	methods: {
		windowMin() {
			this.$ipcRenderer.send('windowMin');
			// this.$remote.BrowserWindow.getFocusedWindow().minimize();
		},

		windowMax() {
			this.$ipcRenderer.send('windowMax');
			// this.$remote.BrowserWindow.getFocusedWindow().maximize();
		},

		windowRestore() {
			this.$ipcRenderer.send('windowRestore');
			// this.$remote.BrowserWindow.getFocusedWindow().restore();
		},

		windowHide() {
			this.$ipcRenderer.send('windowHide');
			// this.$remote.BrowserWindow.getFocusedWindow().hide();
		},

		appClose() {
			this.$ipcRenderer.send('windowClose');
		},

		dataEmpty() {
			this.$dbList.remove({}, { multi: true }, err => {
				if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
				else {
					const files = this.$fs.readdirSync(this.$picPath);

					files.forEach(file => {
						this.$fs.unlink(`${this.$picPath}\\${file}`, err => {
							if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
						});
					});

					this.dialog = false;
				}
			});
		},

		TestFunc() {
			// this
			console.log(this.$i18n.locale);
			console.log(this.$i18n);
			if (this.$i18n.locale == 'en') this.$i18n.locale = 'tw';
			else if (this.$i18n.locale == 'tw') this.$i18n.locale = 'jp';
			else this.$i18n.locale = 'en';
		}
	}
};

</script>