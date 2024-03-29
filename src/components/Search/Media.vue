<template>
	<div>
		<v-row no-gutters align="start" justify="start" class="mr-3">
			<v-col cols="12">
				<v-toolbar flat dense height="40" color="transparent" class="px-0">
					<!-- v-if="!panelWindow" -->
					<v-btn
						v-if="isMainWindow"
						icon
						small
						class="ml-n4"
						width="36"
						height="36"
						@click="
							() => {
								this.$emit('update:extendImage', !this.extendImage);
								updateRatio();
							}
						"
					>
						<v-icon>{{ extendImage ? 'fas fa-chevron-right' : 'fas fa-chevron-left' }}</v-icon>
					</v-btn>

					<!-- <v-hover v-model="fieldHover"> -->
					<v-text-field
						v-model="activedURL"
						filled
						rounded
						dense
						hide-details
						placeholder="YouTubeのリンク"
						:class="isMainWindow ? 'ml-3' : 'ml-n4'"
						@mousewheel="mouseWheel"
						@blur="fieldBlur"
					>
						<template v-slot:prepend-inner>
							<v-badge :value="badge" :content="urlIndex + 1" overlap left bottom color="orange">
								<v-hover v-model="badge" close-delay="500">
									<v-icon left color="red" style="cursor: default">fab fa-youtube</v-icon>
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
								<span>{{ $t('total') }}: {{ urlObj.length }}</span>
							</v-tooltip>
						</template>
					</v-text-field>
					<!-- </v-hover> -->

					<v-tooltip left open-delay="300">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								icon
								outlined
								class="ml-3 mr-n4"
								color="primary lighten-2"
								dark
								width="36"
								height="36"
								@click="openWindow(lyricsObj.obj.title)"
								v-bind="attrs"
								v-on="on"
								style="position: relative"
							>
								<v-icon small>fab fa-chrome</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('externalBrowser') }}</span>
					</v-tooltip>
				</v-toolbar>
			</v-col>

			<v-col cols="12" class="mt-3 d-flex align-center">
				<v-chip class="mr-2 pr-4" color="light-blue" text-color="white">
					{{ imgSize.width }} &times; {{ imgSize.height }}
					<v-icon right small>fas fa-expand</v-icon>
				</v-chip>
				<!-- // -->
				<v-chip class="mr-2 pr-4" color="light-green" text-color="white">
					{{ $lodash.round(imgZoomRatio * 100, 2) }}
					<v-icon right small>fas fa-percentage</v-icon>
				</v-chip>
				<v-spacer />
				<!-- // -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							outlined
							class="ml-2"
							@click="getVideoImg"
							v-bind="attrs"
							v-on="on"
							:disabled="activedURL == null || activedURL.length == 0"
						>
							<v-icon small>fas fa-photo-video</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('getYouTubeCover') }}</span>
				</v-tooltip>
				<!-- // -->
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
					<span>{{ $t('selectImage') }}</span>
				</v-tooltip>
				<!-- // -->
				<v-tooltip bottom open-delay="300">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							outlined
							class="ml-2"
							:class="{ 'blue-grey darken-2': canRectCapture }"
							:disabled="!imgBuffer"
							@click="canRectCapture = !canRectCapture"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon small style="transform: rotate(90deg)">fas fa-crop-alt</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('avatarImage') }}</span>
				</v-tooltip>
				<!-- // -->
				<v-tooltip bottom open-delay="300">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon outlined class="ml-2" @click="removeImage" v-bind="attrs" v-on="on">
							<v-icon small>fas fa-times</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('removeImage') }}</span>
				</v-tooltip>
			</v-col>
		</v-row>

		<!-- height: 32+88+12+12 = 144 -->
		<div
			class="min-scroll y info-scroll mt-3 pr-3"
			:style="{ height: isMainWindow ? `${$root.webHeight - 144 - 24}px` : `${$root.webHeight - 144}px` }"
			@scroll.stop="scrollStop"
		>
			<v-row no-gutters align="start" justify="start">
				<v-col cols="12" class="">
					<v-responsive :aspect-ratio="16 / 9">
						<div
							class="image-zone d-flex align-center justify-center pa-3"
							:class="{ 'drag-hover': dragging, 'drag-focus': canPaste }"
						>
							<div
								tabindex="0"
								ref="paste-zone"
								class="paste-zone"
								@paste="onPaste"
								@focus="canPaste = true"
								@blur="canPaste = false"
								style="outline: 0"
							/>

							<v-card
								id="imgCard"
								:width="imgBuffer ? 'auto' : '75%'"
								flat
								class="no-select rounded-lg transparent"
								@dragenter.capture="dragging = true"
								@dragleave.capture="dragging = false"
								@drop.capture="dragging = false"
								ref="imgCard"
								:ripple="!canRectCapture"
								@mousedown.left="rectOn"
								@mousedown.right="rectRst"
								@mouseup="rectOff"
								@mousemove="crossMove"
								@mouseleave="crossReset"
								@click="focusPasteZone"
							>
								<transition name="imagFadeIn">
									<v-img
										v-if="imgBuffer"
										:src="`data:image/jpeg;base64,${imgBuffer.toString('base64')}`"
										contain
										:max-width="imgSize.width > 0 ? imgSize.width : null"
										:max-height="imgSize.height > 0 ? imgSize.height : null"
										ref="img"
										v-resize="resize"
										@load="updateRatio"
										style="border-radius: inherit; margin: auto"
									>
										<template v-if="canRectCapture">
											<div id="small-region" ref="region" />
											<div id="crosshair-h" class="hair" ref="hairH" />
											<div id="crosshair-v" class="hair" ref="hairV" />
											<span id="mousepos" ref="pos" v-text="'X:0, Y:0'" />
										</template>
										<div id="small-region-freeze" ref="region-freeze" />
									</v-img>
									<v-card-text
										v-else
										class="text-center grey darken-2 rounded-lg"
										style="width: 100%"
									>
										<template v-if="$t('dragAndDrop')">
											{{ $t('dragAndDrop') }}
											<br />
											<small>Drag image and drop here</small>
										</template>
										<template v-else> Drag image and drop here </template>
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

				<v-col cols="12" class="mt-3">
					<editPanel :urlObjArray.sync="urlObj" />
				</v-col>
				<v-col cols="3" offset="9" xl="2" offset-xl="10" class="mt-3 text-right">
					<v-btn block outlined @click="saveMedia">
						<div style="position: relative">
							<v-icon class="opa-75">fas fa-list</v-icon>
							<v-icon x-small color="cyan" class="small-icon">fas fa-save</v-icon>
						</div>
						<span class="ml-2 font-weight-bold">{{ $t('save') }}</span>
					</v-btn>
				</v-col>
			</v-row>

			<!-- <template v-if="true">
				<div>
					abs: {{ rectAbs }}
					<br />
					abs: {{ rectAbsBack }}
					<br />
					%: {{ rectPercent }}
					<br />
					%: {{ rectPercentBack }}
					<br />
					imgSize: {{ imgSize }}
					<br />
					{{ imgBuffer ? imgBuffer.length : 0 }}
				</div>

				<div v-for="(item, index) in lyricsObj.obj" :key="index">
					{{ index != 'lyrics' ? `${index}: ${item}` : null }}
				</div>
				{{ lyricsObj.obj.key }}
				<br />

				<div v-for="item in urlObj" :key="item.id">
					{{ item }}
				</div>
			</template> -->
		</div>

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
import edit from '@/components/Search/Edit.vue';

