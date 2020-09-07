<template>
	<div>
		<v-row no-gutters align="start" justify="start">
			<v-col cols="12">
				<v-toolbar flat dense height="40" color="transparent" class="px-0">
					<v-btn
						icon
						small
						class="ml-n4"
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

					<!-- <v-hover v-model="fieldHover"> -->
					<v-text-field
						v-model="url"
						filled
						rounded
						dense
						hide-details
						placeholder="YouTubeのリンク"
						class="ml-3"
						@mousewheel="mouseWheel"
						@blur="fieldBlur"
					>
						<!-- <template v-slot:prepend>
							<v-icon color="red">fab fa-youtube</v-icon>
						</template> -->

						<template v-slot:prepend-inner>
							<v-badge :value="badge" :content="urlIndex + 1" overlap left bottom color="orange">
								<v-hover v-model="badge" close-delay="500">
									<v-icon left color="red" style="cursor:default;">fab fa-youtube</v-icon>
								</v-hover>
							</v-badge>
						</template>

						<template v-slot:append>
							<v-tooltip left>
								<template v-slot:activator="{ on }">
									<v-icon right size="24" color="success" v-on="on" @click="addUrl">
										fas fa-plus
									</v-icon>
								</template>
								<span>合計: {{ urlObj.length }}</span>
							</v-tooltip>
						</template>
					</v-text-field>
					<!-- </v-hover> -->

					<v-tooltip left open-delay="300">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								icon
								outlined
								class="ml-2"
								color="primary lighten-2"
								dark
								width="36"
								height="36"
								@click="openWindow(lyric.obj.title)"
								v-bind="attrs"
								v-on="on"
								style="position:relative;"
							>
								<v-icon small>fab fa-chrome</v-icon>
								<!-- <v-icon style="position:absolute; transform: rotate(-45deg);">
									fas fa-long-arrow-alt-right
								</v-icon> -->
							</v-btn>
						</template>
						<span>外部ブラウザでサーチ</span>
					</v-tooltip>
				</v-toolbar>
			</v-col>

			<v-col cols="12" class="mt-3 d-flex align-center">
				<!-- <v-chip v-show="fieldHover">{{ urlIndex }}</v-chip> -->
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

				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							outlined
							class="ml-2"
							@click="getVideoImg"
							v-bind="attrs"
							v-on="on"
							:disabled="urlObj[0].url == null || urlObj[0].url.length == 0"
						>
							<v-icon small>fas fa-photo-video</v-icon>
						</v-btn>
					</template>
					<span>YouTubeカバー画像をゲット</span>
					<span>プレビュー画像</span>
				</v-tooltip>

				<v-tooltip bottom open-delay="300">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							outlined
							class="ml-2"
							@click="dialogImage"
							v-bind="attrs"
							v-on="on"
							:disabled="disableDialog"
						>
							<v-icon small>far fa-image</v-icon>
						</v-btn>
					</template>
					<span>画像選択</span>
				</v-tooltip>

				<!-- <v-btn outlined icon class="ml-2">
					<v-icon small>far fa-square</v-icon>
				</v-btn>-->
				<v-tooltip bottom open-delay="300">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							outlined
							class="ml-2"
							:class="{ 'blue-grey darken-2': catchAvatar }"
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

				<v-tooltip bottom open-delay="300">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon outlined class="ml-2" @click="removeImage()" v-bind="attrs" v-on="on">
							<v-icon small>fas fa-times</v-icon>
						</v-btn>
					</template>
					<span>画像を削除する</span>
				</v-tooltip>

				<!--  -->
				<v-divider vertical class="mx-2" />
				<v-tooltip bottom open-delay="300">
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
								<v-card-text
									v-else
									class="text-center grey darken-2 mx-auto rounded-lg"
									style="width: 75%"
								>
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
						</v-card>
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
				imageSize: {{ imgSize }}
				<br />
				{{ imgurl ? imgurl.length : 0 }}
			</div>

			<div v-for="(item, index) in lyric.obj" :key="index">
				{{ index != 'lyric' ? `${index}:` : null }}
				{{ index != 'lyric' ? item : null }}
			</div>
			{{ lyric.obj.key }}
			<br />
			{{ urlObj }}
		</template>

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

<script lang="ts">
import debounce from 'lodash/debounce';

