<template>
	<div>
		<v-card>
			<v-img contain :src="lyric.avatar" @load="imgLoaded" />

			<v-card-text v-html="lyric.lyric" />
		</v-card>
	</div>
</template>

<script>
export default {
	props: {
		lyric: {
			type: Object,
			required: false
		}
	},

	mounted() {
		if (this.lyric) {
			this.$sharp(this.lyric.imagePath)
				.toBuffer()
				.then(data => {
					this.image = `data:image/jpeg;base64,${data.toString('base64')}`;
				})
				.catch(err => {
					this.$store.commit('snackbar', { text: err, color: 'error' });
				});
		}

		console.log(this.lyric);
	},

	data() {
		return {
			image: null
		};
	},

	methods: {
		imgLoaded() {}
	}
};
</script>

<style lang="scss" scoped></style>
