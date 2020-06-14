<template>
	<div v-show="SHOW">
		<v-app>
			<v-app-bar app flat height="32" color="grey lighten-4">
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

			<v-navigation-drawer app dark permanent mini-variant mini-variant-width="64" class="success darken-4">
				<div class="window-drag left" />
				<!--  -->
				<v-list flat class="no-drag">
					<v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ on }">
							<v-list-item to="/" exact v-on="on" class="px-auto">
								<v-list-item-content>
									<v-icon small>fas fa-search</v-icon>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>検索</span>
					</v-tooltip>
					<!--  -->
					<v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ on }">
							<v-list-item to="/list" exact v-on="on">
								<v-list-item-content>
									<v-icon small>fas fa-list</v-icon>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>リスト</span>
					</v-tooltip>

					<v-tooltip right transition="scroll-x-transition" open-delay="300">
						<template v-slot:activator="{ on }">
							<v-list-item to="/dev" exact v-on="on">
								<v-list-item-content>
									<v-icon small>fas fa-code</v-icon>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>テスト</span>
					</v-tooltip>
				</v-list>
			</v-navigation-drawer>

			<!-- <v-toolbar v-if="false" dense color="success darken-3" dark height="36">
				<v-toolbar-title class="mr-10 window-drag">
					<span>{{ Title }}</span>
				</v-toolbar-title>

				<v-btn text to="/" active-class="font-weight--black" style="z-index:1;">
					<v-icon small>fas fa-search</v-icon>
					<span class="ml-2">検索</span>
				</v-btn>

				<v-btn text to="/list" active-class="font-weight--black">
					<v-icon small>fas fa-list</v-icon>
					<span class="ml-2">リスト</span>
				</v-btn>
			</v-toolbar> -->

			<!-- <v-content class="grey lighten-3"> -->
			<v-main class="grey lighten-4">
				<div ref="scrollPage">
					<!-- class="min-scroll primary-scroll" -->
					<!-- :style="{ height: contentHeight }" -->
					<!-- style="overflow-x:hidden; overflow-y:auto;" -->
					<!-- style="overflow-x:hidden; overflow-y:auto;" -->
					<router-view />
				</div>
			</v-main>

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
				<template v-for="(n, idx) in $store.state.snackbars">
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

			<v-overlay v-model="$store.state.overlay" opacity="0.3">
				<v-progress-circular indeterminate color="purple" />
			</v-overlay>

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
<script>
export default {
	name: 'App',

	components: {
		// HelloWorld
		// connect: connect
	},

	data: () => ({
		SHOW: false

		// bottomNav: null,
		// drawer: true,
		// miniVariant: true,
		//
		// Title: process.env.IS_ELECTRON ? '伺服端' : '客戶端',
		// Title: '歌詞検索'
		// ActivePage: 'SubTitle',
		//
		// webWidth: window.innerWidth,
		// webHeight: window.innerHeight,
		// screenWidth: window.screen.width,
		// screenHeight: window.screen.height
		//
	}),
	computed: {
		contentHeight() {
			return `${this.$root.webHeight - 38}px`;
		},

		barsHidden() {
			return this.$store.getters.barsHidden;
		}

		// windowState() {
		// 	// return this.$remote.BrowserWindow.getFocusedWindow().isMaximized();
		// }
	},
	watch: {
		// 若 snackbars 全部 timeout 則清空
		'$store.getters.barsVisible'(e) {
			if (e == 0) this.$store.state.snackbars = [];
		}
	},
	created() {
		// console.log(this.$vuetify);
		if (process.env.NODE_ENV == 'development') console.log('env', process.env);
		// ////

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

		// window.onresize = () => {
		// 	this.webWidth = window.innerWidth;
		// 	this.webHeight = window.innerHeight;

		// 	this.windowIsMax = this.$remote.BrowserWindow.getFocusedWindow().isMaximized();
		// 	// console.log(this.$vuetify.breakpoint);
		// };

		// this.$dbAdmin.remove({}, { multi: true }, (err, doc) => {
		// 	if (err) console.warn('err', err);
		// 	console.log(doc);
		// });

		// // this.$dbAdmin.ensureIndex();
		// this.$dbAdmin.ensureIndex({ fieldName: 'user', unique: true }, err => {
		// 	if (err) console.warn(err);
		// });

		// this.$dbAdmin.insert(
		// 	{ user: 'keliduan', pass: 1234, create: this.$moment().format('YYYY-MM-DD HH:mm:ss') },
		// 	(err, doc) => {
		// 		if (err) console.warn(err);
		// 		console.log(doc);
		// 	}
		// );

		// this.$dbAdmin.insert({ a: 1 }, (err, doc) => {
		// 	console.log(err, doc);
		// });

		// if (process.env.IS_ELECTRON) {
		// 	this.$dbAdmin.find({}, (err, doc) => {
		// 		if (err) console.log(err);
		// 		console.log(doc);
		// 	});
		// }
	},
	methods: {
		windowMin() {
			this.$remote.BrowserWindow.getFocusedWindow().minimize();
		},

		windowMax() {
			// this.windowIsMax = true;
			this.$remote.BrowserWindow.getFocusedWindow().maximize();
		},

		windowRestore() {
			// this.windowIsMax = false;
			this.$remote.BrowserWindow.getFocusedWindow().restore();
		},

		windowHide() {
			this.$remote.BrowserWindow.getFocusedWindow().hide();
		}
	}
};
</script>