import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Media extends Vue {
	@Prop() bigImage!: boolean;
	@Prop() lyric!: {
		obj: {
			key: string;
			url: string;
			title: string;
			artist: string;
			lyric: string;
		};
	};

	private urlObj: Array<{ url: string | null; id?: string; title?: string }> = [{ url: null }];
	private urlIndex = 0;
	//
	private disableDialog = false;
	//
	private imgurl: Buffer = null;

	private badge = false;
	private badgeTimeout: NodeJS.Timeout;

	private dragging = false;
	private canPaste = false;
	//
	private catchAvatar = false;
	private startRectFlag = false;
	private showMenu = false;
	//
	private rectAbs = { x: 0, y: 0, width: 0, height: 0 };
	private rectPercent = { x: 0, y: 0, width: 0, height: 0 };
	private imgSize = { width: 0, height: 0 };
	private menuPos = { x: 0, y: 0 };
	private fitRatio = 0;
	///
	get url(): string {
		return this.urlObj[this.urlIndex].url;
	}

	set url(value) {
		if (!value) this.urlObj[this.urlIndex].url = null;
		else this.urlObj[this.urlIndex].url = value;
	}

	@Watch('urlIndex')
	OnUrlIndexChanged() {
		this.badge = true;
		clearTimeout(this.badgeTimeout);
		this.$nextTick(() => {
			this.badgeTimeout = setTimeout(() => {
				this.badge = false;
			}, 1000);
		});
	}

	mounted() {
		// console.log(this);
		// console.log(this.$debounce);
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

						const regionFreeze = this.$refs['region-freeze'] as HTMLElement;
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
			this.urlObj = doc.ytObj || this.urlObj;
			// console.log(doc);
		});
	}

	private openWindow(keyWord: string): void {
		const url = `https://www.youtube.com/results?search_query=${keyWord}`;
		this.$shell.openExternal(url);
	}

	private mouseWheel(e: MouseWheelEvent): void {
		if (e.deltaY > 0) {
			this.urlIndex = this.urlIndex + 1 > this.urlObj.length - 1 ? this.urlObj.length - 1 : this.urlIndex + 1;
		} else {
			this.urlIndex = this.urlIndex - 1 < 0 ? 0 : this.urlIndex - 1;
		}
	}

	private fieldBlur(/*e*/): void {
		// this.urlObj = this.urlObj.filter(o => {
		// 	return o.url && o.url.length > 0;
		// });
		// this.urlObj.filter(o => o.url != null);
		this.urlObj.forEach((item, itemKey: number) => {
			if (item.url != null && item.url.length > 0) {
				const id = item.url.match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/);
				if (id && id[0].length == 11 && item.id !== id[0]) {
					this.$axios
						.get('https://www.googleapis.com/youtube/v3/videos', {
							params: { part: 'snippet', id: id[0], key: process.env.VUE_APP_YOUTUBE_DATA_API_KEY }
						})
						.then(res => {
							this.$set(
								this.urlObj,
								itemKey,
								Object.assign(item, { id: id[0], title: res.data.items[0].snippet.title })
							);
							// Object.assign(item, { id: id[0], title: res.data.items[0].snippet.title });
						})
						.catch(err => {
							this.$store.commit('snackbar', { text: err, color: 'error' });
						});
				}
			}
		});
	}

	private addUrl(): void {
		this.urlObj.push({ url: null });
		this.urlIndex = this.urlObj.length - 1;
	}

	private async getVideoImg(e: Event): Promise<void> {
		e.preventDefault();
		e.stopPropagation();

		const videoID = this.urlObj[0].url.match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/);
		if (videoID && videoID[0].length == 11) {
			const buf = await this.$ipcRenderer.invoke('invokeAxios', videoID);

			if (buf.Error) {
				this.$store.commit('snackbar', { text: buf.message, color: 'error' });
				return;
			}

			let image = this.$sharp(Buffer.from(buf));
			// const { width } = await image.metadata();

			image.metadata().then(meta => {
				const { width } = meta;
				if (width > 1440) image = image.resize(1440);

				image.toBuffer((err: Error, data: Buffer, info: { width: number; height: number }) => {
					if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
					this.imgurl = data;
					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', info.width);
						this.$set(this.imgSize, 'height', info.height);
					});
					console.warn('info', info);
				});
			});
		} else {
			this.$store.commit('snackbar', { text: '無効なURL', color: 'warning' });
		}
	}

	private onPaste(e): void {
		e.preventDefault();
		e.stopPropagation();

		const items = e.clipboardData.files;
		if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
			console.error('no image or not image');
			return;
		}

		const file = items[0] as File;
		const reader = new FileReader();

		reader.addEventListener('load', e => {
			// const base64 = e.target.result.replace(/^data:image\/\w+;base64,/, '');
			// const buf = Buffer.from(base64, 'base64');
			const buf = e.target.result;

			let image = this.$sharp(Buffer.from(buf)).toFormat('jpeg');

			console.log(image);

			image.metadata().then(meta => {
				const { width } = meta;
				if (width > 1440) image = image.resize(1440);

				// const { width } = await image.metadata();
				image.toBuffer((err: Error, data: Buffer, info: { width: number; height: number }) => {
					if (err) this.$store.commit('commit', { text: err, color: 'error' });

					this.imgurl = data;
					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', info.width);
						this.$set(this.imgSize, 'height', info.height);
					});
					console.warn('info', info);
				});
			});
		});
		reader.readAsArrayBuffer(file);
		e.target.blur();
	}

	private onChange(e) {
		e.preventDefault();
		e.stopPropagation();

		const items = (e.target.files || e.dataTransfer.files) as File[];
		if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
			// console.error('no image or not image');
			this.$store.commit('snackbar', { text: '無効なイメージ', color: 'warning' });
			return;
		}

		const filePath = items[0].path;
		let image = this.$sharp(filePath);

		image.metadata().then(meta => {
			const { width } = meta;
			if (width > 1440) image = image.resize(1440);

			image.toBuffer((err: Error, data: Buffer, info: { width: number; height: number }) => {
				if (err) console.warn(err);
				// console.log(data);
				this.imgurl = data;

				this.$nextTick(() => {
					this.$set(this.imgSize, 'width', info.width);
					this.$set(this.imgSize, 'height', info.height);
				});
			});
		});

		(this.$refs.file as HTMLInputElement).value = null; // set file content to null
	}

	private dialogImage() {
		this.disableDialog = true;

		this.$ipcRenderer
			.invoke('dialogImage')
			.then((res: { canceled: boolean; filePaths: string[] }) => {
				console.log(res);
				if (!res.canceled) {
					this.removeImage();

					const filePath = res.filePaths[0];
					const image = this.$sharp(filePath);

					// const { width } = image.metadata().then(res=> {
					console.log(1, image);

					image.metadata().then(meta => {
						console.log(2, meta);
						// const { width } = meta;
						// if (width > 1440) image = image.resize({ width: 1440 });

						image.toBuffer((err, data, info) => {
							if (err) console.warn(err);
							console.log(3, data);
							this.imgurl = data;

							this.$nextTick(() => {
								this.$set(this.imgSize, 'width', info.width);
								this.$set(this.imgSize, 'height', info.height);
							});
						});
					});
				}
			})
			.catch((err: string) => {
				if (err) {
					this.$store.commit('snackbar', { text: err, color: 'error' });
				}
			})
			.finally(() => {
				this.disableDialog = false;
			});
	}

	private keepMedia(): void {
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
						.resize(128, 128, { fit: this.$sharpFit.outside, withoutEnlargement: true })
						.toFormat('jpeg')
						.toFile(`${this.$picPath}\\${this.lyric.obj.key}_avatar.jpg`)
				);
			}

			Promise.all(promises)
				.then(res => {
					console.warn('Done!', res);

					const obj = this.lyric.obj;

					// this.urlObj = this.$lodash.compact(this.urlObj);
					this.urlIndex = 0; // Set index to 0 or maybe return url not in urlObj
					this.urlObj = this.urlObj.filter(e => e.url != null && e.url.length > 0);

					// const urlIdArr = [];
					// this.urlObj.forEach(u => {
					// 	const id = u.url.match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/);
					// 	if (id && id[0].length == 11) urlIdArr.push(id[0]);
					// });
					// const v = this.url[0].match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/);
					// add image / avatart to list
					this.$dbList.update(
						{ uniqueKey: obj.key },
						{
							$set: {
								// uniqueKey: this.lyricObj.key,
								ytObj: this.urlObj,
								// ytID: v && v[0].length == 11 ? v[0] : null,
								// ytID: urlIdArr,
								imagePath: `${this.$picPath}\\${obj.key}.jpg`,
								imageSize: Object.freeze(this.imgSize),
								rectangle: Object.freeze(this.rectPercent),
								avatarPath: w > 0 && h > 0 ? `${this.$picPath}\\${obj.key}_avatar.jpg` : null,
								datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
							}
						},
						{ upsert: false },
						err => {
							if (err) this.$store.commit('snackbar', { text: err, color: 'error' });
							else this.$store.commit('snackbar', { text: '変更が保存された', color: 'success' });
						}
					);
				})
				.catch(err => {
					if (err) {
						this.$store.commit('snackbar', { text: err, color: 'error' });

						this.$fs.unlink(`${this.$picPath}\\${this.lyric.obj.key}.jpg`, err => {
							if (err) this.$store.commit('snackbar', { text: err, color: 'warning' });
						});
						this.$fs.unlink(`${this.$picPath}\\${this.lyric.obj.key}_avatar.jpg`, err => {
							if (err) this.$store.commit('snackbar', { text: err, color: 'warning' });
						});
					}
				});
		} else {
			const obj = this.lyric.obj;

			// this.urlObj = this.$lodash.compact(this.url);
			this.urlObj = this.urlObj.filter(e => e.url != null);
			// const urlIdArr = [];
			// this.url.forEach(u => {
			// 	const id = u.url.match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/);
			// 	if (id && id[0].length == 11) urlIdArr.push(id[0]);
			// });
			// const v = this.url ? this.url.match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/) : null;

			this.$dbList.update(
				{ uniqueKey: obj.key },
				{
					$set: {
						ytObj: this.urlObj,
						// ytID: urlIdArr,
						imagePath: null,
						imageSize: {},
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
						this.$store.commit('snackbar', { text: '変更が保存された', color: 'success' });

						const path = [
							`${this.$picPath}\\${this.lyric.obj.key}.jpg`,
							`${this.$picPath}\\${this.lyric.obj.key}_avatar.jpg`
						];

						path.forEach(p => {
							this.$fs.exists(p, exist => {
								if (exist) {
									this.$fs.unlink(p, err => {
										if (err) this.$store.commit('snackbar', { text: err, color: 'warning' });
									});
								}
							});
						});
					}
				}
			);
		}
	}

	private removeImage(): void {
		this.imgurl = null; // 重置 imgurl
		this.imgSize.width = this.imgSize.height = 0; // 重置 imgSize
		this.fitRatio = 0; // 重置縮小倍率
		// this.$refs.file.value = null; // 重置 file
		//
		this.catchAvatar = false;
		this.startRectFlag = false;
		this.showMenu = false;
	}

	private crossMove(e: MouseEvent): void {
		if (!this.imgurl || !this.catchAvatar) return;

		const x = e.offsetX - 2 < 0 ? 0 : e.offsetX - 2;
		const y = e.offsetY - 2 < 0 ? 0 : e.offsetY - 2;
		(this.$refs.hairV as HTMLLIElement).style.left = `${e.offsetX}px`;
		(this.$refs.hairH as HTMLLIElement).style.top = `${e.offsetY}px`;
		(this.$refs.pos as HTMLLIElement).innerText = `X:${x}, Y:${y}`;
		// this.$refs.pos.style.top = `${e.offsetY}px`;
		// this.$refs.pos.style.left = `${e.offsetX}px`;
		if (this.startRectFlag) {
			const w = (this.$refs.img as Vue).$el.clientWidth;
			const h = (this.$refs.img as Vue).$el.clientHeight;
			// console.log(w, h);

			const region = this.$refs.region as HTMLDivElement;

			if (e.offsetX < this.rectAbs.x) region.style.left = `${(100 * e.offsetX) / w}%`;
			else region.style.left = `${(100 * this.rectAbs.x) / w}%`;
			if (e.offsetY < this.rectAbs.y) region.style.top = `${(100 * e.offsetY) / h}%`;
			else region.style.top = `${(100 * this.rectAbs.y) / h}%`;
			// this.$refs.region.style.left =

			this.rectAbs.width = Math.abs(e.offsetX - this.rectAbs.x) + 1;
			this.rectAbs.height = Math.abs(e.offsetY - this.rectAbs.y) + 1;
			region.style.width = `${(100 * this.rectAbs.width) / w}%`;
			region.style.height = `${(100 * this.rectAbs.height) / h}%`;
		}
	}

	private crossReset() {
		// console.log(e);
		if (!this.imgurl || !this.catchAvatar) return;

		(this.$refs.hairH as HTMLDivElement).style.top = '0';
		(this.$refs.hairV as HTMLDivElement).style.left = '0';
		(this.$refs.pos as HTMLSpanElement).innerText = 'X:0, Y:0';
		this.startRectFlag = false;
	}

	private rectOn(e: MouseEvent) {
		if (!this.imgurl || !this.catchAvatar) return;
		//
		if (e.button == 0) {
			this.startRectFlag = true;

			this.$nextTick(() => {
				const w = (this.$refs.img as Vue).$el.clientWidth;
				const h = (this.$refs.img as Vue).$el.clientHeight;

				this.rectAbs.x = e.offsetX - 1;
				this.rectAbs.y = e.offsetY - 1;

				this.rectAbs.width = this.rectAbs.height = 0;
				this.rectPercent.width = this.rectPercent.height = 0;

				const region = this.$refs.region as HTMLDivElement;
				region.style.width = '0';
				region.style.height = '0';
				region.style.left = `${this.rectAbs.x / w}%`;
				region.style.top = `${this.rectAbs.y / h}%`;

				this.$nextTick(() => (this.showMenu = false));
			});
		}
	}

	private rectOff(e: MouseEvent) {
		if (!this.imgurl || !this.catchAvatar) return;
		//
		if (e.button == 0 && this.startRectFlag) {
			this.startRectFlag = false;

			this.$nextTick(() => {
				const region = this.$refs.region as HTMLDivElement;
				// console.log(region);

				this.rectPercent.x = parseFloat(this.$lodash.trimEnd(region.style.left, '%'));
				this.rectPercent.y = parseFloat(this.$lodash.trimEnd(region.style.top, '%'));
				this.rectPercent.width = parseFloat(this.$lodash.trimEnd(region.style.width, '%'));
				this.rectPercent.height = parseFloat(this.$lodash.trimEnd(region.style.height, '%'));

				this.menuPos.x = e.offsetX < this.rectAbs.x ? e.x + this.rectAbs.width : e.x;
				this.menuPos.y = e.offsetY < this.rectAbs.y ? e.y + this.rectAbs.height : e.y;
				this.$nextTick(() => {
					if (this.rectAbs.width <= 5 || this.rectAbs.height <= 5) return;
					else if (
						(this.imgSize.width * this.rectPercent.width) / 100 >= 128 &&
						(this.imgSize.height * this.rectPercent.height) / 100 >= 128
					) {
						this.showMenu = true;
					} else {
						this.$store.commit('snackbar', {
							text: 'サイズが足りない(128x128以上)',
							color: 'info'
						});
					}
				});
			});
		}
	}

	private updateRatio() {
		this.$nextTick(() => {
			if (this.$refs.img) {
				this.fitRatio = (this.$refs.img as Vue).$el.clientWidth / this.imgSize.width;
			}
		});
	}

	private resize = debounce(() => {
		this.showMenu = false;
		this.updateRatio();
	}, 300);

	// private resize() {
	// 	console.log(123);
	// 	this.$debounce(() => {
	// 		this.showMenu = false;
	// 		this.updateRatio();
	// 		console.log(this);
	// 	}, 300)();
	// }

	private rejectRect() {
		Object.keys(this.rectAbs).forEach(k => (this.rectAbs[k] = 0));
		Object.keys(this.rectPercent).forEach(k => (this.rectPercent[k] = 0));
		//
		// this.catchRect = false;
	}

	private acceptRect() {
		const regionFreeze = this.$refs['region-freeze'] as HTMLDivElement;
		regionFreeze.style.left = `${this.rectPercent.x}%`;
		regionFreeze.style.top = `${this.rectPercent.y}%`;
		regionFreeze.style.width = `${this.rectPercent.width}%`;
		regionFreeze.style.height = `${this.rectPercent.height}%`;
		//
		const region = this.$refs.region as HTMLDivElement;
		region.style.width = region.style.height = '0';
		//
		this.catchAvatar = false;
	}
}
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