import { AppModule, Colors } from '@/store/modules/app';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { IlyricsSearched, IyouTubeObj, IsongList, Irectangle } from '@/types/renderer';
import { OutputInfo } from 'sharp';
import { EfsOn, EmongoOn, EsharpOn } from '@/types/enum';

@Component({
	components: {
		editPanel: edit,
	},
})
export default class Media extends Vue {
	/**是否為panel window */
	// @Prop({ required: false, default: false }) panelWindow?: boolean;

	/**是否可以切換大圖 */
	@Prop({ required: false, default: true }) canExtendImage?: boolean;

	/**是否使用大圖 */
	@Prop({ required: true }) extendImage!: boolean;

	/**Lyric Object，儲存用 */
	@Prop({ required: true }) lyricsObj!: IlyricsSearched;

	/**YouTube obj array */
	private urlObj: IyouTubeObj[] = [{ videoUrl: '' }];
	/**顯示之YouTube url之index */
	private urlIndex = 0;
	/**開啟dialog後，disable按鈕，避免重複開啟 */
	private disableDialog = false;
	/**image buffer */
	private imgBuffer: Buffer | null = null;
	/**是否顯示badge，顯示現在儲存的youtube url數量 */
	private badge = false;
	/**badge隱藏之timeout */
	private badgeTimeout: number | null = null;
	/**是否有圖片將要拉進 */
	private dragging = false;
	/**是否可以貼上？當圖片區域focus時為true */
	private canPaste = false;
	/**是否可以框選icon */
	private canRectCapture = false;
	/**是否開始框選icon */
	private onRectStart = false;

