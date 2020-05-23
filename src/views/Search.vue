<template>
	<div>
		<v-row no-gutters align="center" justify="center">
			<v-col cols="12" class="px-3">
				<v-radio-group v-model="searchType" row :mandatory="true" class="mt-0">
					<v-radio label="歌手名" value="artist" />
					<v-radio label="曲名" value="title" />
				</v-radio-group>
			</v-col>
			<v-col>
				<v-text-field
					v-model="text"
					dense
					outlined
					single-line
					:label="types[searchType]"
					prepend-inner-icon="fa-search"
					hide-details
				/>
			</v-col>
			<v-col cols="auto" class="pl-3">
				<v-btn color="success" outlined height="40" @click="lyricSearch">
					<span class="mr-2">SEND</span>
					<v-icon small>fas fa-leaf</v-icon>
				</v-btn>
			</v-col>
			<v-col cols="12">
				<!-- {{ searchType }} -->

				<transition-group name="cardList">
					<v-card class="mx-auto mt-3" v-for="item in list" :key="item.href">
						<v-card-title>{{ item.title }}</v-card-title>
						<v-card-subtitle>{{ item.artist }}</v-card-subtitle>

						<v-divider />
						<v-card-actions>
							<v-spacer />
							<v-btn icon @click="item.expanded = !item.expanded">
								<v-icon>{{ item.expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down' }}</v-icon>
							</v-btn>
						</v-card-actions>
						<v-expand-transition>
							<div v-show="item.expanded">
								<v-divider />
								<v-card-text>{{ item.lyric }}</v-card-text>
							</div>
						</v-expand-transition>
					</v-card>
				</transition-group>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			text: null,

			list: [],

			searchType: 'artist',
			types: Object.freeze({
				artist: '歌手名',
				title: '曲名'
			})
		};
	},
	computed: {
		// textFieldHeight() {
		// 	return this.$refs.btn.clientHeight;
		// }
	},

	created() {},
	mounted() {
		const included = this.$ipcRenderer.eventNames().includes('searchRes');
		if (!included) {
			// 當連線錯誤產生
			this.$ipcRenderer.on('searchRes', (e, args) => {
				if (args.error) {
					console.error(args.error);
				}
				this.list = args.list;
				console.log(args.list);
			});
		}
	},

	methods: {
		lyricSearch() {
			this.$ipcRenderer.send('searchReq', {
				type: this.searchType,
				text: this.text
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cardList-enter-active,
.cardList-leave-active {
	transition: all 0.5s;
}
.cardList-enter {
	opacity: 0.3;
	transform: translateX(30px);
}

.cardList-leave-to {
	opacity: 0;
}
</style>
