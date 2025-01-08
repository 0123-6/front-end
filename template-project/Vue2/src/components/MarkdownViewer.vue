<template>
	<!--最外层-->
	<div class="w-full">
		<div ref="markdownRef" class="w-full"></div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Editor from "@toast-ui/editor";
if (import.meta.env.DEV) {
	import('@toast-ui/editor/dist/toastui-editor.css')
}
import '@/style/markdown.css'

export default defineComponent({
	name: "MarkdownViewer",
	props: {
		value: {
			type: String,
			required: false,
			default: '',
		},
	},
	data() {
		return {
			viewer: null,
		}
	},
	mounted() {
		this.viewer = Editor.factory({
			el: this.$refs.markdownRef,
			viewer: true,
			height: '600px',
			minHeight: '600px',
			initialValue: this.value
		});
	},
	methods: {

	},
})
</script>


