<template>
	<div v-show="SHOW">
		<v-app style="background: transparent;">
			<v-card class="mx-auto" outlined min-width="480" style="border-radius: 10%;">
				<v-img class="align-end px-1" :src="require('@/assets/splash.png')">
					<v-card-text class="d-flex font-weight-black subtitle-1 orange--text text--darken-4">
						<span>Initializing...</span>
						<span class="ml-auto">{{ loadingMsg }}</span>
					</v-card-text>
				</v-img>
			</v-card>
			<!-- <v-app>
			<v-app-bar app height="32" color="blue-grey darken-4">
				<div class="window-drag header ml-n4" />

				<v-spacer />

				<v-btn min-width="24" width="36" text class="no-drag mr-n4" small @click="windowHide">
					<v-icon small>fas fa-times</v-icon>
				</v-btn>
			</v-app-bar>

			<v-main class="pl-3">
				<transition name="slideInOut" mode="out-in">
					<lyricMedia v-if="lyricsObj" :panelWindow="true" :extendImage="false" :lyricsObj="lyricsObj" />
				</transition>
			</v-main>-->
		</v-app>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
// import { AppModule } from '@/store/modules/app';

@Component({})
export default class App extends Vue {
	/**show after mounted */
	private SHOW = false;
	/**當前使用語言 */
	private language = this.$i18n.locale;
	/**載入中訊息 */
	private loadingMsg = '123';

	@Watch('language')
	onLanguageChange(value: string) {
		this.$i18n.locale = value;
	}

	created() {
		this.$ipcRenderer.on('InitializingMsg', (e, args) => {
			// console.info(args);
			this.loadingMsg = args.msg;
		});
	}

	mounted() {
		this.SHOW = true;
	}
}
</script>

<style lang="scss" scoped></style>
