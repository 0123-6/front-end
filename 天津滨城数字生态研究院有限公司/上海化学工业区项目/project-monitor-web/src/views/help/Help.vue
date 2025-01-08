<template>
	<!--帮助中心-->
	<div class="w-full flex flex-col">
		<iframe v-if="origin"
		        :src="'http://124.71.139.106:81/'" style="height: 100vh;"/>
	</div>
</template>

<script>
export default {
	name: "Help",
	computed: {
		origin() {
			return window.location.origin;
		}
	}
};
</script>

<style scoped>

</style>
