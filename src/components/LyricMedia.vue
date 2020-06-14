<template>
	<div>
		<v-row no-gutters align="start" justify="start">
			<v-col cols="12">
				<v-toolbar flat dense height="40" color="transparent">
					<!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
					<v-btn
						icon
						small
						class="mr-3"
						width="36"
						height="36"
						@click="() => this.$emit('update:bigImage', !this.bigImage)"
					>
						<v-icon>
							{{ bigImage ? 'fas fa-chevron-right' : 'fas fa-chevron-left' }}
						</v-icon>
					</v-btn>

					<v-text-field
						v-model="url"
						filled
						rounded
						dense
						hide-details
						placeholder="Youtubeのリンク"
						class="mx-0"
						color="success"
					>
						<template v-slot:prepend-inner>
							<v-icon small class="mt-1 mr-1">fab fa-youtube</v-icon>
						</template>
					</v-text-field>

					<!-- <template v-slot:extension>
						<v-spacer></v-spacer>

						<v-btn small outlined text>
							<v-icon small>fas fa-edit</v-icon>
						</v-btn>

						<v-btn
							icon
							small
							:class="{ 'primary lighten-4': catchAvatar }"
							:disabled="!imgurl"
							@click="catchAvatar = !catchAvatar"
						>
							<v-icon small>fas fa-expand</v-icon>
						</v-btn>
					</template> -->
				</v-toolbar>
			</v-col>

			<v-col cols="12" class="mt-3 d-flex">
				<v-btn outlined icon class="mr-2">
					<v-icon small>fas fa-edit</v-icon>
				</v-btn>
				<v-spacer></v-spacer>

				<!-- <v-btn-toggle v-model="catchAvatar" dense rounded background-color="transparent"> -->
				<v-btn
					icon
					outlined
					:class="{ 'primary lighten-4': catchAvatar }"
					:disabled="!imgurl"
					@click="catchAvatar = !catchAvatar"
				>
					<v-icon small>fas fa-expand</v-icon>
				</v-btn>
				<!-- </v-btn-toggle> -->
				<!-- </v-col>
			<v-col class="mt-3 d-flex"> -->
				<v-spacer />
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							outlined
							icon
							class="ml-2"
							@click="dialogImage"
							v-bind="attrs"
							v-on="on"
							:disabled="disableDialog"
						>
							<v-icon small>far fa-image</v-icon>
						</v-btn>
					</template>
					<span>画像を選択する</span>
				</v-tooltip>

				<v-btn outlined icon class="ml-2">
					<v-icon small>far fa-square</v-icon>
				</v-btn>

				<v-btn outlined icon class="ml-2" @click="removeImage()">
					<v-icon small>fas fa-times</v-icon>
				</v-btn>
			</v-col>

			<v-col cols="12" class="mt-3">
				<v-responsive :aspect-ratio="16 / 9">
					<div
						class="image-zone d-flex align-center justify-center pa-3"
						:class="{ 'drag-hover': dragging, 'drag-focus': canPaste }"
					>
						<div
							tabindex="0"
							class="paste-zone"
							@paste="onPaste"
							@focus="canPaste = true"
							@blur="canPaste = false"
							style="outline: 0;"
						></div>

						<!-- <v-menu v-model="showMenu" absolute offset-x> -->
						<v-card
							id="imgCard"
							flat
							class="no-select rounded-lg"
							@dragenter.capture="dragging = true"
							@dragleave.capture="dragging = false"
							@drop.capture="dragging = false"
							min-width="75%"
							ref="backReg"
							@mousedown.capture="regionOn"
							@mousemove.capture="crossMove"
							@mouseleave.capture="crossReset"
							@mouseup.capture="regionOff"
						>
							<!-- <v-btn v-on="on" v-bind="attrs" style="z-index:50;">123</v-btn> -->

							<!-- <template v-slot:activator="{ on, attrs }">
									<div
										v-on="on"
										v-bind="attrs"
										style="position:absolute; width: 100%; height:100%"
									></div> -->

							<v-img v-if="imgurl" :src="imgurl" contain style="border-radius: inherit">
								<template v-if="catchAvatar">
									<div id="small-region" ref="region" />
									<div id="crosshair-h" class="hair" ref="hairH" />
									<div id="crosshair-v" class="hair" ref="hairV" />
									<span id="mousepos" ref="pos" v-text="'X:0, Y:0'" />
								</template>
							</v-img>
							<v-card-text v-else class="text-center">
								ドラッグ & ドロップ
								<br /><small>Drag image and drop here</small>
							</v-card-text>

							<input
								ref="file"
								type="file"
								@change="onChange"
								@click.prevent
								title=""
								accept="image/jpeg,image/png,image/bmp"
							/>

							<!-- <v-card-text v-if="imgurl && false">
								{{ imgurl.length }}
							</v-card-text> -->
							<!-- </template> -->
						</v-card>
						<!-- </v-menu> -->
					</div>
				</v-responsive>
			</v-col>
			<!-- <v-col cols="12" style="position:relative; min-height:200px;">
				<canvas id="avatar" ref="avatarReg" />
			</v-col> -->
		</v-row>
		{{ catchAvatar }}
		{{ startRegionFlag }}
		{{ showMenu }}

		<v-menu
			v-model="showMenu"
			left
			absolute
			rounded="0"
			:position-x="menuPos.x"
			:position-y="menuPos.y"
			:close-on-click="false"
			:close-on-content-click="true"
			:nudge-left="2"
		>
			<v-toolbar dense height="36">
				<v-btn text small class="ml-n3 mr-1" color="error">
					<v-icon>fas fa-times</v-icon>
				</v-btn>
				<v-btn text small class="ml-1 mr-n3" color="success">
					<v-icon>fas fa-check</v-icon>
				</v-btn>
			</v-toolbar>
		</v-menu>
	</div>
