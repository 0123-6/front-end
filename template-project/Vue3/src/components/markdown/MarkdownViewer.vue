<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Editor} from "@toast-ui/editor";
if (import.meta.env.DEV) {
	import('@toast-ui/editor/dist/toastui-editor.css')
}
import '@/components/markdown/markdown.css'

// state
const props = defineProps({
	value: {
		type: String,
		required: false,
		default: '',
	},
})
const editor = ref()
const markdownRef = ref<HTMLElement>()
// mounted
onMounted(() => {
	editor.value = Editor.factory({
		el: markdownRef.value,
		viewer: true,
		height: '600px',
		minHeight: '600px',
		initialValue: props.value,
	})
})
// methods

</script>

<template>
	<!--最外层-->
	<div class="hpj w-full">
		<div ref="markdownRef" class="w-full"></div>
	</div>
</template>


