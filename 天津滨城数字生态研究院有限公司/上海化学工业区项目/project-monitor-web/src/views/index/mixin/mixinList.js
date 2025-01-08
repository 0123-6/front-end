export default {
	methods: {
		handleView(item) {
			if (item.projectId || item.projectId == 0) {
				this.$router.push({
					path: `/project/detail/${item.projectId}`,
				})
			} else {
				// 定义一个[0,20)的随机数
				const random = Math.floor(Math.random() * 20);
				this.$router.push(`/project/detail/${random}`);
			}
		},
		handleViewAll() {
			this.$router.push('/project');
		},
	},
}
