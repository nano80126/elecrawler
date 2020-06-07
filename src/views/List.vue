<template>
	<div>
		<v-toolbar flat color="cyan" class="mx-auto">
			<!-- <v-toolbar-title> </v-toolbar-title> -->

			<v-text-field filled rounded dense hide-details placeholder="search">
				<template v-slot:prepend-inner>
					<v-icon small class="mt-1 mr-1">fas fa-search</v-icon>
				</template>
			</v-text-field>
			<!-- <v-spacer /> -->
			<!-- <v-btn icon>
				<v-icon small>fas fa-search</v-icon>
			</v-btn> -->
		</v-toolbar>

		<v-list two-line subheader>
			<v-subheader inset>sub header</v-subheader>
			<v-divider inset />

			<v-list-item v-for="n1 in 4" :key="n1">
				<v-list-item-avatar>
					<!-- <v-icon>fas fa-user</v-icon> -->
					<v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" />
				</v-list-item-avatar>

				<v-list-item-content>
					<v-list-item-title>{{ n1 }}</v-list-item-title>
					<v-list-item-subtitle>subtitle</v-list-item-subtitle>
				</v-list-item-content>
				<v-list-item-action>
					<v-btn icon>
						<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>

			<v-subheader inset>sub header</v-subheader>
			<v-divider inset />

			<v-list-item v-for="item in list" :key="item.uniqueKey">
				<v-list-item-avatar>
					<v-icon>far fa-user-circle</v-icon>
				</v-list-item-avatar>

				<v-list-item-content>
					<v-list-item-title>{{ item.title }}</v-list-item-title>
					<v-list-item-subtitle>{{ item.artist }}</v-list-item-subtitle>
				</v-list-item-content>
				<v-list-item-action>
					<v-btn icon>
						<v-icon color="grey lighten-1" small>fas fa-info-circle</v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>
		</v-list>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	computed: {},
	created() {
		this.$dbList.find({}, (err, doc) => {
			if (err) console.warn(err);
			this.list = doc;
			console.log(doc);
		});
	},
	mounted() {}
};
</script>

<style lang="scss" scoped></style>
