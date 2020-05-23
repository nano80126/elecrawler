<template>
	<div v-show="SHOW">
		<v-app>
			<v-app-bar app color="success darken-3" dark height="38">
				<!-- <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer">
				<v-icon small>fas fa-bars</v-icon>
				</v-app-bar-nav-icon> -->

				<v-toolbar-title class="mr-10">
					<span>{{ Title }}</span>
					<!-- <small class="ml-4">{{ ActivePage }}</small> -->
				</v-toolbar-title>

				<v-btn text to="/" active-class="font-weight--black">
					<v-icon small>fas fa-search</v-icon>
					<!-- <span class="ml-2">検索</span> -->
				</v-btn>

				<v-btn v-if="$store.state.isElectron" text to="/connect" active-class="font-weight--black">
					<v-icon small>fas fa-list</v-icon>
					<!-- <span class="ml-2">リスト</span> -->
				</v-btn>

				<!-- below for login -->
				<!-- <v-btn v-if="isLogin" text @click="logout">
					<span class="mr-2">登出</span>
					<v-icon small>fas fa-walking</v-icon>
				</v-btn>

				<v-btn v-else text @click="dialogModal = true">
					<span class="mr-2">登入</span>
					<v-icon small>fas fa-user</v-icon>
				</v-btn> -->
			</v-app-bar>

			<v-content class="grey lighten-3">
				<div
					ref="scrollPage"
					class="min-scroll primary-scroll"
					style="overflow-x:hidden; overflow-y:auto;"
					:style="{ height: contentHeight }"
				>
					<router-view class="pa-3" />
				</div>
			</v-content>

			<!--  snackbar  -->
			<transition-group name="slideRight">
				<template v-for="(n, idx) in $store.state.snackbars">
					<v-snackbar
						:key="`snack${idx}`"
						v-if="n.show"
						v-model="n.show"
						right
						bottom
						:color="n.color"
						:timeout="n.timeout"
						:style="{ bottom: `${60 + (10 + 60) * (idx - barsHidden)}px` }"
					>
						{{ `${n.text}` }}
						<v-btn text @click="n.show = false">Close</v-btn>
					</v-snackbar>
				</template>
			</transition-group>

			<!-- no used -->
			<div class="fixed-right-bottom">
				<span>Resolution:</span>
				{{ webWidth }} x {{ webHeight }} &lt; = &gt; {{ screenWidth }} x
				{{ screenHeight }}
				<span class="ml-2" v-text="'breakpoint:'" />
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
		SHOW: false,
		// drawer: true,
		// miniVariant: true,
		//
		// Title: process.env.IS_ELECTRON ? '伺服端' : '客戶端',
		Title: '歌詞檢索',
		// ActivePage: 'SubTitle',
		//
		webWidth: window.innerWidth,
		webHeight: window.innerHeight,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height
		//
	}),
	computed: {
		contentHeight() {
			return `${this.webHeight - 38}px`;
		},

		barsHidden() {
			return this.$store.getters.barsHidden;
		}
	},
	watch: {
		// 若 snackbars 全部 timeout 則清空
		'$store.getters.barsVisible'(e) {
			if (e == 0) this.$store.state.snackbars = [];
		}
	},
	created() {
		// console.log(this.$vuetify);
		console.log('env', process.env);
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

		window.onresize = () => {
			this.webWidth = window.innerWidth;
			this.webHeight = window.innerHeight;
		};

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
	methods: {}
};
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
