<template>
	<div v-show="SHOW">
		<v-app>
			<v-app-bar app flat height="32" color="blue-grey darken-4">
				<div class="window-drag header ml-n4" />
				<!--  -->
				<div class="" style="width:90px;">
					<v-slider ref="slider1" class="no-drag" value="100" hide-details />
				</div>
				<v-spacer />
				<!--  -->
				<v-btn min-width="24" width="36" text class="no-drag" small @click="windowMin">
					<v-icon x-small>far fa-window-minimize</v-icon>
				</v-btn>
				<!--  -->
				<v-btn
					v-if="!$root.windowIsMax"
					min-width="24"
					width="36"
					text
					class="no-drag"
					small
					@click="windowMax"
				>
					<v-icon x-small>far fa-window-maximize</v-icon>
				</v-btn>
				<v-btn v-else min-width="24" width="36" text class="no-drag" small @click="windowRestore">
					<v-icon x-small>far fa-window-restore</v-icon>
				</v-btn>
				<!--  -->
				<v-btn min-width="24" width="36" text class="no-drag mr-n4" small @click="windowHide">
					<v-icon small>fas fa-times</v-icon>
				</v-btn>
			</v-app-bar>

			<v-navigation-drawer app dark permanent mini-variant mini-variant-width="64" class="teal">
				<div class="window-drag left" />
				<!--  -->
				<v-list flat class="no-drag">
					<v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ attrs, on }">
							<v-list-item to="/" exact v-bind="attrs" v-on="on">
								<v-list-item-content>
									<v-icon small>fas fa-search</v-icon>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>検索</span>
					</v-tooltip>
					<!--  -->
					<v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ attrs, on }">
							<v-list-item to="/list" exact v-bind="attrs" v-on="on">
								<v-list-item-content>
									<v-icon small>fas fa-list</v-icon>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>リスト</span>
					</v-tooltip>

					<!-- <v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ attrs, on }">
							<v-list-item exact v-bind="attrs" v-on="on" @click="TestFunc">
								<v-list-item-content>
									<v-icon small>fas fa-random</v-icon>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>Test</span>
					</v-tooltip> -->
				</v-list>

				<template v-slot:append>
					<v-list flat class="no-drag">
						<v-tooltip right transition="scroll-x-transition" open-delay="300">
							<template v-slot:activator="{ attrs, on }">
								<v-list-item
									v-bind="attrs"
									v-on="on"
									@click="bottomSheet = !bottomSheet"
									v-show="$route.name != 'List'"
								>
									<v-badge
										:color="playerState[$store.getters.playState]"
										dot
										overlap
										style="width:100%;"
									>
										<v-list-item-content>
											<v-icon small>fas fa-music</v-icon>
										</v-list-item-content>
									</v-badge>
								</v-list-item>
							</template>
							<span>プレーヤー</span>
						</v-tooltip>
						<!-- </v-list> -->

						<v-menu rounded right min-width="150" v-model="menu">
							<template v-slot:activator="{ on: menu, attrs }">
								<!-- <v-list flat class="no-drag"> -->
								<v-tooltip right transition="scroll-x-transition" open-delay="300">
									<template v-slot:activator="{ on: tooltip }">
										<v-list-item v-bind="attrs" v-on="{ ...tooltip, ...menu }">
											<v-list-item-content>
												<v-icon small>fas fa-ellipsis-h</v-icon>
											</v-list-item-content>
										</v-list-item>
									</template>
									<span>設定</span>
								</v-tooltip>
							</template>
							<v-list dense class="no-drag">
								<v-menu
									open-on-hover
									top
									offset-x
									nudge-right="5"
									transition="slide-y-reverse-transition"
									close-delay="300"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-list-item v-bind="attrs" v-on="on" @click.stop :ripple="false">
											<v-list-item-content>
												<v-list-item-title>言語</v-list-item-title>
											</v-list-item-content>

											<v-list-item-icon class="mr-n4">
												<v-icon small right>fas fa-caret-right</v-icon>
											</v-list-item-icon>
										</v-list-item>
									</template>
									<v-list>
										<v-list-item-group v-model="language" color="grey" mandatory>
											<v-list-item
												v-for="(name, idx) in languages"
												:key="`lang${idx}`"
												:value="idx"
											>
												{{ name }}
											</v-list-item>
										</v-list-item-group>
										<!-- <v-list-item>
											{{ language }}
										</v-list-item> -->
									</v-list>
								</v-menu>

								<v-list-item @click="dialog = true">
									<v-list-item-content>
										<v-list-item-title>データをクリア</v-list-item-title>
									</v-list-item-content>
								</v-list-item>

								<v-list-item @click="appClose">
									<v-list-item-content>
										<v-list-item-title>終了</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-list>
				</template>
			</v-navigation-drawer>

			<!-- class="grey lighten-4" -->
			<v-main>
				<router-view />
			</v-main>

			<v-bottom-sheet v-model="bottomSheet" inset>
				<v-sheet class="text-center rounded-t-lg" color="blue-grey darken-3">
					<EmbedPlayer :sheet="bottomSheet" />
				</v-sheet>
			</v-bottom-sheet>

			<!-- <v-footer app inset color="success">
				<v-row no-gutters align="center">
					<v-spacer />
					<v-col cols="auto">
						&copy; 2020
					</v-col>
				</v-row>
			</v-footer> -->

			<!--  snackbar  -->
			<transition-group name="slideRight">
				<template v-for="(n, idx) in snackbars">
					<v-snackbar
						app
						:key="`snack${idx}`"
						v-if="n.show"
						v-model="n.show"
						right
						bottom
						absolute
						:color="n.color"
						:timeout="n.timeout"
						:style="{ top: `-${5 + (10 + 50) * (idx - barsHidden)}px` }"
					>
						{{ n.text }}
						<template v-slot:action="{ attrs }">
							<v-btn text v-bind="attrs" @click="n.show = false">閉じる</v-btn>
						</template>
					</v-snackbar>
				</template>
			</transition-group>

			<v-overlay v-model="overlay" opacity="0.3">
				<v-progress-circular indeterminate color="purple" />
			</v-overlay>

			<v-dialog v-model="dialog" max-width="200" persistent>
				<v-card>
					<v-card-title class="text-center">
						<span class="mx-auto subtitle-2 font-weight-bold">
							リストデータをクリア
						</span>
					</v-card-title>
					<v-card-actions class="px-4">
						<v-btn icon color="error darken-1" @click.stop="dialog = false">
							<v-icon>fas fa-times</v-icon>
						</v-btn>
						<v-spacer />
						<v-btn icon color="success darken-1" @click.stop="dataEmpty">
							<v-icon>
								fas fa-check
							</v-icon>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<div id="youtube-audio" class="d-none" />

			<!-- <v-overlay v-model="dialogOverlay" opacity="0.3">
				123
			</v-overlay> -->

			<!-- no used -->
			<div v-if="false" class="fixed-right-bottom text-right">
				<span>Resolution:</span>
				{{ $root.webWidth }} x {{ $root.webHeight }} &lt; = &gt; {{ $root.screenWidth }} x
				{{ $root.screenHeight }}
				<br />
				<span class="mt-2" v-text="'breakpoint:'" />
				{{ $vuetify.breakpoint.name }}
			</div>
		</v-app>
	</div>
