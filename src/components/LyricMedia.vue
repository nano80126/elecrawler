<template>
	<div>
		<v-row no-gutters align="start" justify="start">
			<v-col cols="12">
				<v-toolbar flat dense height="40" color="transparent" class="px-0">
					<!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
					<v-btn
						icon
						small
						class="ml-n4 mr-3"
						width="36"
						height="36"
						@click="
							() => {
								this.$emit('update:bigImage', !this.bigImage);
								updateRatio();
							}
						"
					>
						<v-icon>{{ bigImage ? 'fas fa-chevron-right' : 'fas fa-chevron-left' }}</v-icon>
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
						background-color="brown lighten-4"
					>
						<template v-slot:prepend-inner>
							<v-icon left small class="mt-1">fab fa-youtube</v-icon>
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
					</template>-->
				</v-toolbar>
			</v-col>

			<v-col cols="12" class="mt-3 d-flex align-center">
				<v-chip class="mr-2 pr-4" color="light-blue" text-color="white">
					{{ imgSize.width }} &times; {{ imgSize.height }}
					<v-icon right small>fas fa-expand</v-icon>
				</v-chip>

				<v-chip class="mr-2 pr-4" color="light-green" text-color="white">
					{{ $lodash.round(fitRatio * 100, 2) }}
					<v-icon right small>fas fa-percentage</v-icon>
				</v-chip>
				<v-spacer />
				<!--  -->

				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn outlined icon @click="dialogImage" v-bind="attrs" v-on="on" :disabled="disableDialog">
							<v-icon small>far fa-image</v-icon>
						</v-btn>
					</template>
					<span>画像を選択する</span>
				</v-tooltip>

				<!-- <v-btn outlined icon class="ml-2">
					<v-icon small>far fa-square</v-icon>
				</v-btn>-->
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							outlined
							class="ml-2"
							:class="{ 'primary lighten-4': catchAvatar }"
							:disabled="!imgurl"
							@click="catchAvatar = !catchAvatar"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon small style="transform: rotate(90deg)">fas fa-crop-alt</v-icon>
						</v-btn>
					</template>
					<span>アバターキャプチャ</span>
				</v-tooltip>

				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon outlined class="ml-2" @click="removeImage()" v-bind="attrs" v-on="on">
							<v-icon small>fas fa-times</v-icon>
						</v-btn>
					</template>
					<span>画像を削除する</span>
				</v-tooltip>

				<!--  -->
				<v-divider vertical class="mx-2" />
				<v-tooltip left>
					<template v-slot:activator="{ on, attrs }">
						<v-btn outlined icon v-bind="attrs" v-on="on" @click="keepMedia">
							<v-icon small>fas fa-download</v-icon>
						</v-btn>
					</template>
					<span>保存する</span>
				</v-tooltip>
				<!--  -->
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
							class="no-select rounded-lg transparent"
							@dragenter.capture="dragging = true"
							@dragleave.capture="dragging = false"
							@drop.capture="dragging = false"
							width="100%"
							ref="imgCard"
							@mousedown.capture="rectOn"
							@mousemove.capture="crossMove"
							@mouseleave.capture="crossReset"
							@mouseup.capture="rectOff"
						>
							<transition name="imagFadeIn">
								<v-img
									v-if="imgurl"
									:src="`data:image/jpeg;base64,${imgurl.toString('base64')}`"
									contain
									:max-width="imgSize.width > 0 ? imgSize.width : null"
									:max-height="imgSize.height > 0 ? imgSize.height : null"
									style="border-radius: inherit; margin:auto;"
									ref="img"
									v-resize="resize"
									@load="updateRatio"
								>
									<template v-if="catchAvatar">
										<div id="small-region" ref="region" />
										<div id="crosshair-h" class="hair" ref="hairH" />
										<div id="crosshair-v" class="hair" ref="hairV" />
										<span id="mousepos" ref="pos" v-text="'X:0, Y:0'" />
									</template>
									<div id="small-region-freeze" ref="region-freeze" />
								</v-img>
								<v-card-text v-else class="text-center white mx-auto rounded-lg" style="width: 75%">
									ドラッグ & ドロップ
									<br />
									<small>Drag image and drop here</small>
								</v-card-text>
							</transition>

							<input
								ref="file"
								type="file"
								@change="onChange"
								@click.prevent
								title
								accept="image/jpeg, image/png, image/bmp"
							/>

							<!-- <v-card-text v-if="imgurl && false">
								{{ imgurl.length }}
							</v-card-text>-->
							<!-- </template> -->
						</v-card>
						<!-- </v-menu> -->
					</div>
				</v-responsive>
			</v-col>
		</v-row>

		<template v-if="true">
			<div>
				abs: {{ rectAbs }}
				<br />
				perc: {{ rectPercent }}
				<br />
				{{ imgurl ? imgurl.length : 0 }}
			</div>

			<div v-for="(item, index) in lyric.obj" :key="index">
				{{ index != 'lyric' ? `${index}:` : null }}
				{{ index != 'lyric' ? item : null }}
			</div>
		</template>

		<!-- {{ this.$refs.img.$el.clientWidth }}
		{{ this.$refs.img.$el.clientHeight }}-->

		<!-- {{ catchAvatar }}
		{{ startRectFlag }}
		{{ showMenu }}-->

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
				<v-btn text small class="ml-n3 mr-1" color="error" @click="rejectRect">
					<v-icon>fas fa-times</v-icon>
				</v-btn>
				<v-btn text small class="ml-1 mr-n3" color="success" @click="acceptRect">
					<v-icon>fas fa-check</v-icon>
				</v-btn>
			</v-toolbar>
		</v-menu>
	</div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
	name: 'LyricMedia',

	props: {
		bigImage: {
			type: Boolean,
			required: true
		},

		lyric: {
			type: Object,
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
			// imgbuf: null,
			dragging: false,
			canPaste: false,
			//
			catchAvatar: false, // start select rectangle
			startRectFlag: false, // on when left mouse down
			showMenu: false, // show menu when right mouse up
			//
			rectAbs: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			rectPercent: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},

			imgSize: { width: 0, height: 0 },

			menuPos: {
				x: 0,
				y: 0
			},

			fitRatio: 0
		};
	},
	computed: {},
	watch: {},

	created() {
		this.$fs.exists(this.$picPath, exist => {
			if (!exist) {
				this.$fs.mkdir(this.$picPath, err => {
					if (err) {
						this.$store.commit('snackbar', {
							text: err,
							color: 'error'
						});
					}
				});
			}
		});
	},
	mounted() {
		this.$dbList.findOne({ uniqueKey: this.lyric.obj.key }, (err, doc) => {
			if (err) {
				this.$store.commit('snackbar', { text: err, color: 'error' });
				return;
			} else if (doc == null) return;

			if (doc.imagePath) {
				const image = this.$sharp(doc.imagePath);
				image.toBuffer((err, data, info) => {
					if (err) this.$store.commit('commit', { text: err, color: 'error' });

					this.imgurl = data;
					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', info.width);
						this.$set(this.imgSize, 'height', info.height);

						const regionFreeze = this.$refs['region-freeze'];
						if (regionFreeze && doc.rectangle != {}) {
							this.rectPercent = doc.rectangle;
							regionFreeze.style.left = `${this.rectPercent.x}%`;
							regionFreeze.style.top = `${this.rectPercent.y}%`;
							regionFreeze.style.width = `${this.rectPercent.width}%`;
							regionFreeze.style.height = `${this.rectPercent.height}%`;
						}
					});
				});
			}
			console.log(doc);
		});
	},
	methods: {
		// 貼上圖片
		onPaste(e) {
			e.preventDefault();
			e.stopPropagation();
			this.removeImage();

			console.time('paste');

			const items = e.clipboardData.files;
			if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
				console.error('no image or not image');
				return;
			}

			const file = items[0];
			const reader = new FileReader();

			reader.addEventListener('load', async e => {
				const base64 = e.target.result.replace(/^data:image\/\w+;base64,/, '');
				const buf = Buffer.from(base64, 'base64');

				const image = this.$sharp(buf).toFormat('jpeg');
				const meta = await image.metadata();

				if (meta.width > 1440) {
					image.resize(1440).toBuffer((err, data, info) => {
						if (err) this.$store.commit('commit', { text: err, color: 'error' });

						this.imgurl = data;
						this.$nextTick(() => {
							this.$set(this.imgSize, 'width', info.width);
							this.$set(this.imgSize, 'height', info.height);
						});
					});
				} else {
					image.toBuffer((err, data, info) => {
						if (err) this.$store.commit('commit', { text: err, color: 'error' });

						this.imgurl = data;
						this.$nextTick(() => {
							this.$set(this.imgSize, 'width', info.width);
							this.$set(this.imgSize, 'height', info.height);
						});
					});
				}
			});
			reader.readAsDataURL(file);
			e.target.blur();
		},

		// 拖曳載入圖片
		async onChange(e) {
			e.preventDefault();
			e.stopPropagation();
			this.removeImage();

			console.time('change');

			const items = e.target.files || e.dataTransfer.files;
			if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
				console.error('no image or not image');
				return;
			}

			const filePath = items[0].path;
			const image = this.$sharp(filePath);
			const meta = await image.metadata();

			// console.log(filePath);
			if (meta.width > 1440) {
				image.resize(1440).toBuffer((err, data, info) => {
					if (err) console.error(err);
					this.imgurl = data;

					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', info.width);
						this.$set(this.imgSize, 'height', info.height);

						console.timeEnd('change');
					});
				});
			} else {
				image.toBuffer((err, data, info) => {
					if (err) console.warn(err);
					console.log(data);
					this.imgurl = data;

					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', info.width);
						this.$set(this.imgSize, 'height', info.height);

						console.timeEnd('change');
					});
				});
			}
			this.$refs.file.value = null;
		},

		// dialog 選擇圖片
		dialogImage() {
			this.disableDialog = true;
			this.$remote.dialog
				.showOpenDialog({
					filters: [{ name: 'Images', extensions: ['jpg', 'png', 'bmp'] }]
				})
				.then(async res => {
					if (!res.canceled) {
						this.removeImage();
						console.time('dialog');

						const filePath = res.filePaths[0];
						const image = this.$sharp(filePath);
						const meta = await image.metadata();

						if (meta.width > 1440) {
							image.resize(1440).toBuffer((err, data, info) => {
								if (err) console.error(err);
								this.imgurl = data;

								this.$nextTick(() => {
									this.$set(this.imgSize, 'width', info.width);
									this.$set(this.imgSize, 'height', info.height);

									console.timeEnd('dialog');
								});
							});
						} else {
							image.toBuffer((err, data, info) => {
								if (err) console.warn(err);
								this.imgurl = data;

								this.$nextTick(() => {
									this.$set(this.imgSize, 'width', info.width);
									this.$set(this.imgSize, 'height', info.height);

									console.timeEnd('dialog');
								});
							});
						}
					}
				})
				.catch(err => {
					if (err) {
						this.$store.commit('snackbar', {
							text: err,
							color: 'error'
						});
					}
				})
				.finally(() => {
					this.disableDialog = false;
				});
		},

		// 儲存 url、image、avatar
		keepMedia() {
			// if (!this.imgurl) return;

			// console.log(this.imgurl);
			if (this.imgurl) {
				const image = this.$sharp(this.imgurl);
				const promises = [];

				const x = Math.round((this.imgSize.width * this.rectPercent.x) / 100);
				const y = Math.round((this.imgSize.height * this.rectPercent.y) / 100);
				const w = Math.round((this.imgSize.width * this.rectPercent.width) / 100);
				const h = Math.round((this.imgSize.height * this.rectPercent.height) / 100);

				promises.push(
					image
						.clone()
						.toFormat('jpeg')
						.toFile(`${this.$picPath}\\${this.lyric.obj.key}.jpg`)
				);

				//
				if (w > 0 && h > 0) {
					promises.push(
						image
							.clone()
							.extract({ left: x, top: y, width: w, height: h })
							.resize(128, 128, { fit: this.$sharp.fit.outside, withoutEnlargement: true })
							.toFormat('jpeg')
							.toFile(`${this.$picPath}\\${this.lyric.obj.key}_avatar.jpg`)
					);
				}

				Promise.all(promises)
					.then(res => {
						console.log('Done!', res);
						// res.forEach();

						const obj = this.lyric.obj;

						// this.$dbLyric.update(
						// 	{ key: obj.key },
						// 	{
						// 		$set: {
						// 			url: this.url,
						// 			lyricUrl: obj.url,
						// 			imagePath: `${this.$picPath}\\${obj.key}.jpg`,
						// 			rectangle: this.rectPercent,
						// 			datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
						// 		}
						// 	},
						// 	{ upsert: true },
						// 	err => {
						// 		if (err) {
						// 			this.$store.commit('snackbar', {
						// 				text: err,
						// 				color: 'error'
						// 			});
						// 		}
						// 	}
						// );

						// add avatart to list
						this.$dbList.update(
							{ uniqueKey: obj.key },
							{
								$set: {
									// uniqueKey: this.lyricObj.key,
									ytUrl: this.url,
									imagePath: `${this.$picPath}\\${obj.key}.jpg`,
									rectangle: Object.freeze(this.rectPercent),
									avatarPath: `${this.$picPath}\\${obj.key}_avatar.jpg`,
									datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
								}
							},
							{ upsert: false },
							(err, nb) => {
								if (err) console.warn(err);
								console.log(nb);
							}
						);
					})
					.catch(err => {
						if (err) {
							this.$store.commit('snackbar', {
								text: err,
								color: 'error'
							});

							this.$fs.unlinkSync(`${this.$picPath}\\${this.lyric.obj.key}.jpg`);
							this.$fs.unlinkSync(`${this.$picPath}\\${this.lyric.obj.key}_avatar.jpg`);
						}
					});
			} else {
				const obj = this.lyric.obj;
				this.$dbList.update(
					{ uniqueKey: obj.key },
					{
						$set: {
							ytUrl: this.url,
							imagePath: null,
							rectangle: {},
							avatarPath: null,
							datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
						}
					},
					{ upsert: true },
					(err, nb) => {
						if (err) this.$store.commit('snackbar', { text: err, color: 'error' });

						// 確認有更新後刪除
						if (nb > 0) {
							this.$fs.unlinkSync(`${this.$picPath}\\${this.lyric.obj.key}.jpg`);
							this.$fs.unlinkSync(`${this.$picPath}\\${this.lyric.obj.key}_avatar.jpg`);
						}
					}
				);
			}
		},

		// 刪除 image
		removeImage() {
			this.imgurl = null; // 重置 imgurl
			this.imgSize.width = this.imgSize.height = 0; // 重置 imgSize
			this.fitRatio = 0; // 重置縮小倍率
			this.$refs.file.value = null; // 重置 file
			//
			this.catchAvatar = false;
			this.startRectFlag = false;
			this.showMenu = false;
		},

		// crosshair 十字移動
		crossMove(e) {
			if (!this.imgurl || !this.catchAvatar) return;

			const x = e.offsetX - 2 < 0 ? 0 : e.offsetX - 2;
			const y = e.offsetY - 2 < 0 ? 0 : e.offsetY - 2;
			this.$refs.hairV.style.left = `${e.offsetX}px`;
			this.$refs.hairH.style.top = `${e.offsetY}px`;
			this.$refs.pos.innerText = `X:${x}, Y:${y}`;
			// this.$refs.pos.style.top = `${e.offsetY}px`;
			// this.$refs.pos.style.left = `${e.offsetX}px`;
			if (this.startRectFlag) {
				const w = this.$refs.img.$el.clientWidth;
				const h = this.$refs.img.$el.clientHeight;
				// console.log(w, h);

				if (e.offsetX < this.rectAbs.x) this.$refs.region.style.left = `${(100 * e.offsetX) / w}%`;
				else this.$refs.region.style.left = `${(100 * this.rectAbs.x) / w}%`;
				if (e.offsetY < this.rectAbs.y) this.$refs.region.style.top = `${(100 * e.offsetY) / h}%`;
				else this.$refs.region.style.top = `${(100 * this.rectAbs.y) / h}%`;
				// this.$refs.region.style.left =

				this.rectAbs.width = Math.abs(e.offsetX - this.rectAbs.x) + 1;
				this.rectAbs.height = Math.abs(e.offsetY - this.rectAbs.y) + 1;
				this.$refs.region.style.width = `${(100 * this.rectAbs.width) / w}%`;
				this.$refs.region.style.height = `${(100 * this.rectAbs.height) / h}%`;
			}
		},

		// crosshair 十字重置 // 移出 v-card 時
		crossReset() {
			if (!this.imgurl || !this.catchAvatar) return;

			this.$refs.hairH.style.top = 0;
			this.$refs.hairV.style.left = 0;
			this.$refs.pos.innerText = 'X:0, Y:0';
		},

		// 開始框選圖片 // left button down
		rectOn(e) {
			if (!this.imgurl || !this.catchAvatar) return;
			// console.log(e);
			if (e.button == 0) {
				this.startRectFlag = true;

				this.$nextTick(() => {
					const w = this.$refs.img.$el.clientWidth;
					const h = this.$refs.img.$el.clientHeight;

					this.rectAbs.x = e.offsetX - 1;
					this.rectAbs.y = e.offsetY - 1;

					this.rectAbs.width = this.rectAbs.height = 0;
					this.rectPercent.width = this.rectPercent.height = 0;
					this.$refs.region.style.width = this.$refs.region.style.height = 0;

					this.$refs.region.style.left = `${this.rectAbs.x / w}%`;
					this.$refs.region.style.top = `${this.rectAbs.y / h}%`;

					this.$nextTick(() => (this.showMenu = false));
				});
			}
		},

		// 停止框選圖片 // left button up
		rectOff(e) {
			if (!this.imgurl || !this.catchAvatar) return;
			if (e.button == 0) {
				this.startRectFlag = false;

				this.$nextTick(() => {
					const region = this.$refs.region;
					// console.log(region);

					this.rectPercent.x = parseFloat(this.$lodash.trimEnd(region.style.left, '%'));
					this.rectPercent.y = parseFloat(this.$lodash.trimEnd(region.style.top, '%'));
					this.rectPercent.width = parseFloat(this.$lodash.trimEnd(region.style.width, '%'));
					this.rectPercent.height = parseFloat(this.$lodash.trimEnd(region.style.height, '%'));

					this.menuPos.x = e.offsetX < this.rectAbs.x ? e.x + this.rectAbs.width : e.x;
					this.menuPos.y = e.offsetY < this.rectAbs.y ? e.y + this.rectAbs.height : e.y;
					this.$nextTick(() => {
						if (this.rectAbs.width <= 5 || this.rectAbs.height <= 5) return;
						else if (this.rectAbs.width >= 128 && this.rectAbs.height >= 128) this.showMenu = true;
						else {
							this.$store.commit('snackbar', {
								text: 'must large than 128 x128 ',
								color: 'info'
							});
						}
					});
				});
			}
		},

		// 更新圖片縮小倍率
		updateRatio() {
			this.$nextTick(() => {
				if (this.$refs.img) this.fitRatio = this.$refs.img.$el.clientWidth / this.imgSize.width;
			});
		},

		// 更新圖片縮小倍率 // after window change size
		resize: debounce(function() {
			this.showMenu = false;
			this.updateRatio();
		}, 300),

		// 放棄框選之矩形
		rejectRect() {
			Object.keys(this.rectAbs).forEach(k => (this.rectAbs[k] = 0));
			Object.keys(this.rectPercent).forEach(k => (this.rectPercent[k] = 0));
			//
			this.catchRect = false;
		},

		// 接受框選之矩形
		acceptRect() {
			const regionFreeze = this.$refs['region-freeze'];
			regionFreeze.style.left = `${this.rectPercent.x}%`;
			regionFreeze.style.top = `${this.rectPercent.y}%`;
			regionFreeze.style.width = `${this.rectPercent.width}%`;
			regionFreeze.style.height = `${this.rectPercent.height}%`;
			//
			const region = this.$refs['region'];
			region.style.width = region.style.height = 0;
			//
			this.catchAvatar = false;
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
		padding-top: 10%;
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
	}
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
	background-color: rgba(darkgray, 0.24);
}

#small-region-freeze {
	position: absolute;
	top: 0;
	left: 0;
	margin-top: -2px;
	margin-left: -2px;
	border: 1px solid rgba(darkgreen, 0.72);
	background-color: rgba(green, 0.12);
	// background-color: rgba(green, 0.48);
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

.imagFadeIn-enter-active {
	transition: all 0.7s;
}

.imagFadeIn-enter {
	opacity: 0.15;
	transform: scale(0.1, 0.1);
}
</style>
