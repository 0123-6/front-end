<template>
	<!--最外层-->
	<div class="w-full h-full flex flex-col">
		<span class="text-xl">模块2的详情页面</span>
		<span>{{id}}</span>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "ModuleTwoDetail",
	props: {
		id: {
			type: Number | String,
			required: true,
		}
	}
})
</script>

