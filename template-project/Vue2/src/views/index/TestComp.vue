<template>
	<!--最外层-->
	<div ref="ref"
	     data-overlayscrollbars-initialize
	     class="m-8 w-[400px] h-[400px] flex flex-col bg-[red]"
	>
		<div class="w-[500px] h-[500px] flex flex-col bg-[orange]">
			<span class="text-[100px] leading-[100px]">五星红旗迎风飘扬</span>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import overlayScrollbar from "@/util/overlayScrollbar.ts";
import {OverlayScrollbars} from "overlayscrollbars";

export default defineComponent({
	name: "TestComp",
	data() {
		return {
			overlayScrollbar: null as unknown as OverlayScrollbars,
		}
	},
	created() {

	},
	mounted() {
		this.overlayScrollbar = overlayScrollbar({
			element: this.$refs.ref as HTMLDivElement,
		})
	},
	destroyed() {
		this.overlayScrollbar.destroy()
	},
	methods: {

	},
})
</script>