	/**滑鼠位置 */
	// private mousePos = { x: 0, y: 0 };

	/**是否顯示確認menu，確認縮圖範圍 */
	private showMenu = false;
	/**menu 位置 */
	private menuPos = { x: 0, y: 0 };
	/**縮圖Rectangle absolute */
	private rectAbs: Irectangle = { x: 0, y: 0, width: 0, height: 0 };
	/**縮圖Rectangle Percent */
	private rectPercent: Irectangle = { x: 0, y: 0, width: 0, height: 0 };
	/**縮圖Rectangle absolute */
	private rectAbsBack: Irectangle = { x: 0, y: 0, width: 0, height: 0 };
	/**縮圖Rectangle Percent */
	private rectPercentBack: Irectangle = { x: 0, y: 0, width: 0, height: 0 };
	/**圖片原始大小 */
	private imgSize = { width: 0, height: 0 };
	/**圖片縮放率 */
	private imgZoomRatio = 0;
	/** */
	// private thumbnailList: Array<string> = [];

	/**是否為 Main Window */
	get isMainWindow(): boolean {
		return AppModule.isMain;
	}
	/**當前顯示URL */
	get activedURL(): string {
		return this.urlObj[this.urlIndex].videoUrl || '';
	}
	/**更改當前顯示URL */
	set activedURL(value: string) {
		if (!value) this.urlObj[this.urlIndex].videoUrl = '';
		else this.urlObj[this.urlIndex].videoUrl = value;
	}

	@Watch('urlIndex')
	onUrlIndexChanged(): void {
		this.badge = true;

		if (this.badgeTimeout) clearTimeout(this.badgeTimeout);
		this.$nextTick(() => {
			this.badgeTimeout = window.setTimeout(() => {
				this.badge = false;
			}, 1000);
		});
	}
	@Watch('lyricsObj.obj.lyricsKey')
	onLyricsKeyChanged(): void {
		this.loadLyricsObj();
	}

	@Watch('canRectCapture')
	onOnRectChanged(bool: boolean): void {
		if (bool) {
			const keyon = (e: KeyboardEvent) => {
				if (e.key == 'Escape') {
					this.canRectCapture = false;
					this.onRectStart = false;
					if (this.showMenu) {
						this.rejectRect();
						this.showMenu = false;
					}

					this.$nextTick(() => {
						window.removeEventListener('keyup', keyon);
					});
				}
			};
			window.addEventListener('keyup', keyon);
		}
	}

	// @Watch('canPaste')
	// onCanPasteChanged(bool: boolean) {
	// 	console.log(bool);
	// }

	mounted(): void {
		this.loadLyricsObj();
	}

