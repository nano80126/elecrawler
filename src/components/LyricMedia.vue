<template>
	<div>
		<v-row no-gutters align="start" justify="start">
			<v-col cols="12">
				<v-text-field
					v-model="url"
					filled
					rounded
					dense
					hide-details
					placeholder="Youtubeのリンク"
					class="mx-1"
					color="success"
				>
					<template v-slot:prepend-inner>
						<v-icon small class="mt-1 mr-1">fab fa-youtube</v-icon>
					</template>
				</v-text-field>
			</v-col>

			<v-col class="mt-3">
				<v-btn outlined icon class="mr-2">
					<v-icon small>fas fa-edit</v-icon>
				</v-btn>
			</v-col>
			<!-- <v-spacer></v-spacer> -->
			<v-col class="mt-3 text-right">
				<v-btn outlined icon class="ml-2">
					<v-icon small>far fa-image</v-icon>
				</v-btn>

				<v-btn outlined icon class="ml-2">
					<v-icon small>far fa-square</v-icon>
				</v-btn>

				<v-btn outlined icon class="ml-2" @click="removeImage">
					<v-icon small>fas fa-times</v-icon>
				</v-btn>
			</v-col>

			<v-col cols="12" class="mt-3">
				<!-- <v-card flat> -->
				<!-- <div class="d-flex align-center"> -->
				<v-responsive :aspect-ratio="4 / 3">
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
							flat
							class="no-select"
							@dragenter="dragging = true"
							@dragleave="dragging = false"
							@drop="dragging = false"
							min-width="75%"
						>
							<v-img v-if="imgurl" :src="imgurl" contain />
							<v-card-text v-else class="text-center">
								ドラッグ & ドロップ<br />
								<small>
									Drag image and drop here
								</small>
							</v-card-text>
							<input
								ref="file"
								type="file"
								@paste="onPaste"
								@change="onChange"
								@click.prevent
								title=""
								accept="image/jpeg,image/png,image/bmp"
							/>

							<v-card-text v-if="imgurl">
								{{ imgurl.length }}
							</v-card-text>
						</v-card>
					</div>
				</v-responsive>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			url: null,
			///
			imgurl: null,
			dragging: false,
			canPaste: false
		};
	},

	mounted() {
		// document.addEventListener('paste', e => {
		// 	console.log(e);
		// });
	},
	methods: {
		onPaste(e) {
			e.preventDefault();
			e.stopPropagation();

			const items = e.clipboardData.items;
			if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
				console.error('no image or not image');
				return;
			}

			const file = e.clipboardData.items[0].getAsFile();
			const objectUrl = URL.createObjectURL(file);
			console.log(file);
			console.log(objectUrl);
			this.imgurl = objectUrl;
		},

		onChange(e) {
			e.preventDefault();
			e.stopPropagation();

			const items = e.target.files || e.dataTransfer.files;
			if (items.length == 0 || !/^image\/(bmp|jpeg|png)/.test(items[0].type)) {
				console.error('no image or not image');
				return;
			}

			const file = items[0];
			const objectUrl = URL.createObjectURL(file);
			console.log(file);
			console.log(objectUrl);
			this.imgurl = objectUrl;
			this.$refs.file.value = null;
			// this.saveImage(file);
		},

		removeImage() {
			this.imgurl = null;
			this.$refs.file.value = null;
		},

		saveImage(file) {
			const reader = new FileReader();

			reader.addEventListener('load', load => {
				this.$fs.writeFile(
					'P:\\Users\\Administrator\\Pictures\\image.jpg',
					load.target.result,
					'binary',
					err => {
						console.log(err);
					}
				);
			});
			reader.readAsBinaryString(file);
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
}
</style>
