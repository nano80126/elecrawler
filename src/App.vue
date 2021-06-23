<template>
	<div v-show="SHOW">
		<v-app>
			<v-app-bar app flat :height="appbarHeight" color="blue-grey darken-4">
				<div class="window-drag header ml-n4" />
				<!--  -->
				<div class="" style="width: 90px">
					<!-- slider no used now -->
					<v-slider
						ref="slider1"
						class="no-drag no-hover"
						min="0"
						max="100"
						step="1"
						value="100"
						hide-details
					/>
				</div>
				<!-- <span class="ml-3">{{ $t('message') }}</span> -->
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

			<!-- brown darken-2 -->
			<v-navigation-drawer app dark permanent mini-variant :mini-variant-width="navigationWidth" class="">
				<v-img
					class="nav-back"
					position="left 55% center"
					transition="fade-transition"
					:src="navImg"
					style="opacity: 0.6"
				/>
				<!-- :src="require('@/assets/nav3.jpg')" -->
				<div class="window-drag left" style="opacity: 0.5" />
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
						<span>
							<!-- 検索 -->
							{{ $t('search') }}
						</span>
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
						<span>
							<!-- リスト -->
							{{ $t('list') }}
						</span>
					</v-tooltip>

					<!-- <v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ attrs, on }">
							<v-list-item exact v-bind="attrs" v-on="on" @click="TestFunc">
								<v-list-item-content>
									<v-icon small>fas fa-random</v-icon>
									{{ menu }}
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
										style="width: 100%"
									>
										<v-list-item-content>
											<v-icon small>fas fa-music</v-icon>
										</v-list-item-content>
									</v-badge>
								</v-list-item>
							</template>
							<span>
								<!-- プレーヤー -->
								{{ $t('player') }}
							</span>
						</v-tooltip>
						<!-- </v-list> -->

						<v-menu rounded right min-width="150" v-model="menu" close-on-click>
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
									<span>
										<!-- 設定 -->
										{{ $t('settings') }}
									</span>
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
												<v-list-item-title>
													<!-- 言語 -->
													{{ $t('language') }}
												</v-list-item-title>
											</v-list-item-content>

											<v-list-item-icon class="mr-n4">
												<v-icon small right>fas fa-caret-right</v-icon>
											</v-list-item-icon>
										</v-list-item>
									</template>
									<v-list>
										<v-list-item-group v-model="$i18n.locale" color="grey">
											<v-list-item
												v-for="(name, idx) in languages"
												:key="`lang${idx}`"
												:value="idx"
											>
												{{ name }}
											</v-list-item>
										</v-list-item-group>
									</v-list>
								</v-menu>

								<v-divider class="grey darken-2" />
								<v-list-item @click="openPicDir">
									<v-list-item-content>
										<v-list-item-title>
											<!-- 画像ディレクトリ -->
											{{ $t('imageDir') }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>

								<v-list-item @click="dialog = true">
									<v-list-item-content>
										<v-list-item-title>
											<!-- データをクリア -->
											{{ $t('clearData') }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>

								<v-list-item @click="appClose">
									<v-list-item-content>
										<v-list-item-title>
											<!-- 終了 -->
											{{ $t('exit') }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-list>
				</template>
			</v-navigation-drawer>

			<!-- class="grey lighten-4" -->
			<v-main>
				<v-overlay v-model="overlay" opacity="0.48" absolute>
					<v-progress-circular indeterminate color="lime lighten-1" />
				</v-overlay>
				<!-- routes -->
				<router-view />
			</v-main>

			<v-footer app inset padless :height="footerHeight">
				<v-col class="py-0 text-right">
					&copy; {{ new Date().getFullYear() }} <strong>EleCrawler</strong>
				</v-col>
			</v-footer>

			<v-bottom-sheet v-model="bottomSheet" inset>
				<v-sheet class="text-center rounded-t-lg" color="blue-grey darken-3">
					<EmbedPlayer :sheet="bottomSheet" />
				</v-sheet>
			</v-bottom-sheet>

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
						:color="n.color"
						:timeout="n.timeout"
						:style="{ top: `-${5 + (10 + 50) * (idx - barsHidden)}px` }"
					>
						{{ n.text }}
						<template v-slot:action="{ attrs }">
							<v-btn text v-bind="attrs" @click="n.show = false">{{ $t('close') }}</v-btn>
						</template>
					</v-snackbar>
				</template>
			</transition-group>

			<!-- <v-overlay v-model="overlay" opacity="0.3">
				<v-progress-circular indeterminate color="purple" />
			</v-overlay> -->

			<v-dialog v-model="dialog" max-width="200" persistent>
				<v-card>
					<v-card-title class="text-center">
						<span class="mx-auto subtitle-2 font-weight-bold"> リストデータをクリア </span>
					</v-card-title>
					<v-card-actions class="px-4">
						<v-btn icon color="error darken-1" @click.stop="dialog = false">
							<v-icon>fas fa-times</v-icon>
						</v-btn>
						<v-spacer />
						<v-btn icon color="success darken-1" @click.stop="dataEmpty">
							<v-icon> fas fa-check </v-icon>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<!-- style="position:absolute; top: 20%; left: 20%;" -->
			<div id="youtube-audio" class="d-none" />

			<!-- <v-overlay v-model="dialogOverlay" opacity="0.3">
				123
			</v-overlay> -->

			<!-- no used -->
			<div v-if="isDev" class="fixed-right-bottom subtitle-2">
				<!-- <span class="mr-2">Electron: {{ isElectron }}</span> -->
				<span class="mr-2">resolution: {{ $root.webWidth }} x {{ $root.webHeight }}</span>
				<span class="mr-2">breakpoint: {{ $vuetify.breakpoint.name }}</span>
			</div>
		</v-app>
	</div>
</template>

<script lang="ts">
import Embed from '@/components/List/Embed.vue';

import { Component, Vue, Watch } from 'vue-property-decorator';
import { AppModule, Colors, Isnackbar } from '@/store/modules/app';
import { EfsOn, EwindowOn } from './types/enum';

// import nav from '@/assets/nav3.jpg';

// import Woker from '@/worker';
// import Worker from 'http://localhost:4000/123';

// const blob = new Blob(['importScripts("http://localhost:4000")'], {});

@Component({
	components: {
		EmbedPlayer: Embed,
	},
})
export default class App extends Vue {
	// $root!: {
	// 	webHeight: number;
	// };
	private appbarHeight = 32;
	private navigationWidth = 64;
	private footerHeight = 24;

	/**image of nav */
	private navImg = require('@/assets/nav3.jpg');
	/**Show after mounted */
	private SHOW = false;
	/**Dialog for clear data */
	private dialog = false;
	/**Toggle player show / hide */
	private bottomSheet = false;

	/**Showing player state color of badge */
	private playerState = Object.freeze({
		'-1': 'grey darken-2',
		0: 'lime',
		1: 'light-green darken-1',
		2: 'warning',
		3: 'pink',
		5: 'info',
	});

	/**Toggle menu show / hide, hide after language changed */
	private menu = false;
	/**Language selectable options */
	private languages = Object.freeze({
		tw: '中文',
		en: 'English',
		jp: '日本語',
	});
	/**當前使用語言 (待刪)*/
	// private language = this.$i18n.locale;

	/**deprecated */
	// get contentHeight(): string {
	// 	return `${this.$root.$data.webHeight - 38}px`;
	// }

	get isDev(): boolean {
		return AppModule.isDev;
	}

	get overlay(): boolean {
		return AppModule.overlay;
	}

	get snackbars(): Isnackbar[] {
		return AppModule.snackbars;
	}

	get barsHidden(): number {
		return AppModule.barsHidden;
	}

	@Watch('$store.getters.barsVisible')
	onBarsVisibleChange(value: number): void {
		if (value == 0) AppModule.emptySnackbars();
	}

	/**Watch Locale */
	@Watch('$i18n.locale')
	onLanguageChange(value: string): void {
		// this.$i18n.locale = value;
		this.menu = false; // 關閉 menu
		this.$ipcRenderer.send('syncLanguage', { locale: value }); // 同步所有視窗
	}

	// life cycle
	created(): void {
		this.$router.beforeEach((to, from, next) => {
			next();
		});

		// AppModule.changeOverlay(true);
	}

	mounted(): void {
		this.SHOW = true;
		this.bottomSheet = false;

		// this.$root.$on('localeChange', (locale: string) => {
		// 	this.language = locale;
		// });
		// const worker = new Worker('@/worker/index.js', { type: 'module' });
		// worker.addEventListener('message', msg => {
		// 	console.log(msg);
		// });
		// worker.postMessage('123');
		// Woker.runWorker().then(res => {
		// 	console.info(res);
		// });
	}

	// methods
	private windowMin() {
		this.$ipcRenderer.send(EwindowOn.WINDOWMIN);
	}

	private windowMax() {
		this.$ipcRenderer.send(EwindowOn.WINDOWMAX);
	}

	private windowRestore() {
		this.$ipcRenderer.send(EwindowOn.WINDOWRESTORE);
	}

	private windowHide() {
		this.$ipcRenderer.send(EwindowOn.WINDOWHIDE);
	}

	private appClose() {
		// window close // if all window closed, then app will close too
		this.$ipcRenderer.send(EwindowOn.WINDOWCLOSE);
	}

	private openPicDir() {
		this.$shell.openPath(AppModule.picPath);
	}

	private dataEmpty() {
		// 清空 list
		// 清空 path directory
		this.$ipcRenderer
			.invoke('listRemove', { query: {} })
			.then((res) => {
				if (res.ok > 0) {
					this.$ipcRenderer.invoke(EfsOn.EMPTYDIR).then((res) => {
						if (res) {
							AppModule.snackbar({ text: this.$t('clearDone') as string, color: Colors.Success });
						}
					});
				}
			})
			.catch((err: Error) => {
				// this.$store.commit('snackbar', );
				AppModule.snackbar({ text: err.message, color: Colors.Error });
			})
			.finally(() => (this.dialog = false));
	}

	private TestFunc() {
		AppModule.snackbar({ text: 'test' });
	}
}
</script>

<style lang="scss" scoped>
.nav-back {
	position: absolute;
	height: 100%;
}

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

<style lang="scss">
.no-hover > .v-input__control > .v-input__slot > .v-slider > .v-slider__thumb-container > .v-slider__thumb {
	cursor: pointer;

	&::before {
		content: '';
		width: 0;
		height: 0;
	}
}
</style>