</template>

<script lang="ts">
import Embed from '@/components/Embed.vue';

import { Component, Vue, Watch } from 'vue-property-decorator';
import { AppModule } from '@/store/modules/app';

@Component({
	components: {
		EmbedPlayer: Embed
	}
})
export default class App extends Vue {
	// $root!: {
	// 	webHeight: number;
	// };

	private SHOW = false;
	private dialog = false;
	private bottomSheet = false;

	private playerState: Readonly<{}> = Object.freeze({
		'-1': 'grey darken-2',
		0: 'lime',
		1: 'light-green',
		2: 'warning',
		3: 'pink',
		5: 'info'
	});

	private menu = false;
	private languages = Object.freeze({
		tw: '中文',
		en: 'English',
		jp: '日本語'
	});
	private language = 2;

	get contentHeight() {
		return `${this.$root.$data.webHeight - 38}px`;
	}

	get overlay() {
		return AppModule.overlay;
	}

	get snackbars() {
		return AppModule.snackbars;
	}

	get barsHidden(): number {
		return this.$store.getters.barsHidden;
	}

	@Watch('$store.getters.barsVisible')
	onBarsVisibleChange(value: number) {
		// if (value == 0) this.$store.state.snackbars = [];
		// if (value == 0) AppModule.snackbars = [];
		if (value == 0) AppModule.emptySnackbars();
	}
	@Watch('language')
	onLanguageChange(value: string) {
		this.$i18n.locale = value;
		this.menu = false;
	}