	/**載入歌詞物件，包含影片與圖片 */
	private loadLyricsObj() {
		this.$ipcRenderer
			.invoke(EmongoOn.LISTFINDONE, { query: { lyricsKey: this.lyricsObj.obj.lyricsKey } })
			.then((doc: IsongList) => {
				if (doc.imagePath) {
					this.$ipcRenderer
						.invoke(EsharpOn.LOADIMAGEBYPATH, { path: doc.imagePath })
						.then((res: { data: Buffer; info: OutputInfo }) => {
							this.imgBuffer = Buffer.from(res.data);

							this.$nextTick(() => {
								const { width, height } = res.info;
								this.$set(this.imgSize, 'width', width);
								this.$set(this.imgSize, 'height', height);

								const regionFreeze = this.$refs['region-freeze'] as HTMLElement;
								if (regionFreeze && doc.rectangle) {
									this.rectPercent = doc.rectangle;
									regionFreeze.style.left = `${this.rectPercent.x}%`;
									regionFreeze.style.top = `${this.rectPercent.y}%`;
									regionFreeze.style.width = `${this.rectPercent.width}%`;
									regionFreeze.style.height = `${this.rectPercent.height}%`;
								}
							});
						})
						.catch((err: Error) => {
							this.$store.commit('snackbar', { text: err.message, color: 'error' });
						});
				}
				// 先判斷 videoArr存在
				if (doc.videoArr) this.urlObj = doc.videoArr;
			})
			.catch((error) => {
				AppModule.snackbar({ text: error, color: Colors.Error });
			});
	}

	/**開啟外部瀏覽器搜尋 */
	private openWindow(keyWord: string): void {
		const url = `https://www.youtube.com/results?search_query=${keyWord}`;
		this.$shell.openExternal(url);
	}

	/**切換顯示之YouTube URL */
	private mouseWheel(e: WheelEvent): void {
		if (e.deltaY > 0) {
			this.urlIndex = this.urlIndex + 1 > this.urlObj.length - 1 ? this.urlObj.length - 1 : this.urlIndex + 1;
		} else {
			this.urlIndex = this.urlIndex - 1 < 0 ? 0 : this.urlIndex - 1;
		}
	}

	/**URL Text filed不為Focus狀態，呼叫YouTube v3 API */
	private fieldBlur(/*e*/): void {
		this.urlObj.forEach((item, itemKey: number) => {
			if (item.videoUrl.length > 0) {
				const id = item.videoUrl.match(/(?<=^https:\/\/.+?v=).{11}(?=.*$)/);
				if (id && id[0].length == 11 && item.videoID !== id[0]) {
					this.$axios
						.get('https://www.googleapis.com/youtube/v3/videos', {
							params: {
								part: 'snippet, status',
								id: id[0],
								key: process.env.VUE_APP_YOUTUBE_DATA_API_KEY,
							},
						})
						.then((res) => {
							if (res.data.items[0].status.embeddable) {
								const thumbs = res.data.items[0].snippet.thumbnails;
								const thumbsArray = Object.keys(thumbs)
									.map((key) => {
										// Object 轉陣列
										return thumbs[key];
									})
									.sort((a, b) => {
										// 大小排序
										return b.width - a.width;
									});

								this.$set(
									this.urlObj,
									itemKey,
									Object.assign(item, {
										videoID: id[0],
										videoTitle: res.data.items[0].snippet.title,
										thumbnail: thumbsArray.length > 0 ? thumbsArray[0] : undefined,
									})
								);
							} else {
								AppModule.snackbar({ text: this.$t('notEmbeddable') as string, color: Colors.Info });
								this.urlIndex = itemKey;
							}
						})
						.catch((err) => {
							AppModule.snackbar({ text: err, color: Colors.Error });
						});
				}
			} else {
				// 若URL為空，清空title
				this.$set(this.urlObj, itemKey, Object.assign(item, { videoID: undefined, videoTitle: undefined }));
			}
		});
	}

	/**新增 Url */
	private addUrl(): void {
		this.urlObj.push({ videoUrl: '' });
		this.urlIndex = this.urlObj.length - 1;
	}

