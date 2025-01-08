<template>
	<!--最外层-->
	<div class="flex flex-col bg-primary">
		<span class="text-[20px]">模块3</span>
		<span @click="myClick">发生请求</span>
		<img v-for="(item, index) in list"
		     :key="index"
		     :data-src="item" alt=""
		     class="flex w-full h-[600px]"
		     v-lazyload>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "ModuleThree",
	data() {
		return {
			list: [
				'https://assets-cdn.jable.tv/contents/videos_screenshots/37000/37018/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/4000/4831/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/14000/14560/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/25000/25053/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/34000/34154/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/5000/5650/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/6000/6159/320x180/1.jpg',
				'https://assets-cdn.jable.tv/contents/videos_screenshots/26000/26482/320x180/1.jpg',
			],
		}
	},
	methods: {
		async myClick() {
			const response = await fetch('/api/search', {
				method: 'GET',
			})
			if (response.ok) {
				const responseData = await response.json()
				console.log(responseData)
			}
		},
	},
})
</script>