</template>

<script>
export default {
	props: {
		bigImage: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			url: null,
			///
			disableDialog: false,
			///
			imgurl: null,
			dragging: false,
			canPaste: false,
			//
			catchAvatar: false, // start select rectangle
			startRegionFlag: false, // on when left mouse down
			showMenu: false, // show menu when right mouse up
			//
			region: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},

			menuPos: {
				x: 0,
				y: 0
			}

			// regionX: 0,
			// regionY: 0,
			// regionWidth: 0,
			// regionHeight: 0

			// avaReg: {
			// 	X: 0,
			// 	Y: 0,
			// 	endX: 0,
			// 	endY: 0
			// }
		};
	},

	computed: {
		nudgeBottom() {
			return this.regionY + this.regionHeight;
		},

		nudgeRight() {
			return this.regionX + this.regionWidth;
		}
	},

	watch: {},

	mounted() {},
	methods: {
		onPaste(e) {
			e.preventDefault();
			e.stopPropagation();

			console.time('paste');

			const items = e.clipboardData.files;
			console.log(e);
			console.log(e.clipboardData.files[0]);
			if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
				console.error('no image or not image');
				return;
			}

			const file = items[0];
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				console.log(reader.result);
				this.imgurl = reader.result;
			});
			reader.readAsDataURL(file);

			// const objectUrl = URL.createObjectURL(file);
			// this.imgurl = objectUrl;
			// console.log(file);
			// console.log(objectUrl);

			// const reader = new FileReader();
			// reader.addEventListener('load', load => {
			// 	this.imgurl = load.target.result;
			// });
			// reader.readAsDataURL(items[0]);

			// const file = e.clipboardData.items[0].getAsFile();
			// const objectUrl = URL.createObjectURL(file);

			// console.log(file);
			// console.log(objectUrl);
			// this.imgurl = objectUrl;

			console.timeEnd('paste');
		},

		async onChange(e) {
			e.preventDefault();
			e.stopPropagation();
			console.time('change');

			const items = e.target.files || e.dataTransfer.files;
			if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
				console.error('no image or not image');
				return;
			}

			const filePath = items[0].path;
			console.log(filePath);
			const image = this.$sharp(filePath);
			const meta = await image.metadata();

			if (meta.width > 1440) {
				image.resize(1440).toBuffer((err, data, info) => {
					if (err) console.error(err);
					this.imgurl = `data:image/jpeg;base64,${data.toString('base64')}`;
					console.log(info);
					console.timeEnd('change');
				});
			} else {
				image.toBuffer((err, data, info) => {
					if (err) console.warn(err);
					this.imgurl = `data:image/jpeg;base64,${data.toString('base64')}`;
					console.log(info);
					console.timeEnd('change');
				});
			}
			this.$refs.file.value = null;
		},

		dialogImage() {
			this.disableDialog = true;
			this.$remote.dialog
				.showOpenDialog({
					filters: [{ name: 'Images', extensions: ['jpg', 'png', 'bmp'] }]
				})
				.then(async res => {
					if (!res.canceled) {
						console.time('dialog');
						const filePath = res.filePaths[0];
						console.log(filePath);
						const image = this.$sharp(filePath);
						const meta = await image.metadata();

						if (meta.width > 1440) {
							image.resize(1440).toBuffer((err, data, info) => {
								if (err) console.error(err);
								this.imgurl = `data:image/jpeg;base64,${data.toString('base64')}`;
								console.log(info);
								console.timeEnd('dialog');
							});
						} else {
							image.toBuffer((err, data, info) => {
								if (err) console.warn(err);
								this.imgurl = `data:image/jpeg;base64,${data.toString('base64')}`;
								console.log(info);
								console.timeEnd('dialog');
							});
						}
					}
				})
				.catch(err => {
					if (err) console.error(err);
				})
				.finally(() => {
					this.disableDialog = false;
				});
		},

		removeImage() {
			this.imgurl = null;
			this.$refs.file.value = null;

			this.catchAvatar = false;
			this.startRegionFlag = false;
			this.showMenu = false;
		},

		crossMove(e) {
			if (!this.imgurl || !this.catchAvatar) return;

			const x = e.offsetX - 2 < 0 ? 0 : e.offsetX - 2;
			const y = e.offsetY - 2 < 0 ? 0 : e.offsetY - 2;
			this.$refs.hairV.style.left = `${e.offsetX}px`;
			this.$refs.hairH.style.top = `${e.offsetY}px`;
			this.$refs.pos.innerText = `X:${x}, Y:${y}`;
			// this.$refs.pos.style.top = `${e.offsetY}px`;
			// this.$refs.pos.style.left = `${e.offsetX}px`;
			if (this.startRegionFlag) {
				if (e.offsetX < this.region.x) this.$refs.region.style.left = `${e.offsetX}px`;
				else this.$refs.region.style.left = `${this.region.x}px`;
				if (e.offsetY < this.region.y) this.$refs.region.style.top = `${e.offsetY}px`;
				else this.$refs.region.style.top = `${this.region.y}px`;
				// this.$refs.region.style.left =
				this.$refs.region.style.width = `${Math.abs(e.offsetX - this.region.x) + 1}px`;
				this.$refs.region.style.height = `${Math.abs(e.offsetY - this.region.y) + 1}px`;
			}
		},

		crossReset() {
			if (!this.imgurl || !this.catchAvatar) return;

			this.$refs.hairH.style.top = 0;
			this.$refs.hairV.style.left = 0;
			this.$refs.pos.innerText = 'X:0, Y:0';
		},

		regionOn(e) {
			if (!this.imgurl || !this.catchAvatar) return;
			// console.log(e);
			if (e.button == 0) {
				this.startRegionFlag = true;

				this.$nextTick(() => {
					this.region.x = e.offsetX - 1;
					this.region.y = e.offsetY - 1;

					this.region.width = this.region.height = 0;
					this.$refs.region.style.width = this.$refs.region.style.height = 0;

					this.$refs.region.style.left = `${this.region.x}px`;
					this.$refs.region.style.top = `${this.region.y}px`;

					this.showMenu = false;
				});
			}
		},

		regionOff(e) {
			if (!this.imgurl || !this.catchAvatar) return;

			if (e.button == 0) {
				this.startRegionFlag = false;

				this.$nextTick(() => {
					const region = this.$refs.region;
					this.region.x = parseInt(this.$lodash.trimEnd(region.style.left, 'px'));
					this.region.y = parseInt(this.$lodash.trimEnd(region.style.top, 'px'));
					this.region.width = parseInt(this.$lodash.trimEnd(region.style.width, 'px'));
					this.region.height = parseInt(this.$lodash.trimEnd(region.style.height, 'px'));

					this.menuPos.x = e.x - e.offsetX + this.region.x + this.region.width;
					this.menuPos.y = e.y - e.offsetY + this.region.y + this.region.height;
					this.$nextTick(() => {
						if (this.region.width <= 5 || this.region.height <= 5) return;
						else if (this.region.width >= 128 && this.region.height >= 128) this.showMenu = true;
						else {
							this.$store.commit('snackbar', {
								text: 'must large than 128 x128 ',
								color: 'info'
							});
						}
					});
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.image-zone {
	position: relative;
	height: 100%;
	width: 100%;
	border: 2px dashed grey;
	border-radius: 5px;
	user-select: all;
}

.drag-hover {
	background-color: rgba($color: grey, $alpha: 0.24);
}

.drag-focus {
	border-color: lightblue;

	&::before {
		content: 'ペースト (Ctrl + V)';
		padding-top: 20%;
		font-size: 16px;
		font-weight: 900;
		color: rgba($color: grey, $alpha: 0.48);
		text-align: center;
		position: absolute;
		border-radius: 5px;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		border: 10px solid rgba($color: grey, $alpha: 0.24);
		// z-index: 0;
	}

	// &::after {
	// 	content: '';
	// }
}

.paste-zone {
	position: absolute;
	width: 100%;
	height: 100%;
	// z-index: 51;
}

input[type='file'] {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	border-radius: inherit;
	// border: 1px solid blue;
}

#small-region {
	position: absolute;
	top: 0;
	left: 0;
	margin-top: -2px;
	margin-left: -2px;
	border: 1px solid rgba(grey, 0.48);
	background-color: rgba(darkgray, 0.36);
}

#small-region-freeze {
	position: absolute;
	top: 0;
	left: 0;
	margin-top: -2px;
	margin-left: -2px;
	border: 1px solid rgba(darkgreen, 0.72);
	background-color: rgba(green, 0.48);
}

#crosshair-v {
	height: 110%;
}

#crosshair-h {
	width: 110%;
}

.hair {
	position: absolute;
	top: 0;
	left: 0;
	margin-top: -2px;
	margin-left: -2px;
	background: transparent;
	border-top: 1px dotted #000;
	border-left: 1px dotted #000;
	pointer-events: none;
}

#mousepos {
	position: absolute;
	top: 0;
	left: 0;
	padding: 10px;
	margin: 10px;
	font: 14px arial;
	color: #fff;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 24px;
}
</style>