<style lang="scss" scoped>
// .sizer {
// 	position: fixed;
// 	width: 100%;
// 	height: 100%;
// 	opacity: 0.3;
// 	z-index: 9999;

// 	> div {
// 		-webkit-app-region: no-drag;
// 		position: fixed;
// 		background: red;
// 		z-index: 9999;
// 	}

// 	> .top {
// 		top: 0;
// 		width: 100%;
// 		height: 4px;
// 	}
// 	> .left {
// 		left: 0;
// 		width: 4px;
// 		height: 100%;
// 	}
// 	> .right {
// 		right: 0;
// 		width: 4px;
// 		height: 100%;
// 	}
// 	> .bottom {
// 		bottom: 0;
// 		width: 100%;
// 		height: 4px;
// 	}
// }

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

// .navbar {
// 	padding: 0;
// 	.navbar-brand {
// 		min-width: 16.666667%;
// 		padding: 0 0 0 1.5rem;
// 		color: white;
// 		text-shadow: 1px 1px 2px darkred, -1px -1px 2px lightpink;
// 		font-size: 1.5rem;

// 		//只有字體大小
// 		@media all and (max-width: 1680px) {
// 			font-size: 1.7142rem;
// 		}
// 		@media all and (max-width: 1440px) {
// 			font-size: 2rem;
// 		}
// 		@media all and (max-width: 1200px) {
// 			font-size: 2.4rem;
// 		}
// 		@media all and (max-width: 960px) {
// 			font-size: 3rem;
// 		}
// 		@media all and (max-width: 720px) {
// 			font-size: 4rem;
// 		}
// 		small {
// 			margin-left: 1rem;
// 		}
// 	}
// 	.navbar-collapse {
// 		.navbar-nav {
// 			display: flex;
// 			align-items: center;
// 			justify-content: flex-end;
// 			li {
// 				position: relative;
// 				flex-basis: 0;
// 				flex-grow: 1;
// 				max-width: 100%;
// 				white-space: nowrap;
// 				padding: 0 0.75rem;
// 			}
// 			.link-items {
// 				min-width: 60%;
// 				@media all and (max-width: 1600px) {
// 					min-width: 73.333%;
// 				}
// 				@media all and (max-width: 1280px) {
// 					min-width: 80%;
// 				}
// 				li {
// 					@media all and (min-width: 1200px) {
// 						&:not(:last-child)::before {
// 							content: '';
// 							position: absolute;
// 							width: 2px;
// 							height: 60%;
// 							right: 0;
// 							top: 20%;
// 							background-color: rgba($color: whitesmoke, $alpha: 0.36);
// 							font-size: 1.25rem;
// 							padding: 0.25rem 0;
// 						}
// 					}
// 				}
// 			}
// 			.right-items {
// 				min-width: 16.666667%;
// 				li {
// 					flex: 0 1 25%;
// 				}
// 				@media all and (max-width: 1199px) {
// 					flex-direction: row;
// 					width: 100%;
// 					border-width: 2px 0 0 0;
// 					border-style: outset;
// 					border-color: rgba($color: #000, $alpha: 0.36);

// 					li {
// 						flex: 0 1 16.666667%;
// 					}
// 				}
// 				@media all and (max-width: 960px) {
// 					li {
// 						flex: 0 1 33.333333%;
// 					}
// 				}
// 			}
// 			a {
// 				padding: 0.25rem;
// 				font-size: 1.25rem;

// 				@media all and (max-width: 1680px) {
// 					font-size: 1.428rem; //字太小傷眼
// 				}

// 				@media all and (max-width: 1440px) {
// 					font-size: 1.667rem; //字太小傷眼
// 				}

// 				@media all and (max-width: 1200px) {
// 					font-size: 2rem; //字太小傷眼
// 				}

// 				@media all and (max-width: 960px) {
// 					font-size: 2rem;
// 				}

// 				@media all and (max-width: 720px) {
// 					font-size: 2.667rem;
// 				}

// 				color: whitesmoke;
// 				text-decoration: none;
// 			}
// 		}
// 	}
// }
// .toolbar-title {
// 	text-shadow: 1px 1px 2px darkred, -1px -1px 2px lightpink;
// 	font-size: 1.5rem;
// }
</style>
