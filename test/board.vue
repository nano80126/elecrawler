
<script>
export default {
	props: {
		lyric: {
			type: [Object],
			required: true
		},
		exist: {
			type: Boolean,
			required: true
		}
	},
	mounted() {
		// console.log(this.$parent);
		// this.$dbList.count({}, (err, count) => {
		// 	console.log(err, count);
		// });

		console.log(this.lyric);
	},

	methods: {
		listAdd() {
			if (!this.lyric.exist) {
				this.$parent.listAdd();
				this.$emit('update:exist', true);
			}
		}
	}
};
</script>