	// life cycle
	created() {
		this.$router.beforeEach((to, from, next) => {
			next();
		});
	}

	mounted() {
		this.SHOW = true;
		this.bottomSheet = false;

		console.log(this.$store.state);
	}

	// methods
	private windowMin() {
		this.$ipcRenderer.send('windowMin');
	}

	private windowMax() {
		this.$ipcRenderer.send('windowMax');
	}

	private windowRestore() {
		this.$ipcRenderer.send('windowRestore');
	}

	private windowHide() {
		this.$ipcRenderer.send('windowHide');
	}

	private appClose() {
		// window close // if all window closed, then app will close too
		this.$ipcRenderer.send('windowClose');
	}

	private dataEmpty() {
		// 清空 list
		// 清空 path directory

		this.$ipcRenderer
			.invoke('listRemove', { query: {} })
			.then(res => {
				console.log(res);
				if (res.ok > 0) {
					this.$ipcRenderer.invoke('emptyDir').then(res => {
						console.log(res);
					});
				}
			})
			.catch(err => {
				console.log(err);
				// this.$store.commit('snackbar', );
				AppModule.snackbar({ text: err, color: 'error' });
			})
			.finally(() => (this.dialog = false));
		/*
		this.$dbList.remove({}, { multi: true }, (err, nb) => {
			if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
			else {
				// const files = this.$fs.readdirSync(this.$picPath);

				// this.$ipcRenderer.invoke('removeFile', { files, }).then(res => {
				// 	console.log(res);
				// });
				this.$ipcRenderer
					.invoke('emptyDir', { dirPath: 'P:/Users/Administrator/Pictures/lyric_scrawer' })
					.then(res => {
						console.log(res);
					});

				// files.forEach(file => {
				// 	this.$fs.unlink(`${this.$picPath}\\${file}`, err => {
				// 		if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
				// 	});
				// });

				this.dialog = false;
			}

			console.log(err, nb);
		});
		*/
	}

	private TestFunc() {
		// this
		console.log(this.$i18n.locale);
		console.log(this.$i18n);
		if (this.$i18n.locale == 'en') this.$i18n.locale = 'tw';
		else if (this.$i18n.locale == 'tw') this.$i18n.locale = 'jp';
		else this.$i18n.locale = 'en';
	}
}
</script>

<style lang="scss" scoped>
.fixed-right-bottom {
	position: fixed;
	font-weight: bold;
	right: 20px;
	bottom: 0;
	opacity: 0.5;
}

.slideRight-enter-active,
.slideRight-leave-active {
	transition: all 0.5s;
}

.slideRight-enter {
	opacity: 0;
	transform: translateY(-30px);
}

.slideRight-leave-to {
	opacity: 0;
	transform: translateX(60px);
}
</style>