	/**取得 YouTubew 圖片 */
	private async getVideoImg(e: Event): Promise<void> {
		e.preventDefault();
		e.stopPropagation();

		const thumbnailUrl = this.urlObj[this.urlIndex].thumbnail?.url;
		if (thumbnailUrl) {
			this.$ipcRenderer
				.invoke(EsharpOn.GETVIDEOIMAGE, { URL: thumbnailUrl })
				.then((res) => {
					if (res.Error) {
						AppModule.snackbar({ text: res.message, color: Colors.Error });
						return;
					}
					this.imgBuffer = Buffer.from(res.data);

					const { width, height } = res.info;
					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', width);
						this.$set(this.imgSize, 'height', height);
					});
				})
				.catch((err) => {
					AppModule.snackbar({ text: err, color: Colors.Error });
				});
		} else {
			// AppModule.snackbar({ text: '無効なURL', color: Colors.Warning });
			// AppModule.snackbar({ text: this.$t('invalidURL') as string, color: Colors.Warning });
			AppModule.snackbar({ text: this.$t('unableGetThumbnail') as string, color: Colors.Warning });
		}
	}

	/**Paste Zone 獲得焦點 */
	private focusPasteZone() {
		if (!this.canRectCapture) {
			(this.$refs['paste-zone'] as HTMLElement).focus();
		}
	}

	/**黏貼事件 */
	private onPaste(e: ClipboardEvent): void {
		e.preventDefault();
		e.stopPropagation();

		const items = e.clipboardData?.files;
		if (items == undefined || items.length == 0) {
			// no items
			AppModule.snackbar({ text: this.$t('noImage') as string, color: Colors.Warning });
			return;
		}

		const file = items[0] as File;
		const reader = new FileReader();

		reader.addEventListener('load', (loadEvent: ProgressEvent<FileReader>) => {
			const buf = loadEvent.target?.result;

			this.$ipcRenderer
				.invoke(EsharpOn.TOBUFFER, { buffer: buf })
				.then((res) => {
					this.imgBuffer = null; // 先設為 null, 否則大小會有問題

					this.$nextTick(() => {
						this.imgBuffer = Buffer.from(res.data);

						const { width, height } = res.info;
						this.$nextTick(() => {
							this.$set(this.imgSize, 'width', width);
							this.$set(this.imgSize, 'height', height);
						});
						(e.target as HTMLElement).blur();
					});
				})
				.catch((err) => {
					AppModule.snackbar({ text: err, color: Colors.Error });
				});
		});
		reader.readAsArrayBuffer(file);
	}

	/**圖檔路徑 Change 事件 */
	private onChange(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		// const items = ((e.target as HTMLInputElement).files || e.dataTransfer.files) as File[];
		const items = (e.target as HTMLInputElement).files;
		if (items && !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
			AppModule.snackbar({ text: this.$t('invalidImage') as string, color: Colors.Warning });
			return;
		}

		const filePath = items && items[0].path;

		this.$ipcRenderer
			.invoke(EsharpOn.TOBUFFER, { path: filePath })
			.then((res: { data: Buffer; info: OutputInfo }) => {
				this.imgBuffer = null;

				this.$nextTick(() => {
					this.imgBuffer = Buffer.from(res.data);

					const { width, height } = res.info;
					this.$nextTick(() => {
						this.$set(this.imgSize, 'width', width);
						this.$set(this.imgSize, 'height', height);
					});
				});
			})
			.catch((err) => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			});

		(e.target as HTMLInputElement).value = ''; // set file content to null
	}

	/**Dialog 選擇圖片 */
	private dialogImage() {
		this.disableDialog = true;

		this.$ipcRenderer
			.invoke(EsharpOn.LOADIMAGEBYDIALOG)
			.then((res: { data: Buffer; info: OutputInfo }) => {
				if (res.data !== null) {
					this.imgBuffer = null;

					this.$nextTick(() => {
						this.imgBuffer = Buffer.from(res.data);

						const { width, height } = res.info;
						this.$nextTick(() => {
							this.$set(this.imgSize, 'width', width);
							this.$set(this.imgSize, 'height', height);
						});
					});
				}
			})
			.catch((err) => {
				AppModule.snackbar({ text: err, color: Colors.Error });
			})
			.finally(() => {
				this.disableDialog = false;
			});
	}

	/**儲存Media資料 */
	private saveMedia(): void {
		if (this.imgBuffer) {
			// 圖片存在

			const x = Math.round((this.imgSize.width * this.rectPercent.x) / 100);
			const y = Math.round((this.imgSize.height * this.rectPercent.y) / 100);
			const w = Math.round((this.imgSize.width * this.rectPercent.width) / 100);
			const h = Math.round((this.imgSize.height * this.rectPercent.height) / 100);

			this.$ipcRenderer
				.invoke(EsharpOn.SAVEIMAGE, {
					buffer: this.imgBuffer,
					key: this.lyricsObj.obj.lyricsKey,
					size: { left: x, top: y, width: w, height: h },
				})
				.then((res: OutputInfo[]) => {
					// if (res.Error) {
					// 	AppModule.snackbar({ text: res.message, color: Colors.Error });
					// 	return;
					// }

					const { obj } = this.lyricsObj;
					const picPath = AppModule.picPath;
					// this.urlObj = this.$lodash.compact(this.urlObj);
					this.urlIndex = 0; // Set index to 0 or maybe return url not in urlObj
					// 移除url為空
					this.urlObj = this.urlObj.filter((e) => e.videoUrl && e.videoUrl.length > 0);
					// 去頭尾空白
					this.urlObj.forEach((e) => (e.artist = e.artist?.replace(/(^\s+)|(\s+$)/g, '')));

					this.$ipcRenderer
						.invoke(EmongoOn.LISTSAVE, {
							query: { lyricsKey: obj.lyricsKey },
							data: {
								$set: {
									videoArr: this.urlObj,
									imagePath: res[0] ? `${picPath}\\${obj.lyricsKey}.jpg` : undefined,
									iconPath: res[1] ? `${picPath}\\${obj.lyricsKey}.icon.jpg` : undefined,
									imageSize: this.imgSize,
									rectangle: this.rectPercent,
									datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
								},
							},
						})
						.then((res) => {
							if (res.ok > 0) {
								AppModule.snackbar({ text: '変更が保存された', color: Colors.Success });
							}
						})
						.catch((err2: Error) => {
							AppModule.snackbar({ text: err2.message, color: Colors.Error });
						});
				})
				.catch((err: Error) => {
					AppModule.snackbar({ text: err.message, color: Colors.Error });

					const { obj } = this.lyricsObj;
					this.$ipcRenderer.send(EfsOn.REMOVEPIC, {
						files: [`${obj.lyricsKey}.jpg`, `${obj.lyricsKey}.icon.jpg`],
					});
				});
		} else {
			// 圖片不存在
			const { obj } = this.lyricsObj;

			this.urlIndex = 0;
			// 移除url為空
			this.urlObj = this.urlObj.filter((e) => e.videoUrl && e.videoUrl.length > 0);
			// 去頭尾空白
			this.urlObj.forEach((e) => (e.artist = e.artist?.replace(/(^\s+)|(\s+$)/g, '')));

			this.$ipcRenderer
				.invoke(EmongoOn.LISTSAVE, {
					query: { lyricsKey: obj.lyricsKey },
					data: {
						$set: {
							videoArr: this.urlObj,
							imagePath: undefined,
							imageSize: undefined,
							rectangle: undefined,
							iconPath: undefined,
							datetime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
						},
					},
				})
				.then((res) => {
					if (res.ok > 0) {
						this.$ipcRenderer.send(EfsOn.REMOVEPIC, {
							files: [`${obj.lyricsKey}.jpg`, `${obj.lyricsKey}.icon.jpg`],
						});
						AppModule.snackbar({ text: '変更が保存された', color: Colors.Success });
					}
				})
				.catch((err: Error) => {
					AppModule.snackbar({ text: err.message, color: Colors.Error });
				});
		}
	}

	/**移除圖片, 重置 rect */
	private removeImage(): void {
		this.imgBuffer = null; // 重置 imgBuffer
		this.imgSize.width = this.imgSize.height = 0; // 重置 imgSize
		this.imgZoomRatio = 0; // 重置縮小倍率
		Object.assign(this.rectAbs, { x: 0, y: 0, width: 0, height: 0 }); // 重置 rect
		Object.assign(this.rectPercent, { x: 0, y: 0, width: 0, height: 0 }); // 重置 rect
		// // // // //
		this.canRectCapture = false;
		this.onRectStart = false;
		this.showMenu = false;
	}

	/**Mousemove Event, show mouse position txt, if mousedown capture icon */
	private crossMove(e: MouseEvent): void {
		if (!this.imgBuffer || !this.canRectCapture) return;

		const x = e.offsetX - 2 < 0 ? 0 : e.offsetX - 2;
		const y = e.offsetY - 2 < 0 ? 0 : e.offsetY - 2;
		(this.$refs.hairV as HTMLLIElement).style.left = `${e.offsetX}px`; // crosshairV pos
		(this.$refs.hairH as HTMLLIElement).style.top = `${e.offsetY}px`; // crosshairV pos
		(this.$refs.pos as HTMLLIElement).innerText = `X:${x}, Y:${y}`; // show mouse pos

		if (this.onRectStart) {
			const w = (this.$refs.img as Vue).$el.clientWidth;
			const h = (this.$refs.img as Vue).$el.clientHeight;

			const region = this.$refs.region as HTMLDivElement;

			if (e.offsetX < this.rectAbs.x) region.style.left = `${(100 * e.offsetX) / w}%`;
			else region.style.left = `${(100 * this.rectAbs.x) / w}%`;
			if (e.offsetY < this.rectAbs.y) region.style.top = `${(100 * e.offsetY) / h}%`;
			else region.style.top = `${(100 * this.rectAbs.y) / h}%`;

			this.rectAbs.width = Math.abs(e.offsetX - this.rectAbs.x) + 1;
			this.rectAbs.height = Math.abs(e.offsetY - this.rectAbs.y) + 1;
			region.style.width = `${(100 * this.rectAbs.width) / w}%`;
			region.style.height = `${(100 * this.rectAbs.height) / h}%`;
		}
	}

	/**Mouseleave Event, reset crosshair, position text */
	private crossReset(e: MouseEvent) {
		if (!this.imgBuffer || !this.canRectCapture) return;

		(this.$refs.hairH as HTMLDivElement).style.top = '0';
		(this.$refs.hairV as HTMLDivElement).style.left = '0';
		(this.$refs.pos as HTMLSpanElement).innerText = 'X:0, Y:0';

		this.rectOff(e);
	}

	/**Mousedown Event, start capture region */
	private rectOn(e: MouseEvent) {
		if (!this.imgBuffer || !this.canRectCapture) return;

		if (this.showMenu) {
			this.rejectRect();
			this.showMenu = false;
			return;
		}
		// 左鍵按下
		if (e.button == 0) {
			this.onRectStart = true;
			Object.assign(this.rectAbsBack, this.rectAbs); // backup rectAbs setting
			Object.assign(this.rectPercentBack, this.rectPercent); // backup rectPercent setting

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
			});
		}
	}

	/**Mouseup Event, check region size and show menu */
	private rectOff(e: MouseEvent) {
		if (!this.imgBuffer || !this.canRectCapture) return;

		// 左鍵放開
		if (e.button == 0 && this.onRectStart) {
			this.onRectStart = false;
			if (this.rectAbs.width <= 5 || this.rectAbs.height <= 5) return;

			this.$nextTick(() => {
				const region = this.$refs.region as HTMLDivElement;

				this.rectPercent.x = parseFloat(this.$lodash.trimEnd(region.style.left, '%'));
				this.rectPercent.y = parseFloat(this.$lodash.trimEnd(region.style.top, '%'));
				this.rectPercent.width = parseFloat(this.$lodash.trimEnd(region.style.width, '%'));
				this.rectPercent.height = parseFloat(this.$lodash.trimEnd(region.style.height, '%'));

				this.menuPos.x = e.offsetX < this.rectAbs.x ? e.x + this.rectAbs.width : e.x;
				this.menuPos.y = e.offsetY < this.rectAbs.y ? e.y + this.rectAbs.height : e.y;
				this.$nextTick(() => {
					// if (this.rectAbs.width <= 5 || this.rectAbs.height <= 5) return;
					// else
					if (
						(this.imgSize.width * this.rectPercent.width) / 100 >= 128 &&
						(this.imgSize.height * this.rectPercent.height) / 100 >= 128
					) {
						this.showMenu = true;
					} else {
						this.rejectRect();
						AppModule.snackbar({ text: 'サイズが足りない(128x128以上)', color: Colors.Info });
					}
				});
			});
		}
	}

	/**重置 Rect */
	private rectRst() {
		if (!this.imgBuffer || !this.canRectCapture) return;

		Object.assign(this.rectAbs, { x: 0, y: 0, width: 0, height: 0 });
		Object.assign(this.rectPercent, { x: 0, y: 0, width: 0, height: 0 });

		const regionFreeze = this.$refs['region-freeze'] as HTMLDivElement;
		regionFreeze.style.left = `${this.rectPercent.x}%`;
		regionFreeze.style.top = `${this.rectPercent.y}%`;
		regionFreeze.style.width = `${this.rectPercent.width}%`;
		regionFreeze.style.height = `${this.rectPercent.height}%`;
		// set temp rect min
		const region = this.$refs.region as HTMLDivElement;
		region.style.left = region.style.top = '0';
		region.style.width = region.style.height = '0';
		// close menu
		this.$nextTick(() => {
			this.showMenu = false;
		});
	}

	/**更新縮放率 */
	private updateRatio() {
		this.$nextTick(() => {
			if (this.$refs.img) {
				this.imgZoomRatio = (this.$refs.img as Vue).$el.clientWidth / this.imgSize.width;
			}
		});
	}

	/**視窗 resize 事件 */
	private resize = this.$lodash.debounce(() => {
		if (this.showMenu) {
			this.rejectRect();
			this.showMenu = false;
		}
		this.updateRatio();
	}, 300);

	/**scroll 滾動 */
	private scrollStop() {
		if (this.showMenu) {
			this.rejectRect();
			this.showMenu = false;
		}
	}

	/**拒絕框選 Rect */
	private rejectRect() {
		// 復原到紀錄的rect
		Object.assign(this.rectAbs, this.rectAbsBack);
		Object.assign(this.rectPercent, this.rectPercentBack);
		//
		const region = this.$refs.region as HTMLDivElement;
		region.style.left = region.style.top = '0';
		region.style.width = region.style.height = '0';
	}

	/**接受框選 Rect */
	private acceptRect() {
		const regionFreeze = this.$refs['region-freeze'] as HTMLDivElement;
		regionFreeze.style.left = `${this.rectPercent.x}%`;
		regionFreeze.style.top = `${this.rectPercent.y}%`;
		regionFreeze.style.width = `${this.rectPercent.width}%`;
		regionFreeze.style.height = `${this.rectPercent.height}%`;
		// set temp rect min
		const region = this.$refs.region as HTMLDivElement;
		region.style.left = region.style.top = '0';
		region.style.width = region.style.height = '0';
		//
		this.canRectCapture = false;
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
		border-radius: 8px;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border: 10px solid rgba($color: orange, $alpha: 0.24);
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

#icon-region {
	position: absolute;
	top: calc(50% - 64px);
	left: calc(50% - 64px);
	width: 128px;
	height: 128px;
	// margin-top: -2px;
	// margin-left: -2px;
	border: 1px solid rgba(cyan, 0.48);
	background-color: rgba(darkcyan, 0.24);
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
	border-top: 1px dotted #888;
	border-left: 1px dotted #888;
	pointer-events: none;
}

#mousepos {
	position: absolute;
	top: 0;
	left: 0;
	padding: 5px;
	margin: 8px;
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

.small-icon {
	position: absolute;
	right: -5px;
	bottom: -3px;
}
</style>